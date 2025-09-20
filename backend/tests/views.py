from rest_framework import generics
from .models import Test
from .serializers import TestSerializer

class TestListView(generics.ListAPIView):
    """
    Esta vista devuelve una lista de todas las pruebas de IQ.
    """
    queryset = Test.objects.all()
    serializer_class = TestSerializer