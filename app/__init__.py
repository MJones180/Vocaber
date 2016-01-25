import os
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask_mail import Mail
from config import basedir

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

app.config['DEBUG'] = True
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'dashboard.emailing.client@gmail.com'
app.config['MAIL_PASSWORD'] = 'Jones123'
app.config['MAIL_DEFAULT_SENDER'] = 'Dashboard <dashboard.emailing.client@gmail.com>'

mail = Mail(app)

from app import views, models