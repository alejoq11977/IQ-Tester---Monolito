# questions/views.py
from rest_framework import generics
from .models import Question
from .serializers import QuestionSerializer

class QuestionListView(generics.ListAPIView):
    """
    Esta vista devuelve una lista de preguntas,
    filtradas por el 'test_id' proporcionado en la URL.
    Ejemplo de uso: /api/questions/?test_id=1
    """
    serializer_class = QuestionSerializer

    def get_queryset(self):
        # Obtenemos el valor del parámetro 'test_id' de la URL
        test_id = self.request.query_params.get('test_id')

        # Si el parámetro existe, filtramos las preguntas por ese id
        if test_id is not None:
            return Question.objects.filter(test_id=test_id)
        
        # Si no se proporciona un test_id, no devolvemos ninguna pregunta.
        return Question.objects.none()