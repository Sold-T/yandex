from django.db import models
from django.utils import timezone

class Book(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    year = models.IntegerField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'books'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.title} by {self.author}'