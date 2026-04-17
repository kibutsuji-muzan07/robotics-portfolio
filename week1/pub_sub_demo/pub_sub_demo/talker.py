#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class Talker(Node):
    def __init__(self):
        super().__init__('talker')
        self.pub = self.create_publisher(String, '/hello_world', 10)
        self.create_timer(0.5, self.cb)

        self.i = 0

    def cb(self):
        msg = String()
        msg.data = f'Hello from ROS 2 {self.i}'
        self.pub.publish(msg)
        self.get_logger().info(f'Publishing: {msg.data}')
        self.i += 1

def main():
    rclpy.init()
    rclpy.spin(Talker())
    rclpy.shutdown()
