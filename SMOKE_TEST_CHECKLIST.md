# Smoke Test Checklist

Bu liste seed sonrasi canli temel akisin hizli dogrulamasini hedefler.

## 1. Ortam Hazirligi

1. Docker veritabani ayakta olmali.
2. Backend ayakta olmali (varsayilan: http://localhost:3000).
3. Frontend ayakta olmali (varsayilan: http://localhost:3001).

## 2. Seed Calistirma

1. Tarayicida http://localhost:3000/seed ac.
2. Donen JSON icinde asagidakiler gorunmeli:

- message
- adminCredentials
- totals

3. totals.complaints sifirdan buyuk olmali.
4. totals.pendingEvidences sifirdan buyuk olmali.

## 3. Kimlik Dogrulama

Admin girisi:

- email: admin@sikayetimvar.com
- sifre: Admin123!

Demo kullanici sifresi:

- Demo123!

Kontrol:

1. Login ekranindan admin ile gir.
2. Basarili giris sonrasi /admin acilmali.
3. Cikis yap, demo kullaniciyla gir.
4. Demo kullanici /complaints ekranina yonlenmeli.

## 4. Sikayet Akisi

1. Demo kullanici ile /complaints/create ac.
2. Baslik, icerik, kategori ve en az 1 kanit dosyasi ile formu gonder.
3. /complaints listesinde yeni kayit gorunmeli.
4. Yeni kaydin detayina girildiginde kanit kartlari gorunmeli.

## 5. Admin Onay Akisi

1. Admin ile /admin ekranina gir.
2. Onay bekleyen kanit listesinde kayit gorunmeli.
3. Kaniti onayla veya reddet.
4. Islem sonrasi:

- pending listesi guncellenmeli
- approval history kaydi olusmali
- ilgili kaydin status bilgisi degismeli

## 6. Profil ve Rol Kontrolleri

1. /profile ekraninda puan, rutbe ve tarih bilgileri gorunmeli.
2. Admin kullanici icin admin etiketi gorunmeli.
3. Normal kullanici admin paneline gitmeye calistiginda engellenmeli.

## 7. UI/UX Kontrolleri

1. Ana sayfa hero, trust strip ve kart animasyonlari takilma olmadan calismali.
2. Sikayet detay sayfasinda kanit kart gecisleri ve diyalog akislari sorunsuz olmali.
3. Mobil gorunumde navigasyon ve butonlar tasmama yapmamali.

## 8. Teknik Kontroller

1. Backend lint: backend klasorunde npm run lint
2. Frontend lint: frontend klasorunde npm run lint
3. Her iki komut da hata vermeden tamamlanmali.
