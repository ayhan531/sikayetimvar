# 🚀 Şikayetimvar - Tüketici Şikayetleri Platformu

**Şikayetimvar**, modern Türk tüketicilerin şikayetlerini güvenli bir şekilde paylaşabilmelerine, yönetmelerine ve çözümlemelerine yardımcı olan **production-ready** kapsamlı bir web platformudur.

**Status:** ✅ Production Ready | v1.0.0 | Fully Tested

## 🎯 Özellikler

### Kullanıcı Özellikleri

- **Şikayet Yazma**: Detaylı şikayet formları ile kanıt yükleme
- **Şikayet Araması**: Kategoriye, şirkete veya anahtar kelimeye göre arama
- **Puan Sistemi**: Admin onayında puan kazanma
- **Rütbe Seviyesi**: Puan ile rütbe artışı ve özellik kilidi açma
  - Recruit: 0-10 puan
  - Officer: 11-50 puan
  - Manager: 51-150 puan
  - Director: 151+ puan
- **Kanıt Yükleme**: Şikayetlere dosya ekleme (resim, PDF, Word, Excel)

### Admin Panel

- **Kanıt Onaylama**: Şikayet kanıtlarını inceleme ve onaylama
- **Puan Kazanma**: Kanıt onayında puan ve rütbe yükseltme
- **İstatistikler**: Kişisel onay istatistikleri ve rütbe bilgisi

## 🏗️ Teknoloji Stack

### Backend

- **Framework**: NestJS (TypeScript)
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **CORS**: Express CORS

### Frontend

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Material-UI (MUI v5)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Styling**: MUI + CSS

## 📁 Proje Yapısı

```
şikayetimvar/
├── backend/
│   ├── src/
│   │   ├── entities/          # TypeORM entities (User, Complaint, Evidence, etc.)
│   │   ├── modules/
│   │   │   ├── users/         # User registration & authentication
│   │   │   ├── auth/          # JWT strategy & guards
│   │   │   ├── complaints/    # Complaint CRUD operations
│   │   │   ├── admin/         # Evidence approval & points system
│   │   │   └── categories/    # Category management
│   │   ├── config/            # TypeORM configuration
│   │   └── main.ts            # Application entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/           # Authentication layout
│   │   │   ├── login/        # Login page
│   │   │   └── register/     # Register page
│   │   ├── components/        # Reusable UI components
│   │   │   └── RootLayout.tsx # Main layout with navbar
│   │   ├── services/          # API service layer
│   │   ├── store/             # Zustand stores
│   │   ├── types/             # TypeScript interfaces
│   │   ├── complaints/
│   │   │   ├── page.tsx       # Complaints list
│   │   │   ├── create/        # Create complaint page
│   │   │   └── [id]/          # Complaint detail page
│   │   ├── profile/           # User profile
│   │   ├── admin/             # Admin panel
│   │   └── page.tsx           # Home page
│   ├── .env.local             # Environment variables
│   └── package.json
│
└── docker-compose.yml         # MySQL container configuration
```

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler

- Node.js 18+
- npm 9+
- Docker & Docker Compose
- 3000 ve 3001 portları available

### 1. MySQL Başlat

```bash
cd şikayetimvar
docker-compose up -d
```

Bekle: Docker MySQL container'ı 15-20 saniye içinde hazır olmalı.

### 2. Backend Kur ve Başlat

```bash
cd backend
npm install
npm run start:dev
```

Backend http://localhost:3001'de açılacak

### 3. Frontend Kur ve Başlat (Yeni Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend http://localhost:3000'de açılacak

### 4. Demo Verileri Seed Et

Browser'da ziyaret et:

```
http://localhost:3001/seed
```

Bu endpoint idempotent calisir ve su verileri olusturur:

- Varsayilan kategoriler
- Demo kullanicilar
- Demo sikayetler ve kanitlar
- Varsayilan admin hesabi

Admin panel girisi:

- Email: `admin@sikayetimvar.com`
- Sifre: `Admin123!`

Demo kullanici sifresi:

- `Demo123!`

## 📖 API Endpoints

### Authentication

- `POST /api/users/register` - Yeni kullanıcı kayıt
- `POST /api/users/login` - Giriş yap
- `GET /api/users/profile` - Profil bilgisi (Protected)

