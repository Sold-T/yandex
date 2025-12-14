from django.contrib import admin
from .models import Book

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'author', 'year', 'is_read', 'created_at']
    list_filter = ['is_read', 'year', 'created_at']
    search_fields = ['title', 'author']
    list_editable = ['is_read']
    ordering = ['-created_at']
    list_per_page = 20
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'author', 'year')
        }),
        ('Статус', {
            'fields': ('is_read',)
        }),
        ('Дополнительно', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ['created_at']