# Word Embeddings & Similarity — Q&A

---

**Q1. "robots" was the most similar word to "robot" (cosine ~0.85). Why? What does it mean for two words to be "close" in embedding space?**

**Ans:** *robot* and *robots* are similar words because one refers to the singular and the other to the plural. The **meaning** and **intention** of both words is the same — it is only the grammatical number that differentiates them.

Two words being "close" in embedding space means their **vector representations point in nearly the same direction**, indicating they appear in similar contexts across the training data.

---

**Q2. TF-IDF used ~5000 dimensions. GloVe uses 50. How can 50 numbers capture more meaning than 5000?**

**Ans:** 50 *dense* numbers capture more meaning than 5,000 *sparse* ones because:

- Each **GloVe dimension** encodes learned semantic relationships from billions of word co-occurrences
- Each **TF-IDF dimension** only tracks whether a single specific word appears

It is the *quality* of the information per dimension, not the count, that matters.

---

**Q3. king - man + woman ≈ queen. Explain in plain English what this arithmetic demonstrates about how embeddings store meaning.**

**Ans:** This demonstrates that embeddings **encode semantic relationships as geometric directions** in vector space.

In plain English — the model learned that *being royal* and *being male* are **separate, movable concepts** that can be isolated and transformed independently. Subtracting *man* removes the "male" direction, and adding *woman* re-applies it in the feminine direction, landing near *queen*.

---

**Q4. Why do we divide by the norms in cosine similarity? What happens if you just use the raw dot product?**

**Ans:** We divide by the norms (magnitudes) to **measure only the angle between vectors**, ignoring their lengths.

Without normalisation, the raw dot product mixes both *direction* and *magnitude* — a long vector will score highly against almost anything, which can **mislead similarity scores** regardless of actual semantic closeness.

---

**Q5. A document uses "self-driving car". You search for "autonomous vehicles". Would TF-IDF find it? Would cosine similarity on embeddings find it? Why?**

**Ans:**

| | **TF-IDF** | **Cosine Similarity on Embeddings** |
|---|---|---|
| **Finds it?** | *No* | *Yes* |
| **Why** | Requires exact word matches — treats "self-driving car" and "autonomous vehicle" as completely different terms | Operates in semantic vector space where "self-driving car" and "autonomous vehicle" are positioned *near each other*, so their cosine similarity direction points toward the same region |

---

**Q6. GloVe was trained on 2014 Wikipedia data. What happens if you look up "LoRA" or "gradcam" — terms invented after 2014?**

**Ans:** Looking up *LoRA* or *gradcam* in GloVe returns **nothing** — these words simply do not exist in GloVe's vocabulary because they were invented *after* 2014.

In practice this means:
- The model throws a **`KeyError`**
- Or in some implementations it returns a special **`<unk>` token** (unknown word placeholder)

This is a core limitation of *static, pre-trained* embeddings — they have a **fixed vocabulary** frozen at training time and cannot handle new terminology.
```