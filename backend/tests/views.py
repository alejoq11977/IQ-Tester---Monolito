# tests/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import TestSerializer
from firebase_admin import firestore # <--- Importa firestore

class TestListView(generics.GenericAPIView): # <--- Cambia de ListAPIView a GenericAPIView
    """
    Esta vista devuelve una lista de todas las pruebas de IQ
    obtenidas desde la colección 'tests' en Cloud Firestore.
    """
    serializer_class = TestSerializer

    def get(self, request, *args, **kwargs):
        # 1. Obtiene una referencia a la base de datos de Firestore
        db = firestore.client()

        try:
            # 2. Apunta a la colección 'tests' y obtiene todos los documentos
            tests_ref = db.collection('tests').stream()

            # 3. Formatea los datos para que el serializer los entienda
            tests_data = []
            for test in tests_ref:
                # El ID del documento no está dentro de los datos, así que lo añadimos manualmente
                test_dict = test.to_dict()
                test_dict['id'] = test.id 
                tests_data.append(test_dict)

            # 4. Usa el serializer para validar y formatear la salida (opcional pero buena práctica)
            serializer = self.get_serializer(tests_data, many=True)
            
            # 5. Devuelve los datos
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            # Maneja cualquier posible error de conexión con Firebase
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)