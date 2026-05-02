# Day 3 Quiz — Services, Parameters, Actions & Robotics Fundamentals

**Topic:** ROS 2 Services, Parameters, Actions, and Configuration Space
**Package Context:** `py_srvcli` / `services_demo` (AddTwoInts server with `scale_factor` parameter)

---

## Q1. What is the key difference between a topic and a service? Give a concrete example of when you'd use each on a drone.

The key difference is that a **topic** is a one-way broadcast (pub/sub streaming), whereas a **service** is a closed-loop request/response interaction between a client and a server.

- **Topic use case on a drone:** I would use a topic when a node needs to continuously broadcast data to any listener. For example, publishing the drone's **GPS location** from the GPS module onto `/gps/fix` so that the state estimator, logger, and safety monitor can all subscribe and consume it independently.

- **Service use case on a drone:** I would use a service when a node needs to query for a single, one-off piece of information or trigger a one-shot computation. For example, calling a service to **fetch or process the IMU data** once — passing it through a set of factors and calculations and returning the result to the client in a single response.

---

## Q2. What is a parameter? Why is declaring `max_tilt_angle` as a parameter better than hard-coding it? How would you change it at runtime?

A **parameter** is a named, typed value associated with a node that can be read and modified while the node is running — without restarting the code.

Declaring `max_tilt_angle` as a parameter is better than hard-coding it because the value can be **tuned on the fly while the drone is airborne or in flight** to suit the current requirement or situation (e.g., reducing the tilt limit in gusty wind, or relaxing it during aggressive maneuvers). A hard-coded value would require rebuilding and redeploying the code every time you wanted to adjust it.

To change it at runtime, use:

```bash
ros2 param set <node_name> <parameter_name> <value>
```

For example:

```bash
ros2 param set /flight_controller max_tilt_angle 25.0
```

---

## Q3. Why are actions used instead of services for "navigate to waypoint"? What problem with services do actions solve?

Actions are used for tasks like "navigate to waypoint" because **actions are designed for long-running tasks, whereas services are designed for single, atomic request/response interactions**.

**Why services fall short here:** A service processes one request, sends back a single response, and the interaction ends. For a long-running task like navigation, the client would be forced to block and wait, with no visibility into progress and no way to abort the task mid-execution.

**What actions solve:**
- Actions work on a **goal → feedback → result** model. On a single instruction like "navigate to waypoint", the server does not keep asking the client for further instructions — it executes the goal autonomously until the current instruction is completed.
- The **feedback stream** continuously reports progress (e.g., remaining distance, current pose, error to target), allowing the client to act on that information.
- Actions also support **cancellation** — the client can stop an in-progress goal at any time (e.g., emergency stop, operator changes mind, higher-priority goal arrives).

In short: **Action = Goal + (Feedback)\* + Result + Cancel**, which is exactly what a "navigate to waypoint" behavior requires.

---

## Q4. A robot arm has 3 revolute joints. What is its DOF? What does its C-space look like?

The **DOF (Degrees of Freedom) of the robot arm is 3**, because each revolute joint contributes one independent rotational degree of freedom.

The **C-space (Configuration Space)** is the set of all possible joint-angle configurations the arm can take. With 3 revolute joints, each joint angle lies on a circle, and the overall C-space is a three-dimensional space parameterised by the three joint angles.

> **Review note:** Worth double-checking in class — for three revolute joints, the C-space is often described as a **3-torus (T³ = S¹ × S¹ × S¹)** rather than a planar space, since each revolute joint wraps around (0 and 2π are the same configuration). Confirm with the instructor whether "planar" was intended for a different setup.

---

## Q5. Client sends `{a: 7, b: 4}` to your `AddTwoInts` server with `scale_factor=3.0`. What should the server return?

The server should return **33**.

**Calculation:**

```
response.sum = (request.a + request.b) * scale_factor
             = (7 + 4) * 3.0
             = 11 * 3.0
             = 33.0
```

This matches the server logic used in the `services_demo` package:

```python
factor = self.get_parameter('scale_factor').get_parameter_value().double_value
response.sum = (request.a + request.b) * factor
```

---

## Q6. You run `ros2 service call /add_two_ints` and get "service not available." Your server node is running. Name two possible causes.

Two possible causes:

1. **The node is not actually exposing the expected service.** The server process may be running, but the service itself was never correctly registered — for example, the node was built as part of a different package, or the service creation call inside the node failed silently, so `/add_two_ints` does not appear in `ros2 service list`.

2. **The service name on the server does not match the name the client is calling.** If the server advertises the service under a different name or namespace (e.g., `/add_two_ints_server/add_two_ints` vs. `/add_two_ints`), the client will report "service not available" because no server is listening on the exact name the client is querying.

**Quick debugging steps:**

```bash
ros2 service list                       # verify the service name actually exists
ros2 service type /add_two_ints         # confirm type matches the client
ros2 node info /add_two_ints_server     # see what services the node actually advertises
```

---

## Summary of Key ROS 2 Communication Patterns

| Pattern | Use case | Example on a drone |
|---|---|---|
| **Topic** | Continuous streaming data, many-to-many | GPS broadcast on `/gps/fix`, IMU stream on `/imu/data` |
| **Service** | Short, atomic request/response | Query battery voltage, reset odometry, trigger one-shot computation |
| **Action** | Long-running task with progress + cancel | Navigate to waypoint, takeoff, land, autonomous mission |
| **Parameter** | Runtime-tunable configuration value | `max_tilt_angle`, `scale_factor`, PID gains |

---

*References from prior notes: ROS 2 Jazzy official docs — Services tutorial, Parameters tutorial, Actions tutorial (action_tutorials_py Fibonacci demo).*
