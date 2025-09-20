# results/models.py
from django.db import models
from tests.models import Test
from django.contrib.auth.models import User

class Result(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resultado para {self.test.name} por {self.user.username} - Puntaje: {self.score}"