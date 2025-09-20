# users/views.py
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserSerializer

# Vista para el Registro
class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny] # Cualquiera puede registrarse
    serializer_class = RegisterSerializer

# Vista para obtener los datos del usuario actual
class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated] # Solo usuarios logueados
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user