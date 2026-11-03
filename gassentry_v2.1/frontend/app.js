let myChart = null;
const BIRIM_FIYAT_TL = 11.50;

const API_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' || window.location.hostname === ''
    ? 'http://127.0.0.1:8000'
    : 'https://gas-sentry-api.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.getElementById('darkModeToggle').innerText = '☀️';
    }

    document.getElementById('darkModeToggle').addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            document.getElementById('darkModeToggle').innerText = '🌙';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            document.getElementById('darkModeToggle').innerText = '☀️';
        }
        gecmisiSunucudanYukle();
    });

    gecmisiSunucudanYukle();
});

document.getElementById('tahminForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const hamIl = document.getElementById('ilInput').value;
    const temizIl = hamIl.trim().toLowerCase()
        .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
        .replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/ü/g, 'u');

    const requestData = {
        il: temizIl,
        ay: parseInt(document.getElementById('ay').value),
        guncel_tuketim: floatParse(document.getElementById('guncel_tuketim').value),
        gecen_gun: parseInt(document.getElementById('gecen_gun').value),
        kalan_gun: parseInt(document.getElementById('kalan_gun').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/tahmin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || 'API hatası oluştu.');
        }
        
        const data = await response.json();
        arayuzuGuncelle(data);
        gecmisiSunucudanYukle();

    } catch (error) {
        alert(error.message || 'Backend sunucusuna bağlanılamadı. Lütfen sunucunun çalıştığından emin olun.');
        console.error(error);
    }
});

function floatParse(val) {
    return parseFloat(val.replace(',', '.')) || 0;
}

function arayuzuGuncelle(data) {
    const sonucAlani = document.getElementById('sonucAlani');
    const durumRozeti = document.getElementById('durumRozeti');
    const sonucMesaj = document.getElementById('sonucMesaj');
    const resmiLimit = document.getElementById('resmiLimit');
    const gunlukOrt = document.getElementById('gunlukOrt');
    const tahminiSon = document.getElementById('tahminiSon');
    const tahminiFatura = document.getElementById('tahminiFatura');
    const onerilenKutu = document.getElementById('onerilenKutu');
    const onerilenMaks = document.getElementById('onerilenMaks');

    resmiLimit.innerText = data.aylik_limit_sm3 + " Sm³";
    gunlukOrt.innerText = data.gunluk_ortalama_tuketim_sm3 + " Sm³";
    tahminiSon.innerText = data.tahmini_donem_sonu_tuketim_sm3 + " Sm³";
    
    const hesaplananTL = data.tahmini_donem_sonu_tuketim_sm3 * BIRIM_FIYAT_TL;
    tahminiFatura.innerText = "≈ " + hesaplananTL.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₺";

    sonucMesaj.innerText = data.mesaj;

    if (data.kademe_2_tehlikesi) {
        durumRozeti.innerText = "TEHLİKELİ BÖLGE";
        durumRozeti.className = "inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        if (data.onerilen_gunluk_maks_tuketim_sm3 > 0) {
            onerilenKutu.classList.remove('hidden');
            onerilenMaks.innerText = data.onerilen_gunluk_maks_tuketim_sm3 + " Sm³";
        } else {
            onerilenKutu.classList.add('hidden');
        }
    } else {
        durumRozeti.innerText = "GÜVENLİ BÖLGE";
        durumRozeti.className = "inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        onerilenKutu.classList.add('hidden');
    }
    sonucAlani.classList.remove('hidden');
}

async function gecmisiSunucudanYukle() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/gecmis`);
        if (!res.ok) throw new Error('Geçmiş veriler alınamadı.');
        const gecmisVerileri = await res.json();
        
        gecmisiArayüzeAktar(gecmisVerileri);
        grafikCiz(gecmisVerileri);
    } catch (err) {
        console.error("Geçmiş yüklenirken hata:", err);
    }
}

function gecmisiArayüzeAktar(gecmis) {
    const listeDiv = document.getElementById('gecmisListesi');
    
    if (!gecmis || gecmis.length === 0) {
        listeDiv.innerHTML = '<p class="text-gray-400 text-center py-2">Henüz kayıtlı işlem bulunmuyor.</p>';
        return;
    }
    
    listeDiv.innerHTML = '';
    gecmis.forEach(kayit => {
        const rozetClass = kayit.tehlike 
            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900' 
            : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900';
        const durumText = kayit.tehlike ? '⚠️ Tehlike' : '✅ Güvenli';
        
        const item = document.createElement('div');
        item.className = `p-2.5 rounded-lg border flex justify-between items-center ${rozetClass}`;
        item.innerHTML = `
            <div>
                <span class="font-bold">${kayit.il} (${kayit.ay})</span> <span class="opacity-75">• ${kayit.tarih}</span><br>
                <span>Mevcut: <b>${kayit.tuketim} Sm³</b> | Tahmini: <b>${kayit.tahmin} Sm³</b></span>
            </div>
            <span class="font-bold px-2 py-1 rounded bg-white dark:bg-gray-800 shadow-sm text-[10px]">${durumText}</span>
        `;
        listeDiv.appendChild(item);
    });
}

function grafikCiz(gecmis) {
    const ctx = document.getElementById('tuketimGrafik').getContext('2d');
    
    const sonKayitlar = gecmis ? [...gecmis].reverse() : [];
    const labels = sonKayitlar.map(k => `${k.il} (${k.ay})`);
    const tahminVerileri = sonKayitlar.map(k => k.tahmin);
    const mevcutVerileri = sonKayitlar.map(k => k.tuketim);

    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#9ca3af' : '#4b5563';
    const gridColor = isDark ? '#374151' : '#e5e7eb';

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length > 0 ? labels : ['Kayıt Yok'],
            datasets: [
                {
                    label: 'Tahmini Dönem Sonu (Sm³)',
                    data: tahminVerileri.length > 0 ? tahminVerileri : [0],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Mevcut Tüketim (Sm³)',
                    data: mevcutVerileri.length > 0 ? mevcutVerileri : [0],
                    borderColor: '#10b981',
                    borderWidth: 2,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: textColor, font: { size: 10 } }
                }
            },
            scales: {
                x: {
                    ticks: { color: textColor, font: { size: 9 } },
                    grid: { color: gridColor }
                },
                y: {
                    ticks: { color: textColor, font: { size: 9 } },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

document.getElementById('temizleBtn').addEventListener('click', async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/gecmis`, { method: 'DELETE' });
        if (res.ok) {
            gecmisiSunucudanYukle();
        }
    } catch (err) {
        console.error("Geçmiş silinemedi:", err);
    }
});
