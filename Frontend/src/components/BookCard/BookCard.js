'use client';

import { useState } from 'react';
import styles from './BookCard.module.scss';

export default function BookCard({ book, onEdit, onDelete, onToggleRead }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      setIsDeleting(true);
      try {
        await onDelete(book.id);
      } catch (error) {
        alert('Ошибка при удалении книги');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`${styles.card} ${book.is_read ? styles.read : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{book.title}</h3>
        <span className={`${styles.status} ${book.is_read ? styles.readBadge : styles.unreadBadge}`} title={book.is_read ? 'Прочитано' : 'Не прочитано'}>
          {book.is_read ? '✓' : '✗'}
        </span>
      </div>
      <div className={styles.content}>
        <p className={styles.author}>
          <strong>Автор:</strong> {book.author}
        </p>
        <p className={styles.year}>
          <strong>Год:</strong> {book.year}
        </p>
        <p className={styles.date}>
          <strong>Добавлено:</strong> {formatDate(book.created_at)}
        </p>
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.toggleButton}`}
          onClick={() => onToggleRead(book.id, !book.is_read)}
          disabled={isDeleting}
        >
          {book.is_read ? 'Отметить непрочитанной' : 'Отметить прочитанной'}
        </button>
        <button
          className={`${styles.button} ${styles.editButton}`}
          onClick={() => onEdit(book)}
          disabled={isDeleting}
        >
          Редактировать
        </button>
        <button
          className={`${styles.button} ${styles.deleteButton}`}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </button>
      </div>
    </div>
  );
}

