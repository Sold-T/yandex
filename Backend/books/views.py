import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer, BookCreateSerializer

logger = logging.getLogger(__name__)

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BookCreateSerializer
        return BookSerializer
    
    def list(self, request, *args, **kwargs):
        logger.info("Получение списка книг")
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        logger.info(f"Получение книги с id: {kwargs.get('pk')}")
        return super().retrieve(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        logger.info("Создание новой книги", extra={'book_data': request.data})
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        # Создание журнала
        book_id = serializer.instance.id if serializer.instance else 'unknown'
        logger.info(f"Книга успешно создана id: {book_id}")
        
        return Response(
            BookSerializer(serializer.instance).data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def update(self, request, *args, **kwargs):
        logger.info(f"Обновление книги id: {kwargs.get('pk')}")
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        logger.info(f"Частичное обновление книги id: {kwargs.get('pk')}")
        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        book_id = kwargs.get('pk')
        logger.info(f"Удалить книгу id: {book_id}")
        instance = self.get_object()
        self.perform_destroy(instance)
        logger.info(f"Book with id {book_id} deleted successfully")
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        book = self.get_object()
        book.is_read = True
        book.save()
        logger.info(f"Книга id {pk} успешно удалена")
        return Response({'status': 'book marked as read'})
    
    @action(detail=True, methods=['post'])
    def mark_as_unread(self, request, pk=None):
        book = self.get_object()
        book.is_read = False
        book.save()
        logger.info(f"Книга id {pk} помечено как непрочитанное")
        return Response({'status': 'книга помечена как непрочитанная'})

# Логирование
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'books.log',
            'encoding': 'utf-8',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'books': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}