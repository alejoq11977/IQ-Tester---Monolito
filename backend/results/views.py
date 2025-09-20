# results/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import SubmissionSerializer, ResultSerializer
from .models import Result
from questions.models import Question
from tests.models import Test
from rest_framework import permissions

class SubmitTestView(generics.GenericAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        # 1. Validar los datos de entrada
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        test_id = data['test_id']
        user_answers = data['answers']

        user = request.user 

        try:
            # 2. Obtener todas las preguntas y respuestas correctas para ese test
            questions = Question.objects.filter(test_id=test_id)
            correct_answers = {q.id: q.correct_answer for q in questions}
            total_questions = questions.count()

            if total_questions == 0:
                return Response({"error": "Test no encontrado o sin preguntas."}, status=status.HTTP_404_NOT_FOUND)

            # 3. Calcular el número de respuestas correctas
            score_counter = 0
            for answer in user_answers:
                question_id = answer['question_id']
                user_answer = answer['answer']
                if correct_answers.get(question_id) == user_answer:
                    score_counter += 1
            
            # 4. Calcular el puntaje de IQ (lógica simplificada)
            # Fórmula simple: 80 + (porcentaje de aciertos * 60)
            # Esto da un rango de 80 (0%) a 140 (100%)
            percentage_correct = score_counter / total_questions
            iq_score = 80 + (percentage_correct * 60)

            # 5. Guardar el resultado en la base de datos
            test_instance = Test.objects.get(id=test_id)
            Result.objects.create(test=test_instance, score=iq_score, user=user)
            
            # 6. Devolver el resultado al usuario
            return Response({"iq_score": iq_score}, status=status.HTTP_200_OK)

        except Test.DoesNotExist:
            return Response({"error": "Test no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ResultHistoryView(generics.ListAPIView):
    """
    Esta vista devuelve una lista de todos los resultados (historial)
    para el usuario que está actualmente autenticado.
    """
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtra el queryset de Result para que solo devuelva los objetos
        # donde el campo 'user' sea igual al usuario que hace la petición.
        return Result.objects.filter(user=self.request.user).order_by('-created_at')