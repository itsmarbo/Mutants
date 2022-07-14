import os
import numpy as np
from sklearn import linear_model
from matplotlib import pyplot as plt
from flask import Flask, send_from_directory, render_template, request

app = Flask(__name__)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route("/")
def hello_world():
    return "<p>Hello, Marlene!</p>"

@app.route("/data")
def data():
        return render_template('data.html')

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

@app.route("/model", methods=["GET"])
def model():
    if request.method == "GET":
        # Data pre-processing
        tempX = request.args.get("dataX").split(",")
        tempX = [float(i) for i in tempX]
        tempY = request.args.get("dataY").split(",")
        tempY = [float(i) for i in tempY]
        x = np.array(list(range(len(tempX))))
        X = np.expand_dims(x, 1)
        y = np.array(tempY)

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
        return render_template('view.html', resultado=sum(tempX))
    else:
        return "<h1>Wrong method!</h1>"