from flask import Flask
import os
from flask import send_from_directory
from flask import render_template
import numpy as np
from sklearn import linear_model
from matplotlib import pyplot as plt

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, Marlene!</p>"

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route("/<data>")
def compute(data):
    # Data pre-processing
    temp = data.split(",")
    temp2 = [float(i) for i in temp]
    x = np.array(list(range(len(temp2))))
    X = np.expand_dims(x, 1)
    y = np.array(temp2)

    # Linear model
    reg = linear_model.LinearRegression()
    reg.fit(X, y)
    m = reg.coef_[0]
    b = reg.intercept_
    yn = [m*x + b for x in X]

    # Plot the data
    plt.title(f"y = {m:.4} x + {b:.4}")
    plt.plot(x, y, "r.")
    plt.plot(x, yn, "b-")
    plt.savefig("static/barras.png")
    plt.cla()

    # Render page
    return render_template('view.html', resultado=sum(temp2))
