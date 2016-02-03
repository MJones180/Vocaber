from flask import current_app, render_template, flash, redirect, session, url_for, request, g, jsonify
from .models import *
from app import app, db
from sqlalchemy.sql import func, select
import urllib2
import json
import random
import collections

@app.route('/')
@app.route('/home')
def index():
	return render_template("index.html",title="Home",css="home")

@app.route('/review')
def review():
	return render_template("review.html",
						   title="Review",
						   css="review")

@app.route('/dictionary')
def dictionary():
	data = {}
	total_w = 0
	total_m = 0
	meanings = Meaning.query.all()
	for m in meanings:
		total_m += 1
		words = Word.query.filter_by(link_id=m.id).all()
		word_list = []
		for w in words:
			total_w += 1
			word_list.append(w.w_text)
		data[m.id] = {m.m_text:word_list}
	ordered_data = collections.OrderedDict(sorted(data.items()))
	return render_template("dictionary.html",
						   title="Dictionary",
						   css="dictionary",
						   data=ordered_data,
						   w_count=total_w,
						   m_count=total_m)

@app.route('/vocab/add')
def add_vocab():
	# The params
	word_list = request.args.get('words')
	meaning_text = request.args.get('meaning')

	word_list = json.loads(word_list)

	# Add the Meaning
	m = Meaning(m_text=meaning_text)
	db.session.add(m)
	db.session.commit()

	# Add the Words
	for word in word_list:
		w = Word(link_id=m.id,w_text=word)
		db.session.add(w)
	db.session.commit()

	# Return the Meaning ID
	return str(m.id)

@app.route('/vocab/grab')
def get_vocab():
	# The params
	single_word_value = request.args.get('single_word_value')

	# Grab a random meaning
	rand_m = Meaning.query.order_by(func.random()).first()

	# Put all of the words in to a string
	db_words = Word.query.filter_by(link_id=rand_m.id).all()
	c_loop = 1
	word_string = ""
	for w in db_words:
		word = str(w.w_text)
		word_string += word if c_loop == 1 else ", " + word
		c_loop += 1

	# Add all of the data to a dictionary
	data = {}
	data["words"] = word_string;
	data["meaning"] = rand_m.m_text;

	# Return single word if needed
	if (single_word_value == "true"):
		data["single_word"] = (Word.query.filter_by(link_id=rand_m.id).order_by(func.random()).first()).w_text

	# Return the dictionary
	return jsonify(data)