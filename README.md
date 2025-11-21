# ShopSync

Modern bir ürün yönetim uygulaması. Expo, React Native ve SQLite kullanılarak geliştirilmiştir.

## Özellikler

- 🔐 Kimlik doğrulama (Login/Register)
- 📦 Ürün yönetimi (CRUD işlemleri)
- 🏷️ Kategori bazlı filtreleme
- 📊 Stok güncelleme
- 🎨 Dark/Light tema desteği
- 📸 Ürün görseli ekleme
- 💾 SQLite veritabanı

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Uygulamayı başlatın:
```bash
npm start
```

3. iOS veya Android'de çalıştırın:
```bash
npm run ios
# veya
npm run android
```

## Proje Yapısı

```
/app              # Expo Router ekranları
  /(auth)         # Auth ekranları (Login, Register)
  /(tabs)         # Tab navigation
/components       # Reusable UI componentleri
/db              # SQLite veritabanı ve servisler
/store           # Zustand state management
/theme           # Tema renkleri
/types           # TypeScript type tanımları
```

## Teknolojiler

- Expo ~51.0.0
- React Native 0.74.0
- TypeScript
- Expo Router
- SQLite (expo-sqlite)
- Zustand
- AsyncStorage

## Lisans

MIT

