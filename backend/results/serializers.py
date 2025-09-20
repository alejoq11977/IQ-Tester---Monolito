# results/serializers.py
from rest_framework import serializers
from .models import Result
from questions.models import Question # Necesitamos el modelo Question
from tests.serializers import TestSerializer 

# Serializer para manejar CADA respuesta individual que envía el usuario
class AnswerSerializer(serializers.Serializer):
    # Le decimos a DRF que esperamos un 'question_id' que sea un entero
    question_id = serializers.IntegerField()
    # Y una 'answer' que sea una cadena de texto (ej: "option1")
    answer = serializers.CharField()

# Serializer principal para la petición de envío completa
class SubmissionSerializer(serializers.Serializer):
    test_id = serializers.IntegerField()
    answers = AnswerSerializer(many=True)

class ResultSerializer(serializers.ModelSerializer):
    # 'test' es el nombre del campo ForeignKey en el modelo Result.
    # Al anidar el TestSerializer aquí, le decimos a DRF que incluya
    # todos los detalles del test (nombre, descripción, etc.) en la respuesta.
    test = TestSerializer(read_only=True)

    class Meta:
        model = Result
        # Incluimos el nuevo campo 'test' en la lista de campos
        fields = ['id', 'test', 'score', 'created_at']