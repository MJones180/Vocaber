from app import db

class Word(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	word = db.Column(db.String(15))
	meaning = db.Column(db.Integer, db.ForeignKey('meaning.id'))

	def __repr__(self):
		return '<Word %r>' % (self.id)

class Meaning(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	word = db.relationship('Word', backref='meaning', lazy='dynamic')
	meaning = db.Column(db.String(150))

	def __repr__(self):
		return '<Meaning %r>' % self.id