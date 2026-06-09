# Product Admin Panel

Bu proje, React, Node.js, Express, PostgreSQL ve Prisma kullanılarak geliştirilmiş basit bir ürün yönetim panelidir.

## Proje Amacı

Bu projede ürünler üzerinde temel CRUD işlemleri yapılabilmektedir. Amaç; frontend ve backend tarafında tam yığın bir yönetim paneli mantığını uygulamak, tablo yönetimi, form işlemleri, filtreleme ve veri dışa aktarma gibi sık kullanılan admin panel özelliklerini geliştirmektir.

## Özellikler

- Ürün listeleme
- Yeni ürün ekleme
- Ürün düzenleme
- Ürün silme
- Silme işlemi öncesi onay penceresi
- Ürün adına ve açıklamaya göre arama
- Fiyat aralığına göre filtreleme
- Kolon göster / gizle
- Tablo sıralama
- Sayfalama
- Excel'e veri aktarma

## Kullanılan Teknolojiler

### Frontend
- React
- Vite
- Ant Design
- CSS

### Backend
- Node.js
- Express.js
- Prisma
- PostgreSQL

## Proje Yapısı

- `frontend/` React tabanlı yönetim paneli
- `backend/` Node.js + Express API servisi

## API Endpointleri

- `GET /api/products` → ürünleri listele
- `POST /api/products` → yeni ürün ekle
- `PUT /api/products/:id` → ürün güncelle
- `DELETE /api/products/:id` → ürün sil

## Projeyi Çalıştırma

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
