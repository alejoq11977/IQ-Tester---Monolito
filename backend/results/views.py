# results/views.py
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .serializers import SubmissionSerializer, ResultSerializer, TestSerializer
from firebase_admin import firestore
from datetime import datetime, timezone # Importa timezone para fechas conscientes

class StartTestView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        test_id = request.data.get('test_id')
        if not test_id:
            return Response({"error": "test_id es requerido"}, status=status.HTTP_400_BAD_REQUEST)

        db = firestore.client()
        user = request.user

        # Prepara los datos para el nuevo intento de prueba
        attempt_data = {
            'test_id': test_id,
            'user_id': user.id,
            'startTime': datetime.now(timezone.utc), # Usamos una fecha consciente de la zona horaria
            'status': 'in-progress',
            'answers': [],
            'score': None
        }

        # Añade el nuevo documento a la colección 'results'
        _ , attempt_ref = db.collection('results').add(attempt_data)

        return Response({'attemptId': attempt_ref.id}, status=status.HTTP_201_CREATED)


class SubmitTestView(generics.GenericAPIView):
    # Ya no necesitamos un serializer de entrada tan estricto
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # 1. Obtiene los datos directamente del request
        attempt_id = request.data.get('attemptId')
        user_answers = request.data.get('answers', [])
        
        if not attempt_id:
            return Response({"error": "attemptId es requerido"}, status=status.HTTP_400_BAD_REQUEST)

        db = firestore.client()
        user = request.user

        try:
            # 2. Obtiene el documento del intento de la base de datos
            attempt_ref = db.collection('results').document(attempt_id)
            attempt_doc = attempt_ref.get()

            if not attempt_doc.exists:
                return Response({"error": "Intento de prueba no encontrado"}, status=status.HTTP_404_NOT_FOUND)
            
            attempt_data = attempt_doc.to_dict()

            # 3. VALIDACIONES DE SEGURIDAD
            # Asegurarse que el usuario que envía es el dueño del intento
            if attempt_data.get('user_id') != user.id:
                return Response({"error": "No autorizado para enviar este intento"}, status=status.HTTP_403_FORBIDDEN)
            
            # Asegurarse que la prueba no haya sido ya completada
            if attempt_data.get('status') == 'completed':
                return Response({"error": "Esta prueba ya ha sido completada"}, status=status.HTTP_400_BAD_REQUEST)

            # 4. VALIDACIÓN DE TIEMPO
            test_id = attempt_data['test_id']
            test_doc = db.collection('tests').document(test_id).get()
            if not test_doc.exists:
                 return Response({"error": "Test asociado no encontrado"}, status=status.HTTP_404_NOT_FOUND)
            
            time_limit_seconds = test_doc.to_dict().get('time_limit_minutes', 0) * 60
            start_time = attempt_data['startTime']
            
            # Compara la hora de inicio (guardada por el servidor) con la hora actual (del servidor)
            time_elapsed = (datetime.now(timezone.utc) - start_time).total_seconds()

            # Damos 5 segundos de gracia por latencia de red
            if time_elapsed > time_limit_seconds + 5:
                attempt_ref.update({'status': 'timed-out'})
                return Response({"error": "El tiempo para completar la prueba ha expirado"}, status=status.HTTP_400_BAD_REQUEST)

            # 5. CÁLCULO DE PUNTAJE (Lógica movida aquí)
            questions_ref = db.collection('tests').document(test_id).collection('questions').stream()
            correct_answers = {}
            total_questions = 0
            for q in questions_ref:
                q_data = q.to_dict()
                correct_answers[q.id] = q_data.get('correct_answer')
                total_questions += 1

            if total_questions == 0:
                return Response({"error": "Este test no tiene preguntas"}, status=status.HTTP_404_NOT_FOUND)
            
            score_counter = 0
            for answer in user_answers:
                question_id = str(answer['question_id'])
                user_answer = answer['answer']
                if correct_answers.get(question_id) == user_answer:
                    score_counter += 1
            
            percentage_correct = score_counter / total_questions
            iq_score = 80 + (percentage_correct * 60)

            # 6. ACTUALIZA el documento de intento con los resultados finales
            final_data = {
                'status': 'completed',
                'score': iq_score,
                'answers': user_answers,
                'submittedAt': datetime.now(timezone.utc)
            }
            attempt_ref.update(final_data)
            
            return Response({"iq_score": iq_score}, status=status.HTTP_200_OK)

        except Exception as e:
            # Añadimos un log del error en el servidor para facilitar la depuración
            print(f"Error en SubmitTestView: {e}")
            return Response({"error": "Un error inesperado ocurrió en el servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResultHistoryView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        db = firestore.client()

        try:
            # Filtramos los resultados para mostrar solo los que están 'completed'
            results_ref = db.collection('results').where('user_id', '==', user.id).where('status', '==', 'completed').order_by('submittedAt', direction=firestore.Query.DESCENDING).stream()

            history_data = []
            for result in results_ref:
                result_dict = result.to_dict()
                result_dict['id'] = result.id
                
                test_id = result_dict.get('test_id')
                if test_id:
                    test_doc = db.collection('tests').document(test_id).get()
                    if test_doc.exists:
                        test_data = test_doc.to_dict()
                        test_data['id'] = test_doc.id
                        result_dict['test'] = test_data
                    else:
                        result_dict['test'] = {'name': 'Test Eliminado', 'description': ''}
                
                history_data.append(result_dict)
            
            # Ya que construimos la respuesta manualmente, no necesitamos pasarla por un serializer
            return Response(history_data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error en ResultHistoryView: {e}")
            return Response({"error": "Un error inesperado ocurrió en el servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)