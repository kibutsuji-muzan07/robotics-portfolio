````markdown
# PyTorch nn.Module & Training Loop — Q&A

---

**Q1. What is the purpose of `nn.Module`? What would you have to do manually if it did not exist?**

**Ans:** `nn.Module` is basically used to package all the network layers, manage all the parameters, and compose a larger network.

If it didn't exist, you would have to manually code all the raw tensors creating the network — and it would be *unmanageable* for a larger network which has tens of thousands of layers with all the parameters.

---

**Q2. In the training loop, `optimizer.zero_grad()` is called at the start of each batch, not each epoch. Why does it need to happen every single batch?**

**Ans:** It has to happen on every single batch because on each forward pass, we take the entire batch and compute gradients of the tensors. The calculated gradients sit on the tensors, and if we do the next forward pass for the next batch *without* clearing them, the calculations make a mess and convergence never happens.

> **Key distinction:**
> - *Epoch* — training the model `n` times with the same dataset
> - *Batch* — a small slice of data from the dataset
>
> For a single epoch there are multiple batches, so `optimizer.zero_grad()` must be called at the start of each batch, not each epoch.

---

**Q3. What does `optimizer.step()` do exactly? How is it different from what you did manually in Day-3?**

**Ans:** `optimizer.step()` reads the gradients stored in each parameter's `.grad` attribute and updates the model weights according to the optimizer's update rule. It performs the actual learning step that moves the network toward lower loss.

| | **Day 3 — Manual Update** | **Day 4 — `optimizer.step()`** |
|---|---|---|
| **How** | Updated each parameter one by one | Automatically updates all parameters |
| **Parameters** | `w` and `b` only | All 648,449 parameters |
| **Formula needed?** | Yes — written explicitly | No — optimizer handles it |

**Day 3 manual approach:**
```python
with torch.no_grad():
    w -= lr * w.grad
    b -= lr * b.grad
```

**Day 4 approach:**
```python
optimizer.step()  # handles all 648,449 parameters automatically
```

---

**Q4. Your model has three `nn.Linear` layers: `Linear(5000, 128)`, `Linear(128, 64)`, `Linear(64, 1)`. How many total trainable parameters does it have? Show your calculation.**

> **Formula:** `Linear(in, out)` has `in × out` weights + `out` biases = `in × out + out` total

| Layer | Weights | Biases | Total |
|---|---|---|---|
| `Linear(5000, 128)` | 5000 × 128 = 640,000 | 128 | **640,128** |
| `Linear(128, 64)` | 128 × 64 = 8,192 | 64 | **8,256** |
| `Linear(64, 1)` | 64 × 1 = 64 | 1 | **65** |
| **Grand Total** | | | **648,449** |

> This means during each `optimizer.step()`, the Adam optimizer updates all **648,449** values!

---

**Q5. What is the difference between `model.train()` and `model.eval()`? Why does it matter?**

**`model.train()` — Training Mode**

```python
model.train()  # Sets model.training = True
```
- Enables training behaviour for specific layers
- *Activates* Dropout (randomly drops neurons)
- BatchNorm uses **batch statistics** (mean/variance of current batch)

**`model.eval()` — Evaluation Mode**

```python
model.eval()  # Sets model.training = False
```
- Enables inference behaviour
- *Disables* Dropout (uses all neurons)
- BatchNorm uses **running statistics** (learned during training)

### Why It Matters — Layer-Specific Behaviour

**Dropout**

| | `model.train()` | `model.eval()` |
|---|---|---|
| **Behaviour** | Randomly sets neurons to 0 with probability `p` | Uses *all* neurons (no dropping) |
| **Purpose** | Prevent overfitting | Get stable predictions |

> *If you use `model.train()` during testing, predictions will be random and inconsistent because different neurons get dropped each time.*

**Batch Normalisation**

| | `model.train()` | `model.eval()` |
|---|---|---|
| **Statistics** | Computes mean/variance from current batch | Uses stored running statistics from training |
| **Updates** | Updates running statistics | Uses fixed statistics (no updates) |
| **Purpose** | Normalise during learning | Normalise consistently |

> *If you use `model.train()` during testing with batch size = 1, BatchNorm will fail — it can't compute meaningful statistics from a single sample. `model.eval()` ensures it uses the learned statistics instead.*

---

**Q6. Your test accuracy is around 92–97%. If you changed `n_epochs` from `5` to `50`, would accuracy keep improving indefinitely? What problem might you run into?**

**Ans:** No, accuracy would **NOT** keep improving indefinitely — you would hit ***overfitting***.
````