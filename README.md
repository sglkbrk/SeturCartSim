# 📦 SeturCartSim

React Native + Expo ile geliştirilmiş bir mobil alışveriş sepeti simülasyon uygulamasıdır. Uygulama, ürün listeleme, kategori filtreleme, sepet yönetimi gibi temel e-ticaret senaryolarını simüle eder.

## 🚀 Özellikler

- ✅ Ürünleri listeleme ve kategorilere göre filtreleme
- 🛒 Sepete ürün ekleme, çıkarma, miktar azaltma
- 📦 Ürün stok kontrolü
- 🔍 Arama özelliği
- 📊 Jest ile test altyapısı
- 🧹 ESLint + Prettier ile kod kalitesi ve formatlama
- 🌐 Expo ile Android, iOS ve Web desteği
- 💡 Typescript ile yazılmıştır

## 📁 Proje Yapısı

```
src/
│
├── components/        # Ortak bileşenler (ProductCard)
├── screens/           # Sayfalar (HomeScreen, CartScreen)
├── store/             # Zustand store'ları (useCartStore)
├── types/             # Tip tanımları (Product, Category)
├── utils/             # Yardımcı fonksiyonlar
├── theme/             # Tema dosyaları (light, dark)
└── assets/            # Görseller, ikonlar vs.
```

## 🛠️ Kurulum

Projeyi çalıştırmak için aşağıdaki adımları takip edebilirsin:

### 1. Depoyu klonla

```bash
git clone https://github.com/sglkbrk/SeturCartSim.git
cd SeturCartSim
```

### 2. Bağımlılıkları yükle

```bash
yarn install
```

### 3. iOS için Pod kurulumunu yap (sadece macOS)

```bash
npx pod-install
```

### 4. Uygulamayı başlat

#### Android

```bash
yarn android
```

#### iOS

```bash
yarn ios
```

#### Web

```bash
yarn web
```

> Geliştirme ortamını başlatmak için:  
> `yarn start` komutu ile Expo Developer Tools arayüzünü açabilirsin.

## 🥪 Testler

Testleri çalıştırmak için:

```bash
yarn test
```

Testleri izleme modunda başlatmak için:

```bash
yarn test:watch
```

Kapsamlı test raporu için:

```bash
yarn coverage
```

## 🧼 Lint ve Format

Kod kalitesini kontrol etmek ve formatlamak için:

```bash
yarn lint

yarn format
```

## 📸 Ekran Görüntüleri

Aşağıya proje çalışırken alınmış bazı ekran görüntülerini görebilirsiniz

- ./screenshots/home.png
- ./screenshots/cart.png
- ./screenshots/product-detail.png

---

## 📄 Lisans

MIT © [burak saglık](https://github.com/sglkbrk)
