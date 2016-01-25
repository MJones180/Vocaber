from flask import current_app, render_template, flash, redirect, session, url_for, request, g, jsonify
from .models import *
from app import app, db
import urllib2
import json

@app.route('/')
@app.route('/home')
def index():
	return render_template("index.html",title="Home",css="home")

@app.route('/review')
def review():
	# zipcode_grab = Weather.query.all()
	# zipcodes = {}
	# for zc in zipcode_grab:
	# 	zipcodes[zc.zipcode] = zc.location
	# zipcodes = {"14845":"Horseheads, NY", "80123":"Denver, CO", "14810":"Bath, NY"}
	return render_template("review.html",
						   title="Review",
						   css="review")

@app.route('/vocab/grab')
def get_vocab():
	zipcode = request.args.get('zipcode')
	response = urllib2.urlopen("http://api.wunderground.com/api/ade07f3770a78c5c/conditions/q/" + zipcode + ".json")
	return jsonify(json.load(response))