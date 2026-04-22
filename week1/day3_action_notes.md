ROS 2 Actions – Detailed Notes (Jazzy)
======================================

1\. Big picture: where actions fit
----------------------------------

ROS 2 has three main communication patterns: **topics**, **services**, and **actions**.

*   **Topics** – one‑way, streaming data.
    
    *   Many publishers and subscribers.
        
    *   No built‑in notion of request/response or result.
        
    *   Great for sensor streams and continuous commands (e.g., /cmd\_vel, /scan).
        
*   **Services** – synchronous request/response.
    
    *   Client sends a **request**, server replies with **one response**, then the interaction is done.
        
    *   No built‑in progress feedback or cancel.
        
    *   Ideal for quick operations: “set this parameter”, “load this map”, “return one computation”.
        
*   **Actions** – long‑running tasks with feedback and cancel.
    
    *   Client sends a **goal**.
        
    *   Server sends **feedback** periodically while the goal is executing.
        
    *   Server sends a final **result** when the goal is done (or canceled/aborted).
        
    *   The client can **cancel** the goal while it’s running.
        
    *   Mental rule:
        
    *   Short, atomic operation → **Service**
        
*   Continuous stream of data → **Topic**
    
*   Long‑running task with progress + cancel → **Action**
    

2\. Action interface structure
------------------------------

An action is defined by an **action interface**, similar to .msg/.srv files, but with three sections: **goal**, **result**, and **feedback**.

Example (conceptual):

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   text# Goal  ---  # Result  ---  # Feedback   `

In Jazzy’s Fibonacci example (action\_tutorials\_interfaces/action/Fibonacci):

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   textint32 order  ---  int32[] sequence  ---  int32[] partial_sequence   `

*   **Goal**
    
    *   order: how many Fibonacci numbers to compute.
        
*   **Result**
    
    *   sequence: the complete Fibonacci sequence of length order.
        
*   **Feedback**
    
    *   partial\_sequence: the sequence computed so far (sent periodically during execution).
        

The action type is fully qualified as:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   textaction_tutorials_interfaces/action/Fibonacci   `

Action names are separate from types, e.g. the Fibonacci server advertises:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   text/fibonacci [action_tutorials_interfaces/action/Fibonacci]   `

3\. Runtime roles: action server and client
-------------------------------------------

At runtime, actions involve:

*   **Action Server**
    
    *   A node that _offers_ a named action (e.g., /fibonacci).
        
    *   Receives client **goals**, decides to accept or reject them.
        
    *   Executes accepted goals, publishes **feedback**, and finally sends a **result**.
        
    *   Handles **goal cancellation** requests.
        
*   **Action Client**
    
    *   A node that _uses_ an action.
        
    *   Sends a **goal** to the server.
        
    *   Waits until the goal is **accepted or rejected**.
        
    *   Receives **feedback** as the server reports progress.
        
    *   Receives the final **result** when the goal finishes or is canceled/aborted.
        
    *   Can **cancel** the goal if the task is no longer needed or conditions change.
        

In ROS 2, both sides are implemented in client libraries (like rclpy / rclcpp), but conceptually:

> Client decides _what_ to do (goal).Server decides _how_ to do it, and reports progress + result.

4\. Jazzy CLI tools for actions
-------------------------------

On **Jazzy**, the available ros2 action commands are:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashros2 action list  ros2 action type  ros2 action info  ros2 action send_goal   `

4.1 Discover actions
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashros2 action list  ros2 action list -t   `

*   list shows all action names.
    
*   list -t shows names + action types, e.g.:
    

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   text/fibonacci [action_tutorials_interfaces/action/Fibonacci]   `

To see the structure of the action interface:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashros2 interface show action_tutorials_interfaces/action/Fibonacci   `

This shows goal/result/feedback fields.

4.2 Inspect a specific action
-----------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashros2 action info /fibonacci   `

This displays:

*   Action type.
    
*   Number of clients and servers.
    
*   Node names acting as clients/servers, e.g.:
    

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   textAction: /fibonacci  Action clients: 1      /_ros2cli_send_goal... [action_tutorials_interfaces/action/Fibonacci]  Action servers: 1      /fibonacci_action_server [action_tutorials_interfaces/action/Fibonacci]   `

4.3 Send a goal from the CLI
----------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashros2 action send_goal /fibonacci action_tutorials_interfaces/action/Fibonacci "{order: 5}" -f   `

*   First argument: action name (/fibonacci).
    
*   Second: action type (action\_tutorials\_interfaces/action/Fibonacci).
    
*   Third: YAML for the **goal** fields.
    
*   \-f: block and wait for the result before exiting.
    

