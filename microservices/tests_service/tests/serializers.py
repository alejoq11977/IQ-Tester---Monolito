# tests/serializers.py
from rest_framework import serializers
#from .models import Test

# Cambiamos de ModelSerializer a Serializer
class TestSerializer(serializers.Serializer):
    """
    Este serializer ya no está ligado a un modelo de Django.
    Define explícitamente la "forma" de los datos que esperamos de Firestore.
    """
    # Definimos explícitamente cada campo y su tipo.
    # CharField acepta cualquier texto, por lo que el ID de Firestore es válido.
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=200)
    description = serializers.CharField()
    time_limit_minutes = serializers.IntegerField()

    # Como ya no es un ModelSerializer, no necesitamos la clase Meta
    # class Meta:
    #     model = Test
    #     fields = ['id', 'name', 'description', 'time_limit_minutes']