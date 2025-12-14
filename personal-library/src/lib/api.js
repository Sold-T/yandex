const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const bookAPI = {
  getAllBooks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/`);
      if (!response.ok) {
        throw new Error(`Ошибка при загрузке книг: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Не удалось подключиться к серверу. Убедитесь, что Django API запущен на ${API_BASE_URL}`);
      }
      throw error;
    }
  },

  getBookById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}/`);
      if (!response.ok) {
        throw new Error(`Ошибка при загрузке книги: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Не удалось подключиться к серверу. Убедитесь, что Django API запущен на ${API_BASE_URL}`);
      }
      throw error;
    }
  },

  createBook: async (bookData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Ошибка при создании книги: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Не удалось подключиться к серверу. Убедитесь, что Django API запущен на ${API_BASE_URL}`);
      }
      throw error;
    }
  },

  updateBook: async (id, bookData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || error.detail || `Ошибка при обновлении книги: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('updateBook catch:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Не удалось подключиться к серверу. Убедитесь, что Django API запущен на ${API_BASE_URL}`);
      }
      throw error;
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `Ошибка при удалении книги: ${response.status} ${response.statusText}`);
      }
      if (response.status === 204) {
        return true;
      }
      return await response.json().catch(() => true);
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Не удалось подключиться к серверу. Убедитесь, что Django API запущен на ${API_BASE_URL}`);
      }
      throw error;
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}/mark_as_read/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        let errorData = {};
        try {
          const text = await response.text();
          if (text) {
            errorData = JSON.parse(text);
          }
        } catch (e) {
          // ignore
        }
        throw new Error(errorData.error || errorData.message || `Ошибка при обновлении статуса: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Не удалось подключиться к серверу. Убедитесь, что Django API запущен на ${API_BASE_URL}`);
      }
      throw error;
    }
  },

  markAsUnread: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}/mark_as_unread/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        let errorData = {};
        try {
          const text = await response.text();
          if (text) {
            errorData = JSON.parse(text);
          }
        } catch (e) {
          // ignore
        }
        throw new Error(errorData.error || errorData.message || `Ошибка при обновлении статуса: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Не удалось подключиться к серверу. Убедитесь, что Django API запущен на ${API_BASE_URL}`);
      }
      throw error;
    }
  },
};

