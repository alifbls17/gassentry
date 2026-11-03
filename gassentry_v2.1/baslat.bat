@echo off
TITLE GasSentry - Backend Sunucusu
COLOR 0B
echo GasSentry FastAPI sunucusu baslatiliyor...
echo Tarayicinizdan http://127.0.0.1:8000 adresine gidebilirsiniz.
echo (Bu pencereyi kapatmadiginiz surece sunucu calismaya devam eder)
echo.

:: Doğrudan python modülü üzerinden başlatarak PATH veya ortam karışıklığını önlüyoruz
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

pause