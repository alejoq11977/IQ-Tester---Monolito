from rest_framework import serializers

class QuestionSerializer(serializers.Serializer):
    """
    Serializer desacoplado del modelo de Django para manejar datos
    de preguntas provenientes de Firestore.
    """
    id = serializers.CharField(read_only=True)
    text = serializers.CharField()
    option1 = serializers.CharField(max_length=200)
    option2 = serializers.CharField(max_length=200)
    option3 = serializers.CharField(max_length=200)
    option4 = serializers.CharField(max_length=200)
    # NO incluimos 'correct_answer' para no exponerla a la API.