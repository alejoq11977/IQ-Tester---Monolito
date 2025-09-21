from django.urls import path
from .views import SubmitTestView, ResultHistoryView, StartTestView

urlpatterns = [
    path('start/', StartTestView.as_view(), name='test-start'),
    path('submit/', SubmitTestView.as_view(), name='test-submit'),
    path('history/', ResultHistoryView.as_view(), name='result-history'),
]