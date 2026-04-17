#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class Listener(Node):
    def __init__(self):
        super().__init__('listener')
        self.sub = self.create_subscription(String, '/hello_world', self.listener_callback, 10)
        self.sub

    def listener_callback(self, msg: String):
        self.get_logger().info(f'I heard: "{msg.data}"')

def main():
    rclpy.init()
    rclpy.spin(Listener())
    Listener.destroy_node()
    rclpy.shutdown()
