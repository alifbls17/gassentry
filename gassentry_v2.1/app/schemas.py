from pydantic import BaseModel, Field, field_validator
from app.config import settings

class TahminRequest(BaseModel):
    il: str = Field(..., description="Hesaplanacak il", example="canakkale")
    ay: int = Field(..., ge=1, le=12, description="Fatura ayı (1-12)", example=10)
    guncel_tuketim: float = Field(..., ge=0, description="Sayaçtan okunan mevcut harcama (Sm³)", example=15.5)
    gecen_gun: int = Field(..., ge=1, description="Fatura döneminde geride kalan gün sayısı", example=15)
    kalan_gun: int = Field(..., ge=0, description="Faturanın kesilmesine kalan gün sayısı", example=16)

    @field_validator('il')
    @classmethod
    def il_kontrolu(cls, v: str) -> str:
        temiz_il = v.strip().lower().replace("ı", "i").replace("ş", "s").replace("ğ", "g").replace("ç", "c").replace("ö", "o").replace("ü", "u")
        if temiz_il not in settings.KADEME_LIMITLERI:
            raise ValueError(f"'{v}' ili için henüz limit verisi bulunmuyor.")
        return temiz_il

class TahminResponse(BaseModel):
    il: str
    ay_adi: str
    aylik_limit_sm3: float
    gunluk_ortalama_tuketim_sm3: float
    tahmini_donem_sonu_tuketim_sm3: float
    kademe_2_tehlikesi: bool
    mesaj: str
    onerilen_gunluk_maks_tuketim_sm3: float = Field(None, description="Kademe-1'de kalmak için aşılmaması gereken günlük limit")
