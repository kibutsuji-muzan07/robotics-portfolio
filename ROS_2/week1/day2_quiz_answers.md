# Week 1 – Day 2 Quiz Answers

## Q1. What is a ROS 2 node, in your own words? What problem does splitting a robot's software into multiple nodes solve?

A ROS 2 node is a single running program that takes responsibility for one focused part of a robot’s behavior, such as reading a sensor, controlling a motor, or running a planner. Each node can communicate with other nodes using topics, services, actions, and parameters, but it is developed and executed as its own process.

Splitting a robot’s software into multiple nodes solves the problem of having one huge, tangled “god program” that does everything and is hard to debug, scale, or reuse. With nodes, you can develop, test, restart, and replace individual pieces (like a camera driver or a controller) without touching the rest of the system, and you can distribute computation across multiple machines if needed.

---

## Q2. Explain the publish/subscribe pattern. Why is the decoupling between publisher and subscriber valuable — give a specific example involving a drone sensor.

In the publish/subscribe pattern, data flows through a *topic* with a fixed message type, and any number of publishers can send messages to that topic while any number of subscribers can listen to it. Publishers and subscribers do not know about each other directly; they only agree on the topic name and message type, and the ROS 2 middleware handles discovery and delivery.

This decoupling is valuable because it means producers and consumers of data can evolve independently: you can add, remove, or change subscribers without changing the publisher, and vice versa.  

Example with a drone: imagine a node that publishes IMU data on `/imu/data` at 100 Hz. One subscriber node might use that IMU data for attitude estimation, another for vibration monitoring, and a third for logging flight data to disk. You can start or stop any of these subscribers independently, or add a new “safety monitor” subscriber later, without changing the IMU publishing node at all.

---

## Q3. What does `rclpy.spin(node)` do? What would happen if you removed it?

`rclpy.spin(node)` runs the ROS 2 executor loop for that node: it keeps the process alive and continuously checks for incoming data, timers, and other callbacks, and calls your callback functions whenever there is work to do. It is what allows subscriptions, timers, and services on that node to actually react to messages and events while the program is running.

If you remove `rclpy.spin(node)` (and don’t replace it with another executor loop), the Python script will exit immediately after setting up the node, and none of your callbacks will ever be executed. The node will appear and disappear almost instantly, subscribers will never receive messages, and timers/services will not respond.

---

## Q4. You have a publisher on `/sensor_data` with type `sensor_msgs/msg/Imu` and a subscriber on `/sensor_data` with type `std_msgs/msg/String`. Will messages be received? Why?

No, messages will not be received. In ROS 2, a topic is defined not just by its name but also by its message type, and communication only works when both publisher and subscriber use exactly the same type.

Here, the publisher is sending `sensor_msgs/msg/Imu` messages while the subscriber is expecting `std_msgs/msg/String`, so the middleware considers these as incompatible and will not deliver the IMU messages to that subscriber. Even though the topic name `/sensor_data` matches, the type mismatch prevents any messages from being received.

---

## Q5. What is the QoS depth? When would you choose depth = 1 versus depth = 100?

QoS depth is the size of the message queue associated with a publisher or subscriber for a particular topic: it tells ROS 2 how many messages to buffer if they cannot be delivered or processed immediately. When the queue is full and a new message arrives, the oldest message is dropped.

You would choose **depth = 1** when only the most recent value matters and you do not care about older messages, for example for high‑rate sensor data like IMU orientation where you just want the latest state. You would choose **depth = 100** when it is important not to miss messages and you might process them slightly later, such as logging sensor data to disk or feeding a slower algorithm that needs a history window to compute results.

---

## Q6. In `rqt_graph`, your talker appears but listener does not. Name two specific things to check.

Two specific things to check are:

1. **Is the listener node actually running and using the same ROS domain?**  
   - Make sure you started the listener (no crash or exception), and run `ros2 node list` to see if its node name appears.  
   - Confirm that `ROS_DOMAIN_ID` is the same for both talker and listener so they can discover each other; if they are on different domains, they won’t see each other in `rqt_graph`.

2. **Are the topic name and message type exactly matching the talker?**  
   - Check that the listener is subscribing to the same topic name (e.g. `/chatter`, not `/chater` or with a different namespace) and using the same message type as the talker.  
   - Use `ros2 topic list` and `ros2 topic info /chatter` to confirm the topic and type, and verify the listener is attached correctly.