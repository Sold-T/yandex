import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_api():
    print("🧪 Тестирование Book API...\n")
    
    # 1. Получить список книг
    print("1. GET /api/books/")
    response = requests.get(f"{BASE_URL}/books/")
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        books = response.json()
        print(f"   Найдено книг: {len(books)}")
    
    # 2. Создать новую книгу
    print("\n2. POST /api/books/")
    new_book = {
        "title": "Мастер и Маргарита",
        "author": "Михаил Булгаков", 
        "year": 1967,
        "is_read": True
    }
    
    response = requests.post(f"{BASE_URL}/books/", json=new_book)
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 201:
        book_data = response.json()
        book_id = book_data['id']
        print(f"   ✅ Книга создана! ID: {book_id}")
        
        # 3. Тест кастомных действий
        print(f"\n3. POST /api/books/{book_id}/mark_as_unread/")
        response = requests.post(f"{BASE_URL}/books/{book_id}/mark_as_unread/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        print(f"\n4. POST /api/books/{book_id}/mark_as_read/")
        response = requests.post(f"{BASE_URL}/books/{book_id}/mark_as_read/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
    else:
        print(f"   ❌ Ошибка: {response.text}")

if __name__ == "__main__":
    test_api()