## Q1. What problem does a virtual environment (venv) solve? What would happen if you installed all your packages globally without one?

=> A virtual environment creates an isolated space within the system where all operations remain contained, without interfering with the main system.

   If I installed all my packages globally without using a virtual environment, the installed packages would affect the entire system. This could break or influence system-level or other project dependencies. It would also be harder to manage versions, and everything would be mixed together instead of being properly isolated.

---

## Q2. In your own words: what does `model.fit(X_train, y_train)` actually do? What is the model "learning"?

=> `model.fit` makes the model learn from the data by adjusting its internal weights based on the training dataset. This allows it to make predictions on new, unseen data.

   In this case, we are using Logistic Regression. It trains by adjusting feature weights so that the predicted probabilities match the actual class labels, using the sigmoid function and optimization techniques like gradient descent.

---

## Q3. You train a model and get 98% accuracy on training data but only 61% on test data. What is happening? What is this problem called?

=> The model has memorized the training data instead of learning general patterns. This problem is called **overfitting**.

---

## Q4. Look at your confusion matrix. What does a number in an off-diagonal cell mean? Give a specific example using the iris species names (setosa, versicolor, virginica).

=> A number in an off-diagonal cell represents an incorrect prediction.

   In my case, I obtained a perfect diagonal matrix.

   For example, rows represent actual values and columns represent predicted values in the confusion matrix. If for *setosa*, the value in the first row and first column is 9, and the value in the first row and third column is 1, then 9 predictions for *setosa* are correct, and 1 prediction is incorrect.

---

## Q5. Logistic regression outputs a probability. If the model outputs 0.82 for class "virginica," what does that mean in plain language? How does it then decide the final label?

=> It means there is an 82% probability that the given data belongs to the class *virginica*. 

   The final label is decided using a threshold value.