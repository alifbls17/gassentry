@echo off
TITLE GasSentry - Otomatik Kurulum
COLOR 0A
echo GasSentry Python kutuphaneleri yukleniyor, lutfen bekleyin...
python -m pip install --upgrade pip
pip install -r requirements.txt
echo.
echo ========================================================
echo Kurulum tamamlandi! Bu pencereyi kapatabilirsiniz.
echo ========================================================
pause
