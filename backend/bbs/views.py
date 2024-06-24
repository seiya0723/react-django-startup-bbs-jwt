from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TopicSerializer
from .models import Topic


from rest_framework.permissions import IsAuthenticated

class TopicView(viewsets.ModelViewSet):

    permission_classes  = [IsAuthenticated]

    serializer_class    = TopicSerializer
    queryset            = Topic.objects.all()




