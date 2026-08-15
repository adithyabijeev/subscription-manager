from django.db import models
from django.contrib.auth.models import User


class Subscription(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    service_name = models.CharField(max_length=200)
    monthly_cost = models.DecimalField(max_digits=10, decimal_places=2)
    billing_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.service_name} - {self.owner.username}"