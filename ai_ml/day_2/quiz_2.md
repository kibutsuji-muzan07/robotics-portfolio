# ML Evaluation Metrics — Q&A

---

**Q1. A fraud detection model has 99% accuracy on a dataset where 99% of transactions are legitimate. Is this a good model? Why or why not?**

**Ans:** It depends. As for the current scenario we cannot be sure about it because it's only detecting the legitimate/positive data so it's not sure if the model is good enough to detect negative data as well.

---

**Q2. You are building a cancer screening test. Which metric matters more — precision or recall? Explain your reasoning.**

**Ans:** I think for cancer screening test recall is the metric which matters more because false negatives are costly here. You want to catch every scenario even if some healthy people get flagged.

---

**Q3. In your confusion matrix, what do the False Positives represent in the context of the baseball vs. medical text classifier?**

**Ans:** In the confusion matrix, in the context of the baseball versus medical text classifier, the false positive represents if the medical scenario is identified as a baseball scenario.

---

**Q4. What is the F1 score and why do we use it instead of just reporting precision and recall separately?**

**Ans:** The F1 score is the harmonic mean of precision and recall. We use it when we need a balance between precision and recall. It's more of a generic metric rather than an objective-driven metric like precision and recall.

---

**Q5. What would happen to recall if you lowered the classification threshold (so the model predicts "positive" more aggressively)? What would happen to precision?**

**Ans:** If we lower the classification threshold the recall will greatly improve because more positive predictions will happen. Let's say the classification threshold was previously 90% but now it's been brought down to 50%. Now more positive classifications will happen in terms of the recall.

If we take a dogs and cats classification example, among 25 actual positive dogs, 20 dogs have been classified above 90% as dog but 5 are classified as 75% as dog. That means 20 would be true positive and 5 would be false negative as per the 90% classification threshold. Now if we bring down the threshold to 50%, the five dogs that are classified 75% as dog would also count as true positive — meaning all 25 dogs will be positively counted.

In case of precision, it will decrease drastically because let's say one cat is identified as 50% dog. That will also be counted as dog, which is not the actual case.
```