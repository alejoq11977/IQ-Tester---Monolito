from rest_framework import serializers
from .models import Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        # Excluimos 'correct_answer' a propósito para no revelarla en la API.
        fields = ['id', 'test', 'text', 'option1', 'option2', 'option3', 'option4']