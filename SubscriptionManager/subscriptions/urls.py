from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubscriptionViewSet, register, login_view, summary

router = DefaultRouter()
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')

urlpatterns = [
    # Auth endpoints
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    # Summary endpoint MUST come before router URLs (to avoid being caught as <pk>)
    path('subscriptions/summary/', summary, name='summary'),
    # Subscription CRUD (router handles GET /subscriptions/, POST, GET /<id>/, PUT, PATCH, DELETE)
    path('', include(router.urls)),
]