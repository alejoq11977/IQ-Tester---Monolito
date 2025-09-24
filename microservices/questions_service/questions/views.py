# questions/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import QuestionSerializer
from firebase_admin import firestore

class QuestionListView(generics.GenericAPIView):
    """
    Esta vista devuelve una lista de preguntas de una prueba específica,
    obtenidas de la subcolección 'questions' en Cloud Firestore.
    Espera un parámetro en la URL: ?test_id=<ID_DEL_TEST>
    """
    serializer_class = QuestionSerializer

    def get(self, request, *args, **kwargs):
        # 1. Obtiene el ID del test desde los parámetros de la URL
        test_id = request.query_params.get('test_id')

        # Si no se proporciona un test_id, devuelve un error
        if not test_id:
            return Response(
                {"error": "El parámetro 'test_id' es requerido."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 2. Obtiene una referencia a la base de datos de Firestore
        db = firestore.client()

        try:
            # 3. Construye la ruta a la subcolección
            # Apunta a la colección 'tests', luego al documento con 'test_id',
            # y finalmente a su subcolección 'questions'.
            questions_ref = db.collection('tests').document(test_id).collection('questions').stream()

            # 4. Formatea los datos, añadiendo el ID de cada pregunta
            questions_data = []
            for question in questions_ref:
                question_dict = question.to_dict()
                question_dict['id'] = question.id
                questions_data.append(question_dict)
            
            # 5. Serializa y devuelve la respuesta
            serializer = self.get_serializer(questions_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            # Maneja el caso en que el test_id no exista o haya un error de conexión
            # Nota: Firestore no lanza un error "Not Found" al apuntar a un documento
            # que no existe, simplemente devuelve un stream vacío.
            # Podríamos añadir una comprobación extra si quisiéramos.
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)