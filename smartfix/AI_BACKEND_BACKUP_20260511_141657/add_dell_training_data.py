"""
Script to append Dell universal fault training data to the existing CSV.
Run once: python add_dell_training_data.py
"""
import csv
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "raw", "comprehensive_training_data_fixed.csv")

DELL_RECORDS = [
    # ── Power Button LED Blink Codes ──────────────────────────────────────────
    ("laptop","Dell","Universal","power button 1 blink LED motherboard EC ROM failure",
     "Motherboard failure","Motherboard;System board",120,45.0,"Advanced"),
    ("laptop","Dell","Universal","power button 2 blinks LED RAM memory not detected",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","Dell","Universal","power button 3 blinks LED motherboard chipset CPU failure",
     "Motherboard failure","Motherboard;Chipset",120,45.0,"Advanced"),
    ("laptop","Dell","Universal","power button 4 blinks LED all RAM sticks bad memory subsystem",
     "RAM failure","RAM;Motherboard",30,80.0,"Intermediate"),
    ("laptop","Dell","Universal","power button 5 blinks LED CMOS battery RTC failure",
     "CMOS battery failure","CMOS battery;RTC circuit",15,95.0,"Beginner"),
    ("laptop","Dell","Universal","power button 6 blinks LED video GPU graphics failure",
     "GPU failure","GPU;LCD panel;Motherboard",120,50.0,"Advanced"),
    ("laptop","Dell","Universal","power button 7 blinks LED CPU processor failure",
     "CPU failure","CPU;Motherboard",120,40.0,"Advanced"),
    ("laptop","Dell","Universal","power button 8 blinks LCD display failure panel cable",
     "Display failure","LCD panel;LCD cable",60,88.0,"Intermediate"),
    ("laptop","Dell","Universal","power button 2 blinks pause 1 blink BIOS corruption",
     "BIOS corruption","BIOS chip;USB recovery",60,70.0,"Advanced"),
    ("laptop","Dell","Universal","power button continuous blinking no pattern power rail short",
     "Motherboard failure","Motherboard;Voltage regulator",120,40.0,"Advanced"),

    # ── Beep Codes (Older Models) ─────────────────────────────────────────────
    ("laptop","Dell","Universal","1 beep on startup motherboard BIOS ROM failure",
     "Motherboard failure","Motherboard;BIOS ROM",120,45.0,"Advanced"),
    ("laptop","Dell","Universal","2 beeps on startup RAM not detected memory",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","Dell","Universal","3 beeps on startup motherboard chipset failure",
     "Motherboard failure","Motherboard;Chipset",120,45.0,"Advanced"),
    ("laptop","Dell","Universal","4 beeps on startup RAM read write error failure",
     "RAM failure","RAM;RAM slot",30,85.0,"Beginner"),
    ("laptop","Dell","Universal","5 beeps on startup CMOS battery failure RTC",
     "CMOS battery failure","CMOS battery",15,95.0,"Beginner"),
    ("laptop","Dell","Universal","6 beeps on startup video GPU graphics failure",
     "GPU failure","GPU;Motherboard",120,50.0,"Advanced"),
    ("laptop","Dell","Universal","7 beeps on startup CPU processor failure",
     "CPU failure","CPU;Motherboard",120,40.0,"Advanced"),
    ("laptop","Dell","Universal","8 beeps on startup LCD display failure",
     "Display failure","LCD panel;LCD cable",60,88.0,"Intermediate"),

    # ── Power-On Failures ─────────────────────────────────────────────────────
    ("laptop","Dell","Universal","absolutely dead no lights no fan completely no power",
     "Power supply failure","Power adapter;DC jack;Battery;Motherboard",60,75.0,"Intermediate"),
    ("laptop","Dell","Universal","power button LED turns on then off after 2 seconds short circuit",
     "Motherboard failure","Motherboard;Voltage regulator",90,55.0,"Advanced"),
    ("laptop","Dell","Universal","power button LED stays white orange screen black no display",
     "RAM failure","RAM;LCD cable;LCD panel;BIOS",60,78.0,"Intermediate"),
    ("laptop","Dell","Universal","fan spins loudly but no display no POST stuck power state",
     "GPU failure","GPU;Motherboard;Power state",90,55.0,"Advanced"),
    ("laptop","Dell","Universal","turns on shuts down turns on loop boot loop power cycle",
     "BIOS corruption","BIOS chip;Power supply;Motherboard",60,65.0,"Advanced"),
    ("laptop","Dell","Universal","boots to black screen with cursor blinking no OS",
     "Boot failure","OS;HDD;SSD;Drivers",60,80.0,"Intermediate"),
    ("laptop","Dell","Universal","power rail BIST no LED flash motherboard dead",
     "Motherboard failure","Motherboard;Power rails",120,40.0,"Advanced"),
    ("laptop","Dell","Universal","no power at all Dell charger LED not on ring light off",
     "Power supply failure","Power adapter;Charger;DC jack",30,85.0,"Beginner"),

    # ── RAM / Memory ──────────────────────────────────────────────────────────
    ("laptop","Dell","Universal","2 blinks RAM not detected reseat memory module",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","Dell","Universal","Windows shows less RAM than installed memory slot bad",
     "RAM failure","RAM;RAM slot",15,90.0,"Beginner"),
    ("laptop","Dell","Universal","random blue screens different codes each time memory",
     "RAM failure","RAM;RAM slot",30,88.0,"Intermediate"),
    ("laptop","Dell","Universal","freezes at Dell logo splash screen RAM BIOS",
     "RAM failure","RAM;BIOS;RAM slot",30,85.0,"Intermediate"),
    ("laptop","Dell","Universal","memory error during Dell diagnostics F12 ePSA address failure",
     "RAM failure","RAM;Motherboard memory slot",45,80.0,"Intermediate"),
    ("laptop","Dell","Universal","laptop boots freezes under load heavy use RAM",
     "RAM failure","RAM;Cooling;RAM slot",45,82.0,"Intermediate"),

    # ── Storage (HDD / SSD) ───────────────────────────────────────────────────
    ("laptop","Dell","Universal","no boot device found black screen no OS",
     "Storage failure","HDD;SSD;SATA cable;BIOS boot order",60,85.0,"Intermediate"),
    ("laptop","Dell","Universal","SMART error on boot drive predicted to fail soon",
     "Storage failure","HDD;SSD",30,85.0,"Beginner"),
    ("laptop","Dell","Universal","Dell logo then black screen spinning dots forever loading",
     "Storage failure","HDD;SSD;OS;Dell diagnostics",90,78.0,"Intermediate"),
    ("laptop","Dell","Universal","clicking grinding noise hard drive mechanical failure",
     "Storage failure","HDD;SATA cable",60,85.0,"Intermediate"),
    ("laptop","Dell","Universal","NVMe SSD not detected Intel RST VMD RAID AHCI",
     "Storage failure","NVMe SSD;BIOS settings;Intel RST driver;M.2 slot",45,82.0,"Intermediate"),
    ("laptop","Dell","Universal","very slow boot 5 minutes startup too many items failing drive",
     "Storage failure","HDD;SSD;Startup items;SupportAssist",90,80.0,"Intermediate"),
    ("laptop","Dell","Universal","hard drive not installed error message BIOS",
     "Storage failure","HDD;SSD;SATA cable;Motherboard SATA port",60,82.0,"Intermediate"),
    ("laptop","Dell","Universal","PCIe SSD not detected NVMe missing error",
     "Storage failure","NVMe SSD;BIOS settings;M.2 slot",45,82.0,"Intermediate"),

    # ── Display & Graphics ────────────────────────────────────────────────────
    ("laptop","Dell","Universal","screen flickering LCD BIST hold D power button",
     "Display failure","LCD panel;LCD cable;GPU driver",45,85.0,"Intermediate"),
    ("laptop","Dell","Universal","vertical lines on screen press bezel lines change",
     "Display failure","LCD panel;LCD cable",60,85.0,"Intermediate"),
    ("laptop","Dell","Universal","screen pink green tint color issue external monitor test",
     "Display failure","LCD panel;GPU;Color profile",45,80.0,"Intermediate"),
    ("laptop","Dell","Universal","screen dim backlight failure faint image with flashlight",
     "Backlight failure","LCD panel;Backlight;Motherboard fuse",60,80.0,"Intermediate"),
    ("laptop","Dell","Universal","external monitor works internal screen black LCD BIST",
     "Display failure","LCD panel;LCD cable;Lid sensor",60,88.0,"Intermediate"),
    ("laptop","Dell","Universal","screen white spots pressure marks physical LCD damage",
     "Screen damage","LCD panel",45,90.0,"Intermediate"),
    ("laptop","Dell","Universal","screen goes black when moving lid opening closing XPS",
     "LCD cable failure","LCD cable;Hinge",45,90.0,"Intermediate"),
    ("laptop","Dell","Universal","8 blinks LCD failure BIOS detected display panel",
     "Display failure","LCD panel;LCD cable",60,88.0,"Intermediate"),
    ("laptop","Dell","Universal","screen cracked broken physically damaged display",
     "Screen damage","LCD panel",60,95.0,"Intermediate"),
    ("laptop","Dell","Universal","screen artifacts glitches random pixels GPU VRAM",
     "GPU failure","GPU;VRAM;GPU driver;Thermal paste",90,65.0,"Advanced"),

    # ── Battery & Charging ────────────────────────────────────────────────────
    ("laptop","Dell","Universal","plugged in not charging Dell charger center pin",
     "Battery failure","Battery;Charger;EC controller;Center pin",30,85.0,"Beginner"),
    ("laptop","Dell","Universal","unknown battery not detected no battery identified",
     "Battery failure","Battery;Battery connector;EC controller",30,85.0,"Beginner"),
    ("laptop","Dell","Universal","battery stops charging at 60 percent Dell Power Manager",
     "Battery failure","Battery;Dell Power Manager settings",15,95.0,"Beginner"),
    ("laptop","Dell","Universal","laptop only works plugged in battery completely dead",
     "Battery failure","Battery;Charging circuit;Motherboard",30,88.0,"Beginner"),
    ("laptop","Dell","Universal","swollen battery puffed up trackpad lifting bulging",
     "Battery failure","Battery",15,98.0,"Beginner"),
    ("laptop","Dell","Universal","charger LED blinks amber flashing power error",
     "Battery failure","Charger;Battery;EC controller",30,80.0,"Beginner"),
    ("laptop","Dell","Universal","BIOS shows battery health poor worn out",
     "Battery failure","Battery",15,95.0,"Beginner"),
    ("laptop","Dell","Universal","laptop shuts down at 30 percent battery dead cell calibration",
     "Battery failure","Battery;Battery calibration",15,90.0,"Beginner"),
    ("laptop","Dell","Universal","alert AC adapter wattage not recognized charger not Dell original",
     "Power supply failure","Charger;Power adapter;Center pin",15,95.0,"Beginner"),

    # ── Thermal & Fan ─────────────────────────────────────────────────────────
    ("laptop","Dell","Universal","fan always running loud constantly high speed dust",
     "Cooling system failure","Fan;Vents;Thermal paste;Malware",45,90.0,"Beginner"),
    ("laptop","Dell","Universal","fan rattling grinding noise worn bearing Latitude",
     "Cooling system failure","Fan",30,90.0,"Beginner"),
    ("laptop","Dell","Universal","laptop very hot fan never spins dead fan disconnected",
     "Cooling system failure","Fan;Fan connector",30,88.0,"Intermediate"),
    ("laptop","Dell","Universal","sudden shutdown during gaming video thermal trip overheating",
     "Cooling system failure","Fan;Heat sink;Thermal paste",45,90.0,"Intermediate"),
    ("laptop","Dell","Universal","thermal event in BIOS logs repeated overheating warning",
     "Cooling system failure","Fan;Heat sink;Thermal paste;BIOS logs",45,88.0,"Intermediate"),
    ("laptop","Dell","Universal","laptop throttles slow even when cool power limit dust heatsink",
     "Thermal throttling","Heat sink;Thermal paste;Fan;CPU",45,85.0,"Intermediate"),

    # ── Keyboard, Trackpad & Ports ────────────────────────────────────────────
    ("laptop","Dell","Universal","specific keys not working keyboard BIST Fn power",
     "Keyboard failure","Keyboard;Ribbon cable;Top cover",45,90.0,"Intermediate"),
    ("laptop","Dell","Universal","keyboard backlight not working Fn F10 Dell Quickset",
     "Keyboard failure","Keyboard;Dell Quickset driver",15,90.0,"Beginner"),
    ("laptop","Dell","Universal","trackpad not moving cursor disabled F3 Fn F3 cable",
     "Trackpad failure","Trackpad;Trackpad cable;Driver",30,88.0,"Beginner"),
    ("laptop","Dell","Universal","USB port not working dead port bent pins chipset driver",
     "USB failure","USB port;Chipset driver;Motherboard",30,85.0,"Beginner"),
    ("laptop","Dell","Universal","USB-C port not charging no display Thunderbolt firmware",
     "USB failure","USB-C port;Thunderbolt firmware;Motherboard",45,75.0,"Advanced"),
    ("laptop","Dell","Universal","headphone jack not working audio stuck sensor dirty",
     "Audio failure","Headphone jack;Audio sensor;Realtek driver",15,90.0,"Beginner"),

    # ── Audio ─────────────────────────────────────────────────────────────────
    ("laptop","Dell","Universal","no sound from speakers audio not working",
     "Audio failure","Speakers;Audio driver;Realtek",30,85.0,"Beginner"),
    ("laptop","Dell","Universal","crackling distorted sound audio quality bad Dell",
     "Audio failure","Speakers;Realtek driver;Audio enhancements",30,85.0,"Beginner"),
    ("laptop","Dell","Universal","microphone not working no mic input Dell",
     "Audio failure","Microphone;Privacy settings;Audio driver",15,90.0,"Beginner"),
    ("laptop","Dell","Universal","no audio output device installed error Dell",
     "Audio failure","Audio driver;Motherboard audio chip",30,75.0,"Intermediate"),

    # ── Wi-Fi, Bluetooth & Network ────────────────────────────────────────────
    ("laptop","Dell","Universal","wifi adapter not detected Fn PrtSc airplane mode driver",
     "Network failure","Wifi card;Driver;Airplane mode",30,85.0,"Intermediate"),
    ("laptop","Dell","Universal","wifi keeps disconnecting power management Intel Killer",
     "Network failure","Wifi driver;Power management",15,88.0,"Beginner"),
    ("laptop","Dell","Universal","bluetooth not working service not running driver Dell",
     "Network failure","Bluetooth driver;Bluetooth service;Wifi card",15,88.0,"Beginner"),
    ("laptop","Dell","Universal","Killer wifi slow laggy performance suite driver issue",
     "Network failure","Killer Wifi driver;Performance suite",15,88.0,"Beginner"),
    ("laptop","Dell","Universal","Ethernet port not working RJ45 driver bent pins",
     "Network failure","Ethernet port;Realtek driver;Bent pins",30,82.0,"Intermediate"),

    # ── BIOS & Firmware ───────────────────────────────────────────────────────
    ("laptop","Dell","Universal","BIOS update failed laptop won't boot Ctrl Esc recovery",
     "BIOS corruption","BIOS chip;USB BIOS_IMG.rcv recovery",60,70.0,"Advanced"),
    ("laptop","Dell","Universal","invalid configuration information CMOS settings lost",
     "CMOS battery failure","CMOS battery;BIOS settings",15,95.0,"Beginner"),
    ("laptop","Dell","Universal","secure boot prevents USB boot Secure Boot UEFI BIOS F2",
     "BIOS configuration","BIOS settings;Secure boot",15,95.0,"Beginner"),
    ("laptop","Dell","Universal","TPM not detected BitLocker recovery key Microsoft account",
     "BIOS configuration","TPM;BIOS settings;Microsoft account",30,88.0,"Intermediate"),
    ("laptop","Dell","Universal","time of day not set please run setup date time CMOS",
     "CMOS battery failure","CMOS battery",15,95.0,"Beginner"),
    ("laptop","Dell","Universal","strike F1 to retry boot F2 for setup no drive found",
     "Storage failure","HDD;SSD;Boot order;BIOS",45,82.0,"Intermediate"),
    ("laptop","Dell","Universal","alert TPM device not detected security chip",
     "BIOS configuration","TPM;BIOS Security settings",15,90.0,"Beginner"),

    # ── Physical & Liquid Damage ──────────────────────────────────────────────
    ("laptop","Dell","Universal","liquid spilled water damage Dell laptop",
     "Liquid damage","Motherboard;Keyboard;Battery;Isopropyl alcohol",120,60.0,"Advanced"),
    ("laptop","Dell","Universal","broken hinge cracked Inspiron 3000 5000 series lid",
     "Physical damage","Hinge assembly;LCD cable;Lid",60,85.0,"Intermediate"),
    ("laptop","Dell","Universal","cracked palmrest broken physical damage dropped",
     "Physical damage","Palmrest;Bottom cover;Screws",60,90.0,"Intermediate"),
    ("laptop","Dell","Universal","broken DC jack barrel connector loose charging port",
     "DC jack failure","DC jack;Motherboard",90,80.0,"Advanced"),
    ("laptop","Dell","Universal","USB-C port broken physically damaged bent pins Dell",
     "Physical damage","USB-C port;Motherboard",90,65.0,"Advanced"),
    ("laptop","Dell","Universal","laptop fell dropped won't turn on cracked motherboard",
     "Motherboard failure","Motherboard;RAM;SSD",120,50.0,"Advanced"),
]


def main():
    if not os.path.exists(CSV_PATH):
        print(f"ERROR: CSV not found at {CSV_PATH}")
        return

    with open(CSV_PATH, "r", encoding="utf-8") as f:
        existing = f.read()

    added = 0
    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for rec in DELL_RECORDS:
            if rec[3] in existing:
                continue
            writer.writerow(rec)
            added += 1

    print(f"Done. Added {added} Dell training records to {CSV_PATH}")


if __name__ == "__main__":
    main()