### Complaints

- `GET /api/complaints` - Şikayetleri listele (Pagination)
- `GET /api/complaints/:id` - Şikayet detayı
- `POST /api/complaints` - Yeni şikayet oluştur (Protected)
- `DELETE /api/complaints/:id` - Şikayet sil (Protected)
- `GET /api/complaints/search?q=...` - Şikayet ara
- `GET /api/complaints/trending` - Trend şikayetler
- `GET /api/complaints/category/:categoryId` - Kategoriye göre şikayetler

### Admin (Protected - Director rütbe)

- `GET /api/admin/evidence/pending` - Onay bekleyen kanıtlar
- `POST /api/admin/evidence/:id/approve` - Kanıt onayla/reddet
- `GET /api/admin/stats` - Admin istatistikleri
- `GET /api/admin/approvals` - Onay geçmişi

### Categories

- `GET /api/categories` - Tüm kategoriler

## 🔐 Rütbe ve Yetkiler

### Recruit (0-10 puan)

- Şikayet yazma
- Kanıt yükleme

### Officer (11-50 puan)

- Tüm Recruit yetkiler
- Kanıt onaylama başlangıç

### Manager (51-150 puan)

- Tüm Officer yetkiler
- Geliştirilmiş admin panel

### Director (151+ puan)

- Tam admin paneline erişim
- Tüm kanıtları onaylama
- İstatistikleri görüntüleme

## 📝 Örnek Kullanım İşlemleri

### 1. Kullanıcı Kaydı

```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "Ahmet",
    "lastName": "Yılmaz"
  }'
```

Döner:

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "rank": "Recruit"
  }
}
```

### 2. Giriş

```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Şikayet Oluştur

```bash
curl -X POST http://localhost:3001/api/complaints \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kötü hizmet",
    "content": "Çok uzun bir şikayet metni...",
    "categoryId": 1
  }'
```

## 🗄️ Database Şeması

### Users

- `id` (PK)
- `email` (unique)
- `password` (hashed)
- `firstName`
- `lastName`
- `points` (default: 0)
- `rank` (Recruit, Officer, Manager, Director)
- `isAdmin` (default: false)
- `createdAt`
- `updatedAt`

### Complaints

- `id` (PK)
- `title`
- `content`
- `status` (open, pending, approved, resolved, rejected)
- `userId` (FK)
- `categoryId` (FK)
- `viewCount`
- `likeCount`
- `commentCount`
- `createdAt`
- `updatedAt`

### Evidence

- `id` (PK)
- `fileName`
- `fileUrl`
- `description`
- `status` (pending, approved, rejected)
- `complaintId` (FK)
- `uploadedAt`

### AdminApproval

- `id` (PK)
- `evidenceId` (FK)
- `adminId` (FK)
- `approved` (boolean)
- `feedback`
- `pointsGained` (default: 1)
- `approvedAt`

## 🐛 Troubleshooting

### MySQL Bağlantı Hatası

```
Error: connect ECONNREFUSED ::1:3306
```

**Çözüm**: Docker MySQL container'ın çalışmasını kontrol et

```bash
docker-compose ps
docker logs sikayetimvar-db
```

### CORS Hatası

**Çözüm**: Frontend'in API URL'i doğru mu kontrol et (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Token Geçersiz

**Çözüm**: JWT_SECRET environment variable'ı aynı mı kontrol et

## 📊 Proje İstatistikleri

## ✅ Smoke Test

Canli temel akisi hizli dogrulamak icin:

- `SMOKE_TEST_CHECKLIST.md`

- **Backend Routes**: 23
- **Database Tables**: 6
- **Authentication Method**: JWT
- **File Upload**: Multer
- **Frontend Pages**: 6+
- **UI Components**: Material-UI based

## 🎓 Öğrenme Kaynakları

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com)
- [TypeORM Documentation](https://typeorm.io)

## 📞 Destek

Hata raporlamak veya özellik istediğiniz için GitHub Issues'ı kullanınız.

## 📄 Lisans

MIT License - Detaylar LICENSE dosyasında

---

**Son Güncelleme**: 15.04.2026
**Sürüm**: 1.0.0-beta
