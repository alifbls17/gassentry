# 🔥 GasSentry v2.1

> **SQLite Destekli Kademeli Doğalgaz Tüketim ve Fatura Aşım Tahmin Sistemi**

GasSentry, kullanıcıların aylık doğalgaz tüketimlerini analiz ederek bulundukları ilin resmi kademe sınırlarını aşma riskini önceden hesaplayan, geçmiş verileri SQLite veritabanında saklayan modern bir web ve API uygulamasıdır.

---

## 🚀 Öne Çıkan Özellikler

- **Akıllı Kademe Tahmini:** Güncel tüketim ve kalan gün sayısına göre ay sonu toplam tüketiminizi ve kademe aşım tehlikenizi hesaplar.
- **SQLite Veritabanı Desteği:** Yapılan tüm hesaplamaları ve geçmiş işlemleri güvenli bir şekilde yerel veritabanında saklar.
- **İllere Göre Özel Sınırlar:** Türkiye'deki illerin iklim koşullarına göre belirlenen resmi doğalgaz kademe limitlerini baz alır.
- **Modern Arayüz & PWA Desteği:** Şık, karanlık mod uyumlu, duyarlı (responsive) web arayüzü ve Progressive Web App (PWA) altyapısı.

---

## 🛠️ Teknolojiler

- **Backend:** Python, FastAPI, Uvicorn, SQLite
- **Frontend:** HTML5, CSS3, JavaScript, Chart.js

---

## 📥 Kurulum ve Çalıştırma

Projeyi bilgisayarınıza indirip çalıştırmak için şu adımları takip edebilirsiniz:

1. **Gerekli Paketlerin Yüklenmesi:**  
   `kurulum.bat` dosyasına çift tıklayarak Python bağımlılıklarının otomatik yüklenmesini sağlayın. *(Alternatif olarak `pip install -r requirements.txt` komutunu kullanabilirsiniz.)*

2. **Sunucunun Başlatılması:**  
   `baslat.bat` dosyasına çift tıklayarak arka plandaki FastAPI sunucusunu çalıştırın.

3. **Arayüzün Açılması:**  
   `frontend/index.html` dosyasına çift tıklayarak arayüzü tarayıcınızda açın ve anında kullanmaya başlayın!

---

## 📄 Lisans
Bu proje açık kaynaklıdır ve dilediğiniz gibi geliştirebilir miyim diye düşünmeden kullanabilirsiniz.
