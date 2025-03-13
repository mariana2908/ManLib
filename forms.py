from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms.validators import DataRequired, Email, Length, EqualTo

# Rota de login e outras rotas do seu código
class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Senha', validators=[DataRequired(), Length(min=6)])

class BibliotecarioRegistroForm(FlaskForm):
    nome = StringField('Nome Completo', validators=[DataRequired(), Length(min=4, max=50)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    senha = PasswordField('Senha', validators=[DataRequired(), Length(min=6, max=20)])
    confirm_senha = PasswordField('Confirmar Senha', validators=[DataRequired(),EqualTo('senha', message='As senhas devem corresponder.')])
    matricula = StringField('Matrícula', validators=[DataRequired()])
    turma = StringField('Turma', validators=[DataRequired()])
    turno = SelectField('Turno', choices=[('matutino', 'Matutino'),('vespertino', 'Vespertino'),('noturno', 'Noturno')], validators=[DataRequired()])
    telefone = StringField('Telefone', validators=[Length(max=15)])
    submit = SubmitField('Registrar')

class EstudanteRegistroForm(FlaskForm):
    nome = StringField('Nome Completo', validators=[DataRequired(), Length(min=4, max=50)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    senha = PasswordField('Senha', validators=[DataRequired(), Length(min=6, max=20)])
    confirm_senha = PasswordField('Confirmar Senha', validators=[DataRequired(), EqualTo('senha', message='As senhas devem corresponder.')])
    matricula = StringField('Matrícula', validators=[DataRequired()])
    turma = StringField('Turma', validators=[DataRequired()])
    turno = SelectField('Turno', choices=[('matutino', 'Matutino'),('vespertino', 'Vespertino'),('noturno', 'Noturno')], validators=[DataRequired()])
    telefone = StringField('Telefone', validators=[Length(max=15)])
    submit = SubmitField('Registrar')