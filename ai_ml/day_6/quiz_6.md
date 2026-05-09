````markdown
# Transformers, Tokenization & Pipelines — Q&A

---

**Q1. Look at the token IDs output for "Gradient descent finally clicked for me today." What is the `[CLS]` token at the start and the `[SEP]` or `102` token at the end? Why does DistilBERT add these?**

**Ans:** The token ID sequence starts with the special **classification token `[CLS]`** (ID `101`) and ends with the **separator token `[SEP]`** (ID `102`).

- **`[CLS]`** — added so the model can produce a *single vector* summarising the whole sentence, used as input to the classification head
- **`[SEP]`** — added to mark the *boundary and end* of the input sequence

---

**Q2. You used `pipeline("text-classification")` and `pipeline("summarization")`. Both load a transformer model underneath. What is the fundamental difference in how these two tasks use the model?**

**Ans:**

| | **`pipeline("text-classification")`** | **`pipeline("summarization")`** |
|---|---|---|
| **Architecture** | *Encoder only* | *Encoder-decoder* |
| **How it works** | Reads input → builds contextual embeddings → applies a classification head on top of the `[CLS]` embedding | Encodes the input text → a *separate decoder* auto-regressively generates a new output sequence (the summary) conditioned on the encoder's representations |
| **Output** | A label + confidence score | A newly generated text sequence |

---

**Q3. The summarizer has `max_length=80` and `min_length=30`. What happens if you set `max_length=10`? What if you set `min_length=200` on a 50-word input? Predict before testing.**

**Ans:**

- **`max_length=10`** — the summarizer is forced to stop generating very early, likely producing an *incomplete or low-quality* summary of only up to 10 tokens.

- **`min_length=200` on a 50-word input** — the model is forced to generate *at least* 200 tokens from a very short source. In practice it will either fail the length constraint or produce a **long, repetitive output** far exceeding the original text.

---

**Q4. The classifier returns a score (e.g. `0.9998`). Where does this number come from? What is the step between raw logits and this score?**

**Ans:** The pipeline follows two steps:

1. The model head produces **raw logits** — one per label, unconstrained real numbers
2. These logits are passed through a **softmax function**, which converts them into *normalised probabilities* between `0` and `1` that sum to `1`

The reported score is simply the **softmax probability of the predicted label**.

---

**Q5. Why does the model download on first run but not on subsequent runs? Where does it cache on your machine?**

**Ans:** On the *first run*, `pipeline` downloads the model weights and tokenizer files from the Hugging Face model hub.

After that, they are **cached locally** — by default under:

````
~/.cache/huggingface/
````

Subsequent runs load directly from disk instead of re-downloading, making startup significantly faster.

---

**Q6. Would you use `pipeline("text-generation")` or a direct `model + tokenizer` approach for a production RAG system? Give one reason for each.**

**Ans:**

**For a quick prototype or demo** → use `pipeline("text-generation")`

```python
pipeline("text-generation")
```

*Reason:* Fast to set up — abstracts away tokenizer handling, model loading, and generation configuration. Ideal for *experimentation and validating ideas quickly* with minimal code.

---

**For a real production RAG system** → use direct `model + tokenizer`

```python
model + tokenizer
```

*Reason:* Gives precise control over:

| Parameter | Why it matters in production |
|---|---|
| Token limits | Avoid context overflow |
| Batching | Throughput optimisation |
| Streaming | Real-time response delivery |
| Generation parameters | Output quality tuning |
| Memory optimisation | Cost and latency control |
| Prompt formatting | Accurate context construction |
| Latency tuning | SLA compliance |

> Production RAG systems need *precise control* over context construction and inference behaviour — which the high-level `pipeline()` API deliberately hides.

**Summary:**
- *`pipeline()`* → rapid prototyping
- *`model + tokenizer`* → scalable, optimised production systems
````