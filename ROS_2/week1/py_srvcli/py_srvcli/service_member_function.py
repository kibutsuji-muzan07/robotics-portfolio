from example_interfaces.srv import AddTwoInts

import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile
from rclpy.clock import Clock
from rclpy.time import Duration
from rclpy.qos import QoSDurabilityPolicy, QoSReliabilityPolicy
from rclpy.service_introspection import ServiceIntrospectionState


class MinimalService(Node):

    def __init__(self):
        super().__init__('minimal_service')

        # 1) Declare a parameter with a default value
        self.declare_parameter('scale_factor', 1.0)

        # 2) Optionally cache the initial value in self.scaler
        self.scaler = self.get_parameter(
            'scale_factor'
        ).get_parameter_value().double_value

        # 3) Create the service
        self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.add_two_ints_callback)

        # Configure QoS for the introspection event topic (can be simple)
        event_qos = QoSProfile(
            depth=10,
            reliability=QoSReliabilityPolicy.RELIABLE,
            durability=QoSDurabilityPolicy.VOLATILE,
        )

        # Enable introspection with full contents (requests + responses)
        self.srv.configure_introspection(
            self.get_clock(),                    # clock for timestamps
            event_qos,                           # QoS for _service_event topic
            ServiceIntrospectionState.CONTENTS   # or METADATA / OFF
        )

    def add_two_ints_callback(self, request, response):
        # Option A: read parameter fresh each call
        scale = self.get_parameter(
                    'scale_factor'
                ).get_parameter_value().double_value
        
        response.sum = int((request.a + request.b) * scale)
        self.get_logger().info(
        f"Incoming request a: {request.a} b: {request.b}, "
        f"scale_factor: {scale}, result: {response.sum}"
    )

        return response


def main():
    rclpy.init()

    minimal_service = MinimalService()

    rclpy.spin(minimal_service)

    rclpy.shutdown()


if __name__ == '__main__':
    main()
