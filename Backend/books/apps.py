from django.apps import AppConfig

class BooksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'books'
    verbose_name = '📚 Библиотека книг'
    
    def ready(self):
        try:
            import books.signals  # если будут сигналы
        except ImportError:
            pass