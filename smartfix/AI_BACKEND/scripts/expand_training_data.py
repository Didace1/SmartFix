"""
Generate expanded training data covering all smartphone brands/models
from the frontend DeviceInfoForm, plus more laptop model variety.
Appends to comprehensive_training_data_fixed.csv.
"""
import csv
import os
from pathlib import Path

OUTPUT = Path(__file__).resolve().parents[1] / "data" / "raw" / "comprehensive_training_data_fixed.csv"

# ---------- Smartphone fault templates (device_type, brand, model, symptom_text, diagnosis, components, repair_time, success_rate, technician_level)
SMARTPHONE_FAULTS = [
    ("won't turn on no power dead phone",            "Power supply failure",    "Battery;Charging port;Power IC",          45, 88.0, "Intermediate"),
    ("dead battery drains fast not charging",         "Battery failure",         "Battery;Charging port",                   40, 95.0, "Beginner"),
    ("cracked screen broken display glass shattered", "Screen damage",           "Display;Touch digitizer;Front glass",     60, 94.0, "Advanced"),
    ("touch not working unresponsive screen",         "Touch failure",           "Touch digitizer;Display;Flex cable",      55, 90.0, "Advanced"),
    ("slow performance lag freezing apps crash",      "Software issue",          "RAM;Processor;Storage",                   30, 88.0, "Beginner"),
    ("overheating phone gets very hot burns",         "Cooling system failure",  "Processor;Battery;Thermal pad",           45, 85.0, "Intermediate"),
    ("wifi not connecting no internet bluetooth",     "Network failure",         "Wifi chip;Antenna;Bluetooth module",      35, 90.0, "Intermediate"),
    ("no sound speaker audio crackling",              "Audio failure",           "Speaker;Audio IC;Earpiece",               30, 88.0, "Beginner"),
    ("camera not working blurry photos black camera", "Camera failure",          "Camera module;Lens;Camera flex cable",    50, 92.0, "Advanced"),
    ("charging port loose not charging properly",     "DC jack failure",         "Charging port;Flex cable;Battery",        45, 93.0, "Intermediate"),
    ("water damage liquid spill phone got wet",       "Liquid damage",           "Motherboard;Battery;Display;Speaker",     90, 65.0, "Advanced"),
    ("phone keeps restarting boot loop crash",        "Boot failure",            "Storage;Motherboard;Operating system",    60, 80.0, "Advanced"),
    ("microphone not working cant hear me on calls",  "Audio failure",           "Microphone;Audio IC;Flex cable",          35, 88.0, "Intermediate"),
    ("fingerprint sensor not working biometrics",     "Physical damage",         "Fingerprint sensor;Flex cable;Home button", 40, 85.0, "Intermediate"),
    ("gps not working location inaccurate",           "Network failure",         "GPS antenna;Motherboard;Firmware",        30, 82.0, "Intermediate"),
    ("face id not working facial recognition",        "Camera failure",          "IR camera;Dot projector;Flood illuminator", 55, 78.0, "Advanced"),
    ("sim card not detected no signal no service",    "Network failure",         "SIM tray;SIM reader;Antenna;Motherboard", 40, 88.0, "Intermediate"),
    ("vibration motor not working no haptic feedback","Physical damage",         "Vibration motor;Taptic engine;Flex cable", 35, 92.0, "Beginner"),
]

# Brands and representative models
SMARTPHONE_BRANDS = {
    "Apple": [
        "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 15 Pro Max", "iPhone 15",
        "iPhone 14 Pro", "iPhone 14", "iPhone 13", "iPhone 12",
        "iPhone SE (3rd generation)", "iPhone 11",
    ],
    "Samsung": [
        "Galaxy S25 Ultra", "Galaxy S24 Ultra", "Galaxy S24", "Galaxy S23 Ultra",
        "Galaxy S23", "Galaxy Z Fold 6", "Galaxy Z Flip 6",
        "Galaxy A55 5G", "Galaxy A54 5G", "Galaxy A15",
    ],
    "Google": [
        "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", "Pixel 8 Pro", "Pixel 8",
        "Pixel 8a", "Pixel 7 Pro", "Pixel 7", "Pixel 7a", "Pixel 6 Pro",
    ],
    "OnePlus": [
        "OnePlus 12", "OnePlus 12R", "OnePlus Open", "OnePlus 11",
        "OnePlus 10 Pro", "OnePlus Nord 4", "OnePlus Nord CE 4",
        "OnePlus Nord 3", "OnePlus 10T",
    ],
    "Xiaomi": [
        "Xiaomi 14 Ultra", "Xiaomi 14 Pro", "Xiaomi 14", "Xiaomi 14T Pro",
        "Xiaomi 13 Ultra", "Redmi Note 13 Pro+ 5G", "Redmi Note 13 Pro 5G",
        "POCO X6 Pro", "POCO F6 Pro", "POCO F6",
    ],
}

