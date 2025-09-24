# tests/urls.py
from django.urls import path
from .views import TestListView

urlpatterns = [
    path('', TestListView.as_view(), name='test-list'),
]