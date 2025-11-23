'use client';

import { useState, useEffect } from 'react';
import styles from './BookForm.module.scss';

export default function BookForm({ book, onSubmit, onCancel, isOpen }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    is_read: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        year: book.year || new Date().getFullYear(),
        is_read: book.is_read || false,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        year: new Date().getFullYear(),
        is_read: false,
      });
    }
    setErrors({});
  }, [book, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название книги обязательно';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Автор обязателен';
    }

    const currentYear = new Date().getFullYear();
    if (!formData.year || formData.year < 0 || formData.year > currentYear + 10) {
      newErrors.year = `Год должен быть между 0 и ${currentYear + 10}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        year: parseInt(formData.year, 10),
      });
    } catch (error) {
      alert('Ошибка при сохранении книги');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{book ? 'Редактировать книгу' : 'Добавить новую книгу'}</h2>
          <button className={styles.closeButton} onClick={onCancel}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title">Название книги *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? styles.error : ''}
              placeholder="Введите название книги"
            />
            {errors.title && <span className={styles.errorMessage}>{errors.title}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="author">Автор *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={errors.author ? styles.error : ''}
              placeholder="Введите имя автора"
            />
            {errors.author && <span className={styles.errorMessage}>{errors.author}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="year">Год издания *</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={errors.year ? styles.error : ''}
              placeholder="Год издания"
              min="0"
              max={new Date().getFullYear() + 10}
            />
            {errors.year && <span className={styles.errorMessage}>{errors.year}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="is_read"
                checked={formData.is_read}
                onChange={handleChange}
              />
              <span>Книга прочитана</span>
            </label>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : book ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

