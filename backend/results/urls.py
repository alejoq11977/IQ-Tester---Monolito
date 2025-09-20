# results/urls.py
from django.urls import path
from .views import SubmitTestView, ResultHistoryView

urlpatterns = [
    path('submit/', SubmitTestView.as_view(), name='test-submit'),
    path('history/', ResultHistoryView.as_view(), name='result-history'),
]