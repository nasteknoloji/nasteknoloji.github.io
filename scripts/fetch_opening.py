import json
import requests
from datetime import datetime
import pytz
import os

API_URL = "https://kapalicarsi.apiluna.org"

SYMBOLS = ["USDTRY", "EURTRY", "ALTIN"]

TARGET_PATH = "assets/files/R4e415320426f727361/DovizKapanisFiyat.json"

response = requests.get(API_URL, timeout=15)
response.raise_for_status()

data = response.json()

prices = {}

for item in data:
    code = item.get("code")
    if code in SYMBOLS:
        prices[code] = float(item.get("satis"))

tz = pytz.timezone("Europe/Istanbul")
now = datetime.now(tz)
date_str = now.strftime("%Y-%m-%d")

output = {
    "date": date_str,
    "prices": prices
}

os.makedirs(os.path.dirname(TARGET_PATH), exist_ok=True)

with open(TARGET_PATH, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Opening prices written:", output)
