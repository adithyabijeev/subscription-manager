from django.contrib import admin
from .models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('service_name', 'monthly_cost', 'billing_date', 'owner', 'created_at')
    list_filter = ('billing_date', 'owner')
    search_fields = ('service_name', 'owner__username')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)