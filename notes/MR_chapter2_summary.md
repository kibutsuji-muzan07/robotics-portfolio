# Modern Robotics — Ch. 2, Section 2.1

## Degrees of Freedom of a Rigid Body

### Why this section matters
Before we can plan motion, control a robot, or design a manipulator, we need a precise way to answer the question *"where is it?"*. Section 2.1 lays that foundation by deriving, from first principles, how many independent numbers (degrees of freedom, or **dof**) are needed to describe the configuration of a single rigid body — first in the plane, then in 3D space. Every later chapter (Grübler's formula, forward/inverse kinematics, task space, motion planning) builds on this result.

### The core idea
A **rigid body** is a set of points whose pairwise distances never change. That rigidity constraint is what lets us describe the whole body with only a handful of numbers instead of tracking every point individually.

Lynch & Park derive dof by applying a simple counting rule:

> **dof = (sum of freedoms of the points) − (number of independent constraints)** &nbsp;&nbsp; *(Eq. 2.1)*
>
> equivalently:&nbsp;&nbsp; **dof = (number of variables) − (number of independent equations)** &nbsp;&nbsp; *(Eq. 2.2)*

### Planar rigid body → 3 DOF
Pick three non-collinear points A, B, C on a coin lying on a table.

- If the points were free, that would be 3 × 2 = **6** variables: (xₐ, yₐ), (x_b, y_b), (x_c, y_c).
- Rigidity imposes three distance constraints: d(A,B) = d_AB, d(B,C) = d_BC, d(A,C) = d_AC.
- Counting: 6 variables − 3 independent constraints = **3 dof**.

Geometrically: fix A anywhere (2 dof) → B must lie on a circle of radius d_AB around A (1 more dof, an angle φ_AB) → C is then pinned to one of two circle-circle intersections (the "heads/tails" choice is discrete, not continuous). A natural parameterization is **(xₐ, yₐ, φ_AB)**, or more intuitively **(x, y, θ)**.

Adding a fourth point D adds 2 new variables but also 2 *independent* new distance constraints (the third is redundant), so the dof count doesn't change — confirming that three points are enough.

### Spatial rigid body → 6 DOF
Repeat the argument in 3D with coordinates (x, y, z) for each of A, B, C:

- A is free in space → **3 dof**.
- B must lie on a sphere of radius d_AB around A → **2 dof** (think latitude + longitude).
- C lies at the intersection of two spheres (centered at A and B), which is a circle → **1 dof** (one angle around that circle).
- Total = 3 + 2 + 1 = **6 dof**.

Alternatively, derive it as a special case: start from the 6-dof spatial body and impose the three planar constraints z_A = z_B = z_C = 0 → 6 − 3 = **3 dof** for the planar body. Same answer, two routes.

### Key terms to remember
- **Configuration** — a complete specification of the position of every point of the robot.
- **Degrees of freedom (dof)** — the minimum number of real-valued coordinates needed to represent the configuration.
- **Configuration space (C-space)** — the n-dimensional space of all possible configurations; a configuration is a point in this space.
- **Planar rigid body** — 3 dof, typically (x, y, θ).
- **Spatial rigid body** — 6 dof, three translations + three rotations.
- **Redundant constraint** — a constraint that adds no new information (important when counting only *independent* constraints).

### Intuition / takeaway
Rigidity is what compresses "infinitely many points" down to a small finite number of coordinates. The counting rule (variables − independent constraints) is the same idea used later for full multi-link robots — it just gets dressed up as **Grübler's formula** in Section 2.2, using Equation (2.3):

> **dof = (sum of freedoms of the bodies) − (number of independent constraints).**

So Section 2.1 is really teaching one trick twice: once for points forming a body, and then — in the next section — for bodies connected by joints.

### Quick self-check
1. A drone flying freely indoors — how many dof? → **6** (spatial rigid body).
2. A Roomba on a flat floor — how many dof? → **3** (planar rigid body: x, y, θ).
3. Why don't we need a 4th point to pin down a rigid body? → Because the 2 new independent distance constraints exactly cancel the 2 new coordinates it would introduce.