# Extra laptop models to increase diversity (currently mostly Dell XPS 13)
EXTRA_LAPTOP_FAULTS = [
    ("won't turn on no power black screen",       "Power supply failure",    "Power adapter;Battery;Motherboard",  60, 90.0, "Intermediate"),
    ("dead battery not charging",                  "Battery failure",         "Battery;Charging port",              45, 95.0, "Beginner"),
    ("screen cracked broken display",              "Screen damage",           "Display;Touch digitizer",            75, 95.0, "Advanced"),
    ("slow performance lag freezing",              "Software issue",          "RAM;SSD;Operating system",           90, 85.0, "Intermediate"),
    ("overheating fan loud hot",                   "Cooling system failure",  "Fan;Heat sink;Thermal paste",        60, 88.0, "Intermediate"),
    ("wifi not connecting no internet",            "Network failure",         "Wifi card;Network drivers",          30, 92.0, "Beginner"),
    ("keyboard not working some keys",             "Keyboard failure",        "Keyboard;Ribbon cable",              45, 90.0, "Intermediate"),
    ("no sound speaker audio issue",               "Audio failure",           "Speakers;Audio jack",                30, 85.0, "Beginner"),
    ("usb ports not working",                      "USB failure",             "USB ports;Motherboard",              45, 87.0, "Intermediate"),
    ("blue screen crash random restarts",          "RAM failure",             "RAM;Motherboard",                    45, 88.0, "Intermediate"),
    ("hard drive not detected no storage",         "Storage failure",         "SSD;SATA cable;M.2 slot",           50, 90.0, "Intermediate"),
    ("trackpad not responding cursor jumping",     "Trackpad failure",        "Trackpad;Ribbon cable",              40, 88.0, "Intermediate"),
    ("gpu artifacts screen glitches display lines","GPU failure",             "GPU;Display cable;Motherboard",      60, 75.0, "Advanced"),
    ("bios not loading firmware corrupt",          "BIOS corruption",         "BIOS chip;CMOS battery",            45, 82.0, "Advanced"),
]

EXTRA_LAPTOP_BRANDS = {
    "HP": [
        "Pavilion 15", "Envy x360 15", "Spectre x360 14", "EliteBook 840",
        "ProBook 450", "Omen 16", "ZBook Firefly 14",
    ],
    "Dell": [
        "Inspiron 15 5000", "XPS 15", "Latitude 5430", "Latitude 7430",
        "Alienware m16", "Dell G15", "Precision 5480",
    ],
    "Lenovo": [
        "ThinkPad X1 Carbon", "ThinkPad T14", "IdeaPad 5", "Legion 5 Gen 9",
        "Yoga 9", "ThinkBook 16", "LOQ 16",
    ],
    "Apple": [
        "MacBook Air 13-inch (M3, 2024)", "MacBook Pro 14-inch (M3 Pro / M3 Max, 2023)",
        "MacBook Pro 16-inch (M3 Pro / M3 Max, 2023)", "MacBook Air 15-inch (M2, 2023)",
        "MacBook Pro 13-inch (M2, 2022)",
    ],
    "ASUS": [
        "ROG Zephyrus G14 (GA401/GA403)", "ROG Strix G16 (G614)", "TUF Gaming A15 (FA506)",
        "ZenBook 14 OLED (UX3405)", "Vivobook 15 (X1502)", "ProArt Studiobook 16 OLED (H7604)",
    ],
    "Acer": [
        "Predator Helios 16 (PH16)", "Nitro 5 (AN515 / AN517)", "Aspire 5 (A515)",
        "Swift Go 14 (SFG14)", "TravelMate P4 (TMP414)", "ConceptD 5 (CN514)",
    ],
}


def main():
    # Read existing rows to avoid duplicates
    existing = set()
    if OUTPUT.exists():
        with open(OUTPUT, "r", newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                key = (row["device_type"], row["brand"], row["model"], row["symptom_text"])
                existing.add(key)

    new_rows = []

    # --- Smartphone data ---
    for brand, models in SMARTPHONE_BRANDS.items():
        for model in models:
            for symptom, diag, comps, rtime, srate, level in SMARTPHONE_FAULTS:
                key = ("smartphone", brand, model, symptom)
                if key not in existing:
                    new_rows.append({
                        "device_type": "smartphone",
                        "brand": brand,
                        "model": model,
                        "symptom_text": symptom,
                        "diagnosis": diag,
                        "components": comps,
                        "repair_time": rtime,
                        "success_rate": srate,
                        "technician_level": level,
                    })
                    existing.add(key)

    # --- Extra laptop data ---
    for brand, models in EXTRA_LAPTOP_BRANDS.items():
        for model in models:
            for symptom, diag, comps, rtime, srate, level in EXTRA_LAPTOP_FAULTS:
                key = ("laptop", brand, model, symptom)
                if key not in existing:
                    new_rows.append({
                        "device_type": "laptop",
                        "brand": brand,
                        "model": model,
                        "symptom_text": symptom,
                        "diagnosis": diag,
                        "components": comps,
                        "repair_time": rtime,
                        "success_rate": srate,
                        "technician_level": level,
                    })
                    existing.add(key)

    # Append to CSV
    fieldnames = [
        "device_type", "brand", "model", "symptom_text",
        "diagnosis", "components", "repair_time", "success_rate", "technician_level"
    ]

    write_header = not OUTPUT.exists()
    with open(OUTPUT, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if write_header:
            writer.writeheader()
        writer.writerows(new_rows)

    print(f"Added {len(new_rows)} new training records to {OUTPUT.name}")
    print(f"Total records now: {len(existing)}")


if __name__ == "__main__":
    main()
