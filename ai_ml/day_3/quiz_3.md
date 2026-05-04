# PyTorch Gradients & Training — Q&A

---

**Q1. You have a tensor `x = torch.tensor(5.0, requires_grad=True)` and you compute `y = x ** 2`. After calling `y.backward()`, what is `x.grad`? Show your working.**

**Ans:** `x.grad = 10.0`

```python
# Given
x = 5.0
y = x²        # y = 25.0

# Derivative formula
dy/dx = 2x    # At x = 5.0

Since dy/dx = x.grad

# Calculate
x.grad = 2 × 5.0 = 10.0
```

---

**Q2. In your training loop, what would happen if you removed `w.grad.zero_()` after the weight update? Why?**

**Ans:** It would mess up the calculation and gradient direction would be wrong.
Because the tensor tends to keep the calculated gradient on the number. In the next gradient pass when it try to train again, it would accumulate the previous calculated gradient with the current and it wouldn't be correct.

---

**Q3. What is the difference between the forward pass and the backward pass? Use one sentence each.**

**Ans:**

**Forward pass:** Computes the output (prediction) from inputs by applying the model's operations in sequence, like calculating `y = x²` from `x = 5` to get `y = 25`.

**Backward pass:** Computes gradients (derivatives) by working backwards from the output to inputs using the chain rule, like calculating `∂y/∂x = 10` and storing it in `x.grad`.

---

**Q4. In your experiment, `w` started at `0.0` and converged to `~3.0`. What is the mechanism that moved it in the right direction? (Answer in terms of gradients — don't just say "training".)**

**Ans:** The backpropagation is the mechanism that moved the `w` in the right direction. The backpropagation is actually the derivation of Y with respect to X. It's the gradient of x or you can say that the slope of the x-y coordinate. We should try to make it towards zero or move it towards zero rather.

---

**Q5. What is the learning rate and what goes wrong if you set it too high (e.g. `lr = 10.0`)? What if you set it too low (e.g. `lr = 0.000001`)?**

**Ans:** The learning rate controls how big a step you take when updating weights during gradient descent. It's the multiplier applied to the gradient: `w -= lr * w.grad`.

*If Learning Rate is too high*
**Problem: Divergence and Oscillation**

- The weight updates become too large, causing the optimizer to "jump over" the optimal value
- The model oscillates wildly around the minimum, bouncing from one side of the valley to the other
- Loss increases instead of decreases, potentially exploding to infinity
- Training becomes unstable and diverges - the model never converges

*If Learning Rate is Too Low*
**Problem: Extremely Slow Convergence**

- Weight updates are tiny, making progress extremely slow
- Training requires many more epochs to reach the same performance
- May get stuck in local minima or saddle points because steps are too small to escape
- Wastes computational resources - takes hours/days instead of minutes
- Risk of premature stopping - appears to plateau before actually converging

---

**Q6. Your script trains on `y = 3x + 2`. If you changed the true relationship to `y = -5x + 10`, would the code work without changes? What would the final `w` and `b` values be?**

**Ans:** Yes the code would work without changes.

After 200 epochs with the same learning rate (`0.01`):

- `w` would converge to ≈ `-5.0` (instead of `3.0`)
- `b` would converge to ≈ `10.0` (instead of `2.0`)
````