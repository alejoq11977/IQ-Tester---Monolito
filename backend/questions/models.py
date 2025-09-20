# questions/models.py
from django.db import models
from tests.models import Test # <--- Importa el modelo Test de la otra app

class Question(models.Model):
    test = models.ForeignKey(Test, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    # Opciones de respuesta
    option1 = models.CharField(max_length=200)
    option2 = models.CharField(max_length=200)
    option3 = models.CharField(max_length=200)
    option4 = models.CharField(max_length=200)
    # Guardamos cuál es la opción correcta. Podríamos guardar "option1", "option2", etc.
    correct_answer = models.CharField(max_length=100)

    def __str__(self):
        return self.text[:50] # Muestra los primeros 50 caracteres del texto de la pregunta