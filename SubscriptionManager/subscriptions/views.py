from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Sum

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import Subscription
from .serializers import SubscriptionSerializer


# ────────────────────────────────────────────────
# Auth Views
# ────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists. Please choose a different username.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(username=username, password=password)
    token = Token.objects.create(user=user)

    return Response({
        'message': 'Registration successful',
        'token': token.key,
        'username': user.username
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {'error': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, created = Token.objects.get_or_create(user=user)

    return Response({
        'message': 'Login successful',
        'token': token.key,
        'username': user.username
    })


# ────────────────────────────────────────────────
# Subscription ViewSet
# ────────────────────────────────────────────────

class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users only see their own subscriptions
        return Subscription.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as owner
        serializer.save(owner=self.request.user)


# ────────────────────────────────────────────────
# Summary Endpoint
# ────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def summary(request):
    subscriptions = Subscription.objects.filter(owner=request.user)
    monthly_total = subscriptions.aggregate(total=Sum('monthly_cost'))['total'] or 0
    annual_total = monthly_total * 12
    subscription_count = subscriptions.count()

    return Response({
        'monthly_total': float(monthly_total),
        'annual_total': float(annual_total),
        'subscription_count': subscription_count,
    })