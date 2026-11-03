from app.config import settings
from app.schemas import TahminRequest, TahminResponse

class GasPredictorService:
    AY_ISIMLERI = {
        1: "Ocak", 2: "Şubat", 3: "Mart", 4: "Nisan", 5: "Mayıs", 6: "Haziran",
        7: "Temmuz", 8: "Ağustos", 9: "Eylül", 10: "Ekim", 11: "Kasım", 12: "Aralık"
    }

    @staticmethod
    def tahmin_uret(data: TahminRequest) -> TahminResponse:
        aylik_limit = settings.KADEME_LIMITLERI[data.il][data.ay]
        
        gunluk_ortalama = data.guncel_tuketim / data.gecen_gun
        tahmini_donem_sonu = data.guncel_tuketim + (gunluk_ortalama * data.kalan_gun)
        
        kademe_2_tehlikesi = tahmini_donem_sonu > aylik_limit
        onerilen_maks = 0.0
        
        if kademe_2_tehlikesi:
            fark = tahmini_donem_sonu - aylik_limit
            kalan_hakk = aylik_limit - data.guncel_tuketim
            if kalan_hakk > 0 and data.kalan_gun > 0:
                onerilen_maks = kalan_hakk / data.kalan_gun
            mesaj = f"⚠️ Tehlike! Kademe-2 sınırını tahminen {fark:.2f} Sm³ aşacaksınız."
        else:
            kalan_hakk = aylik_limit - tahmini_donem_sonu
            mesaj = f"✅ Güvenli Bölge. Dönem sonunda tahmini {kalan_hakk:.2f} Sm³ hakkınız kalacak."

        return TahminResponse(
            il=data.il.capitalize(),
            ay_adi=GasPredictorService.AY_ISIMLERI[data.ay],
            aylik_limit_sm3=round(aylik_limit, 2),
            gunluk_ortalama_tuketim_sm3=round(gunluk_ortalama, 2),
            tahmini_donem_sonu_tuketim_sm3=round(tahmini_donem_sonu, 2),
            kademe_2_tehlikesi=kademe_2_tehlikesi,
            mesaj=mesaj,
            onerilen_gunluk_maks_tuketim_sm3=round(onerilen_maks, 2)
        )
