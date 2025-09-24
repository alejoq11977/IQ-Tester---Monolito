# results/serializers.py
from rest_framework import serializers
from tests.serializers import TestSerializer

# AnswerSerializer y SubmissionSerializer se quedan igual, ya están desacoplados
class AnswerSerializer(serializers.Serializer):
    question_id = serializers.CharField()
    answer = serializers.CharField()

class SubmissionSerializer(serializers.Serializer):
    test_id = serializers.CharField()
    answers = AnswerSerializer(many=True)

# --- MODIFICA ESTE SERIALIZER ---
# Cambiamos de ModelSerializer a Serializer
class ResultSerializer(serializers.Serializer):
    """
    Serializer desacoplado para manejar los datos del historial de resultados
    provenientes de Firestore.
    """
    id = serializers.CharField(read_only=True)
    score = serializers.FloatField()
    created_at = serializers.DateTimeField()
    test = TestSerializer()
    
    # Le decimos explícitamente al serializer que espere un campo llamado 'test'
    # y que los datos dentro de ese campo deben ser validados y formateados
    # usando el TestSerializer.