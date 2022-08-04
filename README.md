# MutaGen Kv7.2

A free machine learning web service to predict pathogenicity of missense variants in Kv7.2 channels
---

This repository contains both the frontend and the backend to the MutaGen program. The latter takes a punctual mutation selected by the user in the frontend, and evaluates it using machine learning models to predict its pathogenicity.

The web application was developed for a summer internship at the Universidad del Pais Vasco. For more information, please contact: <some_user@some_domain.es>

## Backend
It's written in Python 3 and using several libraries for both the server and the machine learning models. To run the backend, please consider the following required libraries:

* Flask
* Jinja
* Werkzeug
* Flask-Cors
* SciKit Learn

## Frontend
It's written in HTML5 using Bootstrap 5 for CSS and VueJS 3 and Axios for the JS part.