The CLI will print:

*   Whether the goal was **accepted**.
    
*   **Feedback** messages as they arrive.
    
*   Important: The **action type must match** exactly between server and client; a mismatch (e.g. example\_interfaces/action/Fibonacci vs action\_tutorials\_interfaces/action/Fibonacci) will cause the client to wait forever for a server.
    

5\. When to choose an action (practical heuristics)
---------------------------------------------------

Use an **action** when:

*   The task is **long‑running** relative to your control loop or user expectations (seconds or longer).
    
*   You care about **intermediate progress** (for UI, logging, or coordination with other systems).
    
*   You might want to **cancel** or **preempt** the operation.
    
*   Outcome can be **success, failure, or canceled** with a final status and maybe some result data.
    

Typical robotics examples:

*   **Navigation** – “Go to pose (x, y, θ)” with feedback like current pose, remaining distance, state (“planning/controlling/paused”), and a result of final pose + outcome.
    
*   **Manipulation** – “Pick up object A from bin B” with feedback about grasp attempts, contact, lift success, etc.
    
*   **Docking** – “Dock with charging station” with feedback on approach, alignment, and latch state.
    
*   **Complex sensor sweeps** – “Scan this area with LiDAR” with intermediate progress and a final dataset summary.
    

Compare:

*   If you only need “Start operation” and the result isn’t interesting → maybe a topic (std\_msgs/Empty command, and node publishes its own status elsewhere).
    
*   If you need atomic “Ask → Answer” semantics with no progress updates → service.
    
*   If you need all of: long‑running, progress, cancel, and result → action.
    

6\. Conceptual example: “Go to pose” action
-------------------------------------------

For a **robot navigation “go to pose”** behavior (like navigate\_to\_pose in Nav2), an action is a natural fit.

*   **Goal** (what the client requests)
    
    *   Target pose (geometry\_msgs/PoseStamped): position + orientation in some frame (e.g., map).
        
    *   Possibly additional fields: tolerance, behavior options, or a timeout.
        
*   **Feedback** (what the server reports while executing)Could include:
    
    *   Current robot pose.
        
    *   Remaining distance and/or angular error to goal.
        
    *   High-level navigation state (planning, controlling, stuck, waiting for obstacle to clear).
        
*   **Result** (one‑time, when done)
    
    *   Status: succeeded / aborted / canceled.
        
    *   Final pose reached.
        
    *   Optional metrics: time taken, path length, final error.
        

Why action here?

*   Driving across a building takes multiple seconds or more.
    
*   You need **progress** (for UI, logging, or coordination).
    
*   You need **cancel** (user changed mind, emergency stop, new higher‑priority goal).
    
*   You want a **clear outcome** (success/fail/canceled) and maybe some summary data.
    

Trying to force this into a pure service or topic API becomes awkward and fragile; actions give you the semantics out of the box.

7\. The Fibonacci Jazzy demo – what you did
-------------------------------------------

Following the Jazzy “Understanding ROS 2 Actions” tutorial:

1.  bashsource /opt/ros/jazzy/setup.bashros2 run action\_tutorials\_py fibonacci\_action\_server
    
2.  bashros2 action listros2 action list -t | grep fibonacciros2 interface show action\_tutorials\_interfaces/action/Fibonacciros2 action info /fibonacci
    
3.  bashros2 action send\_goal /fibonacci action\_tutorials\_interfaces/action/Fibonacci "{order: 5}" -f
    
    *   You saw **goal** acceptance.
        
    *   You saw **feedback** partial\_sequence values streaming.
        
    *   You saw final **result** sequence returned and printed.
        

This concrete experience is the “mental template” you can map onto any other action in future (navigation, manipulation, etc.).

8\. Quick comparison table
--------------------------

Use casePatternWhyUse casePatternWhyLaser scans, joint statesTopicContinuous data stream, no response needed.Query current barometer readingServiceOne request → one response, quick operation.Set a configuration parameterServiceAtomic operation, result just success/fail or value.Go to navigation goal poseActionLong‑running, needs feedback and cancel, final success/fail.Pick and place an objectActionSequence of steps with progress and possible failure/cancel.Periodic battery status broadcastTopicSensor‑like, many consumers, no per‑request semantics.

9\. Key takeaways
-----------------

*   **Action = Goal + (Feedback)\* + Result + Cancel.**
    
*   **Use actions** for long‑running, progress‑heavy tasks where cancellation and clear completion status matter.
    
*   In Jazzy, you introspect actions mainly with:
    
    *   ros2 action list, ros2 action list -t, ros2 action info, ros2 interface show, and
        
    *   ros2 action send\_goal ... -f to see goal/feedback/result in practice.