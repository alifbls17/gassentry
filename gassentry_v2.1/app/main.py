from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from datetime import datetime
from app.config import settings
from app.schemas import TahminRequest, TahminResponse
from app.services import GasPredictorService
from app.database import veritabani_baslat, tahmin_kaydet, gecmis_getir, gecmis_temizle

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SQLite veritabanı destekli kurumsal doğalgaz kademe tahmin API mimarisi."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Frontend statik dosyalarını ve arayüzü sunucuya bağla
app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.on_event("startup")
def startup_event():
    veritabani_baslat()

@app.get("/", status_code=status.HTTP_200_OK, tags=["Genel"])
def root():
    return {"status": "healthy", "project": settings.PROJECT_NAME, "version": settings.VERSION}

@app.get("/app", tags=["Arayüz"])
def serve_frontend():
    return FileResponse("frontend/index.html")

@app.post("/api/v1/tahmin", response_model=TahminResponse, status_code=status.HTTP_200_OK, tags=["Hesaplama"])
def kademe_tahmini_yap(request: TahminRequest):
    try:
        response = GasPredictorService.tahmin_uret(request)
        
        tarih_str = datetime.now().strftime("%d %B %Y, %H:%M")
        tahmin_kaydet(
            il=response.il,
            ay_adi=response.ay_adi,
            guncel_tuketim=request.guncel_tuketim,
            tahmini_donem_sonu=response.tahmini_donem_sonu_tuketim_sm3,
            kademe_2_tehlikesi=response.kademe_2_tehlikesi,
            tarih=tarih_str
        )
        
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sunucu tarafında bir hata oluştu: {str(e)}"
        )

@app.get("/api/v1/gecmis", tags=["Geçmiş"])
def gecmis_listele():
    try:
        return gecmis_getir()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Geçmiş veriler alınamadı: {str(e)}"
        )

@app.delete("/api/v1/gecmis", tags=["Geçmiş"])
def gecmis_sil():
    try:
        gecmis_temizle()
        return {"status": "success", "message": "Geçmiş veriler başarıyla temizlendi."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Geçmiş temizlenemedi: {str(e)}"
        )
