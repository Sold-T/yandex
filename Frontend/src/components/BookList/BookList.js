'use client';

import { useState, useEffect } from 'react';
import BookCard from '../BookCard/BookCard';
import BookForm from '../BookForm/BookForm';
import { bookAPI } from '@/lib/api';
import styles from './BookList.module.scss';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookAPI.getAllBooks();
      setBooks(data);
    } catch (err) {
      setError('Не удалось загрузить книги. Проверьте, что сервер запущен.');
      console.error('Ошибка загрузки книг:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (bookData) => {
    try {
      if (editingBook) {
        await bookAPI.updateBook(editingBook.id, bookData);
      } else {
        await bookAPI.createBook(bookData);
      }
      setIsFormOpen(false);
      setEditingBook(null);
      await loadBooks();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await bookAPI.deleteBook(id);
      await loadBooks();
    } catch (err) {
      throw err;
    }
  };

  const handleToggleRead = async (id, isRead) => {
    try {
      if (isRead) {
        await bookAPI.markAsRead(id);
      } else {
        await bookAPI.markAsUnread(id);
      }
      await loadBooks();
    } catch (err) {
      alert('Ошибка при обновлении статуса книги');
      console.error('Ошибка обновления статуса:', err);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBook(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка книг...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Моя библиотека</h1>
        <button className={styles.addButton} onClick={handleAddBook}>
          + Добавить книгу
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={loadBooks} className={styles.retryButton}>
            Попробовать снова
          </button>
        </div>
      )}

      {books.length === 0 && !error ? (
        <div className={styles.empty}>
          <p>Ваша библиотека пуста</p>
          <p className={styles.emptySubtext}>Добавьте первую книгу, чтобы начать</p>
          <button className={styles.addButton} onClick={handleAddBook}>
            + Добавить книгу
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
              onToggleRead={handleToggleRead}
            />
          ))}
        </div>
      )}

      <BookForm
        book={editingBook}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseForm}
        isOpen={isFormOpen}
      />
    </div>
  );
}

