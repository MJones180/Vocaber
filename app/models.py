from app import db

class Word(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	w_text = db.Column(db.String(15))
	link_id = db.Column(db.Integer)

	def __repr__(self):
		return '<Word %r>' % (self.id)

class Meaning(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	m_text = db.Column(db.String(150))

	def __repr__(self):
		return '<Meaning %r>' % self.id