"""
URL configuration for weatherproject project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),   # Admin panel
    path('', include('weather.urls')),  # Homepage → weather app
]