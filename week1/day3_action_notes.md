# ROS 2 Actions – Detailed Notes (Jazzy)

## 1. Big picture: where actions fit

ROS 2 has three main communication patterns: **topics**, **services**, and **actions**. [web:118]

- **Topics** – one‑way, streaming data.  
  - Many publishers and subscribers.  
  - No built‑in notion of request/response or result.  
  - Great for sensor streams and continuous commands (e.g., `/cmd_vel`, `/scan`).

- **Services** – synchronous request/response.  
  - Client sends a **request**, server replies with **one response**, then the interaction is done.  
  - No built‑in progress feedback or cancel.  
  - Ideal for quick operations: “set this parameter”, “load this map”, “return one computation”.

- **Actions** – long‑running tasks with feedback and cancel.  
  - Client sends a **goal**.  
  - Server sends **feedback** periodically while the goal is executing.  
  - Server sends a final **result** when the goal is done (or canceled/aborted).  
  - The client can **cancel** the goal while it’s running.  
  - Ideal for tasks like navigation, manipulation, docking, etc.

> Mental rule:  
> - Short, atomic operation → **Service**  
> - Continuous stream of data → **Topic**  
> - Long‑running task with progress + cancel → **Action**

---

## 2. Action interface structure

An action is defined by an **action interface**, similar to `.msg`/`.srv` files, but with three sections: **goal**, **result**, and **feedback**. [web:118][web:121]

Example (conceptual):

```action
# Goal
<goal fields>
***
# Result
<result fields>
***
# Feedback
<feedback fields>
```

In Jazzy’s Fibonacci example (`action_tutorials_interfaces/action/Fibonacci`): [web:121]

```text
int32 order
***
int32[] sequence
***
int32[] partial_sequence
```

- **Goal**  
  - `order`: how many Fibonacci numbers to compute.
- **Result**  
  - `sequence`: the complete Fibonacci sequence of length `order`.
- **Feedback**  
  - `partial_sequence`: the sequence computed so far (sent periodically during execution).

The action type is fully qualified as:

```text
action_tutorials_interfaces/action/Fibonacci
```

Action names are separate from types, e.g. the Fibonacci server advertises:

```text
/fibonacci [action_tutorials_interfaces/action/Fibonacci]
```

---

## 3. Runtime roles: action server and client

At runtime, actions involve:

- **Action Server**  
  - A node that *offers* a named action (e.g., `/fibonacci`).  
  - Receives client **goals**, decides to accept or reject them.  
  - Executes accepted goals, publishes **feedback**, and finally sends a **result**.  
  - Handles **goal cancellation** requests.

- **Action Client**  
  - A node that *uses* an action.  
  - Sends a **goal** to the server.  
  - Waits until the goal is **accepted or rejected**.  
  - Receives **feedback** as the server reports progress.  
  - Receives the final **result** when the goal finishes or is canceled/aborted.  
  - Can **cancel** the goal if the task is no longer needed or conditions change.

In ROS 2, both sides are implemented in client libraries (like rclpy / rclcpp), but conceptually:

> Client decides *what* to do (goal).  
> Server decides *how* to do it, and reports progress + result.

---

## 4. Jazzy CLI tools for actions

On **Jazzy**, the available `ros2 action` commands are: [web:109]

```bash
ros2 action list
ros2 action type
ros2 action info
ros2 action send_goal
```

### 4.1 Discover actions

```bash
ros2 action list
ros2 action list -t
```

- `list` shows all action names.  
- `list -t` shows names + action types, e.g.:

```text
/fibonacci [action_tutorials_interfaces/action/Fibonacci]
```

To see the structure of the action interface:

```bash
ros2 interface show action_tutorials_interfaces/action/Fibonacci
```

This shows goal/result/feedback fields.

### 4.2 Inspect a specific action

```bash
ros2 action info /fibonacci
```

This displays: [web:149]

- Action type.  
- Number of clients and servers.  
- Node names acting as clients/servers, e.g.:

```text
Action: /fibonacci
Action clients: 1
    /_ros2cli_send_goal... [action_tutorials_interfaces/action/Fibonacci]
Action servers: 1
    /fibonacci_action_server [action_tutorials_interfaces/action/Fibonacci]
```

### 4.3 Send a goal from the CLI

```bash
ros2 action send_goal /fibonacci action_tutorials_interfaces/action/Fibonacci "{order: 5}" -f
```

- First argument: action name (`/fibonacci`).  
- Second: action type (`action_tutorials_interfaces/action/Fibonacci`).  
- Third: YAML for the **goal** fields.  
- `-f`: block and wait for the result before exiting.

The CLI will print:

- Whether the goal was **accepted**.  
- **Feedback** messages as they arrive.  
- Final **result** at completion.

> Important: The **action type must match** exactly between server and client; a mismatch (e.g. `example_interfaces/action/Fibonacci` vs `action_tutorials_interfaces/action/Fibonacci`) will cause the client to wait forever for a server.  

---

## 5. When to choose an action (practical heuristics)

Use an **action** when:

- The task is **long‑running** relative to your control loop or user expectations (seconds or longer).
- You care about **intermediate progress** (for UI, logging, or coordination with other systems).
- You might want to **cancel** or **preempt** the operation.
- Outcome can be **success, failure, or canceled** with a final status and maybe some result data.

Typical robotics examples:

- **Navigation** – “Go to pose (x, y, θ)” with feedback like current pose, remaining distance, state (“planning/controlling/paused”), and a result of final pose + outcome.  
- **Manipulation** – “Pick up object A from bin B” with feedback about grasp attempts, contact, lift success, etc.  
- **Docking** – “Dock with charging station” with feedback on approach, alignment, and latch state.  
- **Complex sensor sweeps** – “Scan this area with LiDAR” with intermediate progress and a final dataset summary.

Compare:

- If you only need “Start operation” and the result isn’t interesting → maybe a topic (`std_msgs/Empty` command, and node publishes its own status elsewhere).
- If you need atomic “Ask → Answer” semantics with no progress updates → service.
- If you need all of: long‑running, progress, cancel, and result → action.

---

## 6. Conceptual example: “Go to pose” action

For a **robot navigation “go to pose”** behavior (like `navigate_to_pose` in Nav2), an action is a natural fit. [web:118]

- **Goal** (what the client requests)  
  - Target pose (`geometry_msgs/PoseStamped`): position + orientation in some frame (e.g., `map`).  
  - Possibly additional fields: tolerance, behavior options, or a timeout.

- **Feedback** (what the server reports while executing)  
  Could include:
  - Current robot pose.  
  - Remaining distance and/or angular error to goal.  
  - High-level navigation state (planning, controlling, stuck, waiting for obstacle to clear).  

- **Result** (one‑time, when done)  
  - Status: succeeded / aborted / canceled.  
  - Final pose reached.  
  - Optional metrics: time taken, path length, final error.

Why action here?

- Driving across a building takes multiple seconds or more.  
- You need **progress** (for UI, logging, or coordination).  
- You need **cancel** (user changed mind, emergency stop, new higher‑priority goal).  
- You want a **clear outcome** (success/fail/canceled) and maybe some summary data.

Trying to force this into a pure service or topic API becomes awkward and fragile; actions give you the semantics out of the box.

---

## 7. The Fibonacci Jazzy demo – what you did

Following the Jazzy “Understanding ROS 2 Actions” tutorial: [web:117][web:135]

1. **Start the Fibonacci action server**

   ```bash
   source /opt/ros/jazzy/setup.bash
   ros2 run action_tutorials_py fibonacci_action_server
   ```

2. **Inspect available actions**

   ```bash
   ros2 action list
   ros2 action list -t | grep fibonacci
   ros2 interface show action_tutorials_interfaces/action/Fibonacci
   ros2 action info /fibonacci
   ```

3. **Send a goal and observe behavior**

   ```bash
   ros2 action send_goal /fibonacci action_tutorials_interfaces/action/Fibonacci "{order: 5}" -f
   ```

   - You saw **goal** acceptance.  
   - You saw **feedback** `partial_sequence` values streaming.  
   - You saw final **result** `sequence` returned and printed.  

This concrete experience is the “mental template” you can map onto any other action in future (navigation, manipulation, etc.).

---

## 8. Quick comparison table

| Use case                            | Pattern  | Why                                                                 |
|------------------------------------|----------|----------------------------------------------------------------------|
| Laser scans, joint states          | Topic    | Continuous data stream, no response needed.                         |
| Query current barometer reading    | Service  | One request → one response, quick operation.                        |
| Set a configuration parameter      | Service  | Atomic operation, result just success/fail or value.                |
| Go to navigation goal pose         | Action   | Long‑running, needs feedback and cancel, final success/fail.       |
| Pick and place an object           | Action   | Sequence of steps with progress and possible failure/cancel.        |
| Periodic battery status broadcast  | Topic    | Sensor‑like, many consumers, no per‑request semantics.              |

---

## 9. Key takeaways

- **Action = Goal + (Feedback)* + Result + Cancel.**  
- **Use actions** for long‑running, progress‑heavy tasks where cancellation and clear completion status matter.  
- In Jazzy, you introspect actions mainly with:
  - `ros2 action list`, `ros2 action list -t`, `ros2 action info`, `ros2 interface show`, and  
  - `ros2 action send_goal ... -f` to see goal/feedback/result in practice. [web:117][web:109]  

These notes should be enough to quickly refresh your memory the next time you need to design or debug an action interface.