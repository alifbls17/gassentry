import sqlite3

DB_NAME = "gassentry.db"

def veritabani_baslat():
    baglanti = sqlite3.connect(DB_NAME)
    cursor = baglanti.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gecmis_tahminler (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            il TEXT,
            ay_adi TEXT,
            guncel_tuketim REAL,
            tahmini_donem_sonu REAL,
            kademe_2_tehlikesi INTEGER,
            tarih TEXT
        )
    """)
    baglanti.commit()
    baglanti.close()

def tahmin_kaydet(il, ay_adi, guncel_tuketim, tahmini_donem_sonu, kademe_2_tehlikesi, tarih):
    baglanti = sqlite3.connect(DB_NAME)
    cursor = baglanti.cursor()
    cursor.execute("""
        INSERT INTO gecmis_tahminler (il, ay_adi, guncel_tuketim, tahmini_donem_sonu, kademe_2_tehlikesi, tarih)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (il, ay_adi, guncel_tuketim, tahmini_donem_sonu, int(kademe_2_tehlikesi), tarih))
    baglanti.commit()
    baglanti.close()

def gecmis_getir():
    baglanti = sqlite3.connect(DB_NAME)
    baglanti.row_factory = sqlite3.Row
    cursor = baglanti.cursor()
    cursor.execute("SELECT * FROM gecmis_tahminler ORDER BY id DESC LIMIT 10")
    rows = cursor.fetchall()
    baglanti.close()
    
    sonuclar = []
    for row in rows:
        sonuclar.append({
            "id": row["id"],
            "il": row["il"],
            "ay": row["ay_adi"],
            "tuketim": row["guncel_tuketim"],
            "tahmin": row["tahmini_donem_sonu"],
            "tehlike": bool(row["kademe_2_tehlikesi"]),
            "tarih": row["tarih"]
        })
    return sonuclar

def gecmis_temizle():
    baglanti = sqlite3.connect(DB_NAME)
    cursor = baglanti.cursor()
    cursor.execute("DELETE FROM gecmis_tahminler")
    baglanti.commit()
    baglanti.close()
