"""
Script to append Acer universal fault training data to the existing CSV.
Covers Predator, Nitro, Aspire, Swift, Spin, TravelMate, ConceptD.
Run once: python add_acer_training_data.py
"""
import csv
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "raw", "comprehensive_training_data_fixed.csv")

ACER_RECORDS = [
    # ── Beep Codes (Primary Diagnostic) ──────────────────────────────────────
    ("laptop","Acer","Universal","1 beep pause 1 beep 1-1 CMOS battery failure RTC Acer",
     "CMOS battery failure","CMOS battery;RTC circuit",15,95.0,"Beginner"),
    ("laptop","Acer","Universal","1 beep pause 2 beeps 1-2 motherboard chipset failure Acer",
     "Motherboard failure","Motherboard;Chipset",120,45.0,"Advanced"),
    ("laptop","Acer","Universal","1 beep pause 3 beeps 1-3 RAM failure first bank Acer memory",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","Acer","Universal","1 beep pause 4 beeps 1-4 RAM failure second bank slot Acer",
     "RAM failure","RAM;RAM slot",30,88.0,"Beginner"),
    ("laptop","Acer","Universal","1 beep pause 5 beeps 1-5 real time clock RTC failure Acer",
     "CMOS battery failure","CMOS battery;RTC circuit;Motherboard",15,90.0,"Beginner"),
    ("laptop","Acer","Universal","1 beep pause 6 beeps 1-6 video GPU graphics failure Acer",
     "GPU failure","GPU;LCD panel;Motherboard",120,50.0,"Advanced"),
    ("laptop","Acer","Universal","1 beep pause 7 beeps 1-7 CPU processor failure Acer soldered",
     "CPU failure","CPU;Motherboard",120,40.0,"Advanced"),
    ("laptop","Acer","Universal","2 beeps RAM not detected Acer memory reseat",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","Acer","Universal","3 beeps motherboard critical failure Acer system board",
     "Motherboard failure","Motherboard",120,45.0,"Advanced"),
    ("laptop","Acer","Universal","4 beeps timer counter failure Acer motherboard chipset",
     "Motherboard failure","Motherboard;Chipset",120,45.0,"Advanced"),
    ("laptop","Acer","Universal","5 beeps CPU failure Acer processor motherboard",
     "CPU failure","CPU;Motherboard",120,40.0,"Advanced"),
    ("laptop","Acer","Universal","6 beeps keyboard controller failure Acer EC keyboard",
     "Keyboard failure","EC controller;Keyboard;Motherboard",60,65.0,"Advanced"),
    ("laptop","Acer","Universal","7 beeps CPU exception error Acer overheating thermal",
     "Cooling system failure","Fan;Heat sink;Thermal paste;CPU",45,80.0,"Intermediate"),
    ("laptop","Acer","Universal","8 beeps LCD display failure Acer panel cable",
     "Display failure","LCD panel;LCD cable",60,88.0,"Intermediate"),
    ("laptop","Acer","Universal","9 beeps BIOS corruption Acer recovery needed Fn Esc",
     "BIOS corruption","BIOS chip;USB recovery;Fn+Esc",60,70.0,"Advanced"),
    ("laptop","Acer","Universal","10 beeps CMOS shutdown Acer battery motherboard",
     "CMOS battery failure","CMOS battery;Motherboard",15,85.0,"Intermediate"),
    ("laptop","Acer","Universal","continuous short beeps power rail short Acer motherboard voltage",
     "Motherboard failure","Motherboard;Voltage regulator",120,40.0,"Advanced"),

    # ── Power LED Behavior ────────────────────────────────────────────────────
    ("laptop","Acer","Universal","Acer power LED on no fan no display motherboard dead EC frozen",
     "Motherboard failure","Motherboard;EC firmware",90,55.0,"Advanced"),
    ("laptop","Acer","Universal","Acer power LED on fan spins black screen no beeps RAM GPU BIOS",
     "RAM failure","RAM;GPU;BIOS;LCD",60,78.0,"Intermediate"),
    ("laptop","Acer","Universal","Acer power LED blinks fast 3 times per second power delivery failure",
     "Power supply failure","Charger;DC jack;Motherboard",45,75.0,"Intermediate"),
    ("laptop","Acer","Universal","Acer power LED turns on then immediately off short circuit",
     "Motherboard failure","Motherboard;Short circuit;Peripherals",90,55.0,"Advanced"),

    # ── Power-On Failures ─────────────────────────────────────────────────────
    ("laptop","Acer","Universal","absolutely dead no lights no fan no beeps Acer dead",
     "Power supply failure","Power adapter;DC jack;Battery;EC firmware",60,75.0,"Intermediate"),
    ("laptop","Acer","Universal","Acer turns on shuts off after 2 to 3 seconds short circuit VRM",
     "Motherboard failure","Motherboard;VRM;CPU;RAM;SSD",90,55.0,"Advanced"),
    ("laptop","Acer","Universal","boot loop Acer turns on off repeatedly corrupt BIOS power IC",
     "BIOS corruption","BIOS;Power IC;Motherboard",60,65.0,"Advanced"),
    ("laptop","Acer","Universal","Acer logo then black screen corrupt OS drive driver Safe Mode",
     "Boot failure","OS;HDD;SSD;Drivers;Alt+F10 recovery",60,80.0,"Intermediate"),
    ("laptop","Acer","Universal","no bootable device black screen Acer HDD SSD F2 BIOS",
     "Storage failure","HDD;SSD;BIOS boot order",60,85.0,"Intermediate"),
    ("laptop","Acer","Universal","Acer hard reset disconnect battery AC hold power 30 seconds",
     "Power supply failure","EC firmware;Battery;Charger",30,80.0,"Beginner"),
    ("laptop","Acer","Universal","Acer press F2 BIOS stuck corruption keyboard issue recovery",
     "BIOS corruption","BIOS;Keyboard;Fn+Esc recovery",45,70.0,"Advanced"),

    # ── Acer Care Center Battery Health (Key Feature) ────────────────────────
    ("laptop","Acer","Universal","Acer battery won't charge past 80 percent Acer Care Center Battery Health feature",
     "Battery failure","Battery;Acer Care Center;Battery Health;Full charge",15,99.0,"Beginner"),
    ("laptop","Acer","Universal","Acer battery charging limit 80% stops not a bug Acer Care Center feature",
     "Battery failure","Battery;Acer Care Center;Charging Limit",15,99.0,"Beginner"),
    ("laptop","Acer","Universal","plugged in not charging Acer Care Center battery health 80 limit disable",
     "Battery failure","Battery;Acer Care Center Battery Health",15,98.0,"Beginner"),

    # ── Battery & Charging ────────────────────────────────────────────────────
    ("laptop","Acer","Universal","Acer battery not detected Windows EC frozen hard reset 30 sec",
     "Battery failure","Battery;Battery connector;EC controller",30,85.0,"Beginner"),
    ("laptop","Acer","Universal","swollen battery Acer puffed up trackpad bulging case fire hazard",
     "Battery failure","Battery",15,98.0,"Beginner"),
    ("laptop","Acer","Universal","Acer only works plugged in battery dead completely",
     "Battery failure","Battery;Charging circuit;Motherboard",30,88.0,"Beginner"),
    ("laptop","Acer","Universal","Acer battery drains fast 30 minutes worn Acer Care Center health",
     "Battery failure","Battery;Acer Care Center Battery Health",15,95.0,"Beginner"),
    ("laptop","Acer","Universal","Acer charger LED off dead charger bad DC jack 19V barrel",
     "Power supply failure","Charger;DC jack;Power adapter",30,85.0,"Beginner"),
    ("laptop","Acer","Universal","Acer shuts down 20 30 percent battery calibration dead cell",
     "Battery failure","Battery;Battery calibration;Acer Care Center",15,90.0,"Beginner"),
    ("laptop","Acer","Universal","CMOS Battery Low message Acer CR2032 replace",
     "CMOS battery failure","CMOS battery",15,95.0,"Beginner"),
    ("laptop","Acer","Universal","battery cannot be identified Acer communication failure connector",
     "Battery failure","Battery;Battery connector",15,90.0,"Beginner"),
    ("laptop","Acer","Universal","1-1 beeps Acer CMOS battery failure RTC CR2032",
     "CMOS battery failure","CMOS battery",15,95.0,"Beginner"),

    # ── RAM / Memory ──────────────────────────────────────────────────────────
    ("laptop","Acer","Universal","1-3 beeps RAM failure first bank Acer Aspire reseat",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","Acer","Universal","1-4 beeps RAM failure second bank slot Acer test",
     "RAM failure","RAM;RAM slot",30,88.0,"Beginner"),
    ("laptop","Acer","Universal","2 beeps RAM not detected Acer reseat clean contacts",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","Acer","Universal","Windows shows less RAM Acer slot bad 32-bit OS",
     "RAM failure","RAM;RAM slot",15,90.0,"Beginner"),
    ("laptop","Acer","Universal","random blue screens different codes Acer intermittent RAM",
     "RAM failure","RAM;RAM slot",30,88.0,"Intermediate"),
    ("laptop","Acer","Universal","freezes at Acer logo splash screen RAM BIOS",
     "RAM failure","RAM;BIOS;RAM slot",30,85.0,"Intermediate"),
    ("laptop","Acer","Universal","soldered RAM failure Acer Swift Spin motherboard replacement",
     "RAM failure","Motherboard;Soldered RAM",120,45.0,"Advanced"),
    ("laptop","Acer","Universal","laptop boots freezes under load Acer RAM memory diagnostic",
     "RAM failure","RAM;Cooling;RAM slot",45,82.0,"Intermediate"),

    # ── Storage (HDD / SSD) ───────────────────────────────────────────────────
    ("laptop","Acer","Universal","no bootable device found Acer F2 BIOS drive not detected",
     "Storage failure","HDD;SSD;BIOS boot order;SATA cable",60,85.0,"Intermediate"),
    ("laptop","Acer","Universal","operating system not found Acer corrupt bootloader boot order",
     "Boot failure","OS;Bootloader;HDD;BIOS",60,85.0,"Intermediate"),
    ("laptop","Acer","Universal","clicking grinding noise hard drive Acer mechanical failure",
     "Storage failure","HDD;SATA cable",60,85.0,"Intermediate"),
    ("laptop","Acer","Universal","very slow boot 5 minutes Acer CHKDSK SMART replace SSD",
     "Storage failure","HDD;SSD;Startup items;SMART",90,80.0,"Intermediate"),
    ("laptop","Acer","Universal","NVMe SSD not detected Acer Intel RST RAID AHCI SATA mode F2",
     "Storage failure","NVMe SSD;BIOS SATA mode;Intel RST;M.2 slot",45,82.0,"Intermediate"),
    ("laptop","Acer","Universal","SMART error on boot Acer drive predicted to fail backup",
     "Storage failure","HDD;SSD",30,85.0,"Beginner"),
    ("laptop","Acer","Universal","Acer logo spinning dots forever failing drive OS Alt F10",
     "Storage failure","HDD;SSD;OS;Acer Recovery Management",90,78.0,"Intermediate"),
    ("laptop","Acer","Universal","SSD detected BIOS not Windows Acer driver partition diskpart",
     "Storage failure","SSD;Driver;Partition;diskpart",45,78.0,"Intermediate"),

    # ── Display & Graphics ────────────────────────────────────────────────────
    ("laptop","Acer","Universal","screen flickering Acer Swift driver refresh rate Intel AMD NVIDIA",
     "Display failure","LCD panel;GPU driver;Refresh rate",45,85.0,"Intermediate"),
    ("laptop","Acer","Universal","vertical horizontal lines screen Acer press bezel cable LCD",
     "Display failure","LCD panel;LCD cable",60,85.0,"Intermediate"),
    ("laptop","Acer","Universal","screen dim backlight failure Acer flashlight image visible",
     "Backlight failure","LCD panel;Backlight;Logic board",60,80.0,"Intermediate"),
    ("laptop","Acer","Universal","external monitor works internal screen black Acer LCD cable lid",
     "Display failure","LCD panel;LCD cable;Lid sensor",60,88.0,"Intermediate"),
    ("laptop","Acer","Universal","touchscreen not working Acer Spin Aspire R driver cable digitizer",
     "Trackpad failure","Touch driver;Touch cable;Digitizer",30,85.0,"Intermediate"),
    ("laptop","Acer","Universal","screen white spots pressure marks physical damage Acer",
     "Screen damage","LCD panel",45,90.0,"Intermediate"),
    ("laptop","Acer","Universal","screen goes black moving lid hinge LCD cable Aspire Acer",
     "LCD cable failure","LCD cable;Hinge",45,90.0,"Intermediate"),
    ("laptop","Acer","Universal","8 beeps LCD failure Acer display panel cable",
     "Display failure","LCD panel;LCD cable",60,88.0,"Intermediate"),
    ("laptop","Acer","Universal","1-6 beeps GPU failure Acer external monitor test",
     "GPU failure","GPU;LCD panel;Motherboard",90,60.0,"Advanced"),
    ("laptop","Acer","Universal","screen yellow pink tint Acer color profile failing LCD calibrate",
     "Display failure","LCD panel;Color profile;Display calibration",30,80.0,"Intermediate"),
    ("laptop","Acer","Universal","screen cracked Acer Aspire Swift replace LCD panel",
     "Screen damage","LCD panel",60,95.0,"Intermediate"),

    # ── Thermal & Fan (Critical for Predator/Nitro) ───────────────────────────
    ("laptop","Acer","Universal","fans loud constantly Acer dust CPU usage PredatorSense NitroSense",
     "Cooling system failure","Fan;Vents;Thermal paste;PredatorSense;NitroSense",45,90.0,"Beginner"),
    ("laptop","Acer","Universal","fan rattling grinding noise Acer Nitro worn bearing replace",
     "Cooling system failure","Fan",30,90.0,"Beginner"),
    ("laptop","Acer","Universal","Acer hot fan never spins dead fan PredatorSense NitroSense curve",
     "Cooling system failure","Fan;Fan connector;Fan curve",30,88.0,"Intermediate"),
    ("laptop","Acer","Universal","sudden shutdown gaming Predator Nitro thermal trip CPU GPU",
     "Cooling system failure","Fan;Heat sink;Thermal paste",45,90.0,"Intermediate"),
    ("laptop","Acer","Universal","thermal error boot Acer overheating detected clean cooling",
     "Cooling system failure","Fan;Heat sink;Thermal paste",45,88.0,"Intermediate"),
    ("laptop","Acer","Universal","laptop throttles low FPS Acer Predator Nitro power limit thermal",
     "Thermal throttling","CPU;Thermal paste;Fan;ThrottleStop",45,85.0,"Intermediate"),
    ("laptop","Acer","Universal","one fan spins other doesn't Acer Predator 15 17 dead fan",
     "Cooling system failure","Fan;Fan debris",30,90.0,"Beginner"),
    ("laptop","Acer","Universal","7 beeps CPU exception overheating Acer clean cooling repaste",
     "Cooling system failure","Fan;Heat sink;Thermal paste;CPU",45,88.0,"Intermediate"),
    ("laptop","Acer","Universal","CPU fan error Acer Predator Nitro fan not spinning won't boot",
     "Cooling system failure","Fan;Fan connector",30,90.0,"Beginner"),

    # ── Keyboard, Trackpad & Ports ────────────────────────────────────────────
    ("laptop","Acer","Universal","specific keys not working Acer liquid debris keyboard",
     "Keyboard failure","Keyboard;Ribbon cable;Top cover",45,90.0,"Intermediate"),
    ("laptop","Acer","Universal","keyboard backlight not working Acer Fn F8 F9 Aspire Predator",
     "Keyboard failure","Keyboard;Keyboard backlight;Fn key",15,90.0,"Beginner"),
    ("laptop","Acer","Universal","trackpad not responding Acer disabled Fn F7 driver Aspire Swift",
     "Trackpad failure","Trackpad;Trackpad cable;Driver;Fn key",30,88.0,"Beginner"),
    ("laptop","Acer","Universal","trackpad buttons stuck Acer swollen battery physical damage",
     "Trackpad failure","Trackpad;Battery;Palmrest",30,85.0,"Beginner"),
    ("laptop","Acer","Universal","6 beeps keyboard controller failure Acer EC reseat cable",
     "Keyboard failure","EC controller;Keyboard;Ribbon cable",60,65.0,"Advanced"),
    ("laptop","Acer","Universal","USB port not working Acer chipset driver dead port",
     "USB failure","USB port;Chipset driver;Motherboard",30,85.0,"Beginner"),
    ("laptop","Acer","Universal","USB-C port not charging display Acer Swift firmware update",
     "USB failure","USB-C port;USB-C firmware;Motherboard",45,75.0,"Advanced"),
    ("laptop","Acer","Universal","headphone jack not working Acer dirty jack Realtek driver",
     "Audio failure","Headphone jack;Realtek driver;Audio board",15,90.0,"Beginner"),

    # ── Audio ─────────────────────────────────────────────────────────────────
    ("laptop","Acer","Universal","no sound speakers Acer audio not working Realtek driver",
     "Audio failure","Speakers;Audio driver;Realtek",30,85.0,"Beginner"),
    ("laptop","Acer","Universal","crackling distorted sound Acer Realtek driver audio enhancements",
     "Audio failure","Speakers;Realtek driver;Audio enhancements",30,85.0,"Beginner"),
    ("laptop","Acer","Universal","microphone not working Acer privacy settings driver",
     "Audio failure","Microphone;Privacy settings;Audio driver",15,90.0,"Beginner"),
    ("laptop","Acer","Universal","no audio output device installed Acer Realtek reinstall",
     "Audio failure","Audio driver;Realtek;Motherboard audio chip",30,78.0,"Intermediate"),

    # ── Wi-Fi, Bluetooth & Network ────────────────────────────────────────────
    ("laptop","Acer","Universal","wifi adapter not detected Acer Fn F3 airplane mode driver Qualcomm",
     "Network failure","Wifi card;Driver;Airplane mode;Qualcomm;Realtek",30,85.0,"Intermediate"),
    ("laptop","Acer","Universal","wifi keeps disconnecting Acer power management driver Realtek",
     "Network failure","Wifi driver;Power management",15,88.0,"Beginner"),
    ("laptop","Acer","Universal","bluetooth not working Acer service driver card",
     "Network failure","Bluetooth driver;Bluetooth service",15,88.0,"Beginner"),
    ("laptop","Acer","Universal","slow wifi Acer budget Realtek Qualcomm driver update Intel AX210",
     "Network failure","Realtek Wifi;Qualcomm Wifi;Driver;Intel AX210 upgrade",15,88.0,"Beginner"),
    ("laptop","Acer","Universal","Killer wifi Predator driver suite problems uninstall reinstall",
     "Network failure","Killer Wifi driver;Killer Performance Suite",15,88.0,"Beginner"),
    ("laptop","Acer","Universal","Ethernet port not working Acer Realtek driver bent pins",
     "Network failure","Ethernet port;Realtek driver;Bent pins",30,82.0,"Intermediate"),

    # ── BIOS & Firmware (Fn+Esc Recovery) ─────────────────────────────────────
    ("laptop","Acer","Universal","BIOS update failed Acer Fn Esc recovery BIOS file FAT32 USB",
     "BIOS corruption","BIOS;USB recovery;Fn+Esc;FAT32",60,70.0,"Advanced"),
    ("laptop","Acer","Universal","9 beeps BIOS corruption Acer recovery Fn Esc power BIOS file",
     "BIOS corruption","BIOS;USB recovery;Fn+Esc",60,70.0,"Advanced"),
    ("laptop","Acer","Universal","Secure Boot violation Acer F2 BIOS disable Secure Boot",
     "BIOS configuration","BIOS settings;Secure Boot",15,95.0,"Beginner"),
    ("laptop","Acer","Universal","real time clock error 1-5 beeps Acer CMOS battery CR2032",
     "CMOS battery failure","CMOS battery;RTC circuit",15,95.0,"Beginner"),
    ("laptop","Acer","Universal","TPM not detected Acer BitLocker key Microsoft account BIOS",
     "BIOS configuration","TPM;BIOS settings;Microsoft account",30,88.0,"Intermediate"),
    ("laptop","Acer","Universal","invalid system disk Acer boot order wrong drive failing F2",
     "Storage failure","HDD;SSD;Boot order;BIOS",45,82.0,"Intermediate"),
    ("laptop","Acer","Universal","Alt F10 Acer factory recovery management boot restore",
     "Software issue","OS;Acer Recovery Management;Factory reset",30,85.0,"Beginner"),

    # ── Predator / Nitro Gaming ───────────────────────────────────────────────
    ("laptop","Acer","Universal","low FPS games Predator Nitro thermal throttle driver PredatorSense Turbo",
     "Thermal throttling","CPU;GPU;Thermal paste;PredatorSense;GPU driver",45,85.0,"Intermediate"),
    ("laptop","Acer","Universal","RGB lighting not working Predator PredatorSense crash service",
     "Keyboard failure","PredatorSense;RGB LEDs;EC firmware",30,85.0,"Beginner"),
    ("laptop","Acer","Universal","screen flickering games Predator GSync FreeSync NVIDIA driver",
     "Display failure","GSync;FreeSync;NVIDIA driver;LCD panel",30,82.0,"Intermediate"),
    ("laptop","Acer","Universal","Predator shuts down gaming overheating adapter too weak 180W 230W",
     "Cooling system failure","Fan;Thermal paste;Charger wattage;Heat sink",45,85.0,"Intermediate"),
    ("laptop","Acer","Universal","GPU not detected Predator Nitro Device Manager DDU reinstall driver",
     "GPU failure","GPU;GPU driver;DDU;Motherboard",60,70.0,"Advanced"),
    ("laptop","Acer","Universal","Turbo mode not working PredatorSense NitroSense EC firmware update",
     "Software issue","PredatorSense;NitroSense;EC firmware",15,88.0,"Beginner"),
    ("laptop","Acer","Universal","Nitro fan always 100 percent dust fan curve failed sensor",
     "Cooling system failure","Fan;Fan curve;Temperature sensor",30,88.0,"Beginner"),
    ("laptop","Acer","Universal","Predator needs 180W 230W charger slow wrong adapter gaming",
     "Power supply failure","Charger;Power adapter wattage;Predator",15,95.0,"Beginner"),

    # ── Aspire Hinge Failure (Extremely Common) ───────────────────────────────
    ("laptop","Acer","Universal","broken hinge Aspire Acer very common plastic cracked lid won't stay",
     "Physical damage","Hinge assembly;Lid assembly;Back cover",60,85.0,"Intermediate"),
    ("laptop","Acer","Universal","Aspire lid loose hinge cracked plastic mount open from center",
     "Physical damage","Hinge assembly;Back cover;Bottom case",60,85.0,"Intermediate"),
    ("laptop","Acer","Universal","Acer bottom case cracked near hinge screw mount Aspire stress",
     "Physical damage","Bottom cover;Hinge;Screw mounts",45,85.0,"Beginner"),

    # ── Swift / Spin Specific ─────────────────────────────────────────────────
    ("laptop","Acer","Universal","Acer Swift screen flicker OLED driver refresh rate update",
     "Display failure","OLED panel;GPU driver;Refresh rate",30,85.0,"Beginner"),
    ("laptop","Acer","Universal","Acer Swift battery swelling thin chassis heat",
     "Battery failure","Battery",15,98.0,"Beginner"),
    ("laptop","Acer","Universal","Acer Swift USB-C port loose not working firmware update replace",
     "USB failure","USB-C port;USB-C firmware;Microsoldering",45,75.0,"Advanced"),
    ("laptop","Acer","Universal","Acer Spin hinge failure 360 degree convertible stress replace",
     "Physical damage","Hinge assembly;Lid assembly",60,85.0,"Intermediate"),
    ("laptop","Acer","Universal","Acer Spin touchscreen not working driver cable digitizer",
     "Trackpad failure","Touch driver;Touch cable;Digitizer",30,85.0,"Intermediate"),
    ("laptop","Acer","Universal","Acer Spin screen rotation not working driver Intel sensor",
     "Software issue","Intel Sensor driver;Windows calibration;Touch driver",15,90.0,"Beginner"),
    ("laptop","Acer","Universal","Acer Spin pen stylus not working battery dead pairing Bluetooth",
     "Software issue","Pen battery;Bluetooth pairing;Stylus",15,90.0,"Beginner"),

    # ── TravelMate Business ───────────────────────────────────────────────────
    ("laptop","Acer","Universal","Acer TravelMate docking station not working driver firmware connector",
     "USB failure","Docking station;Driver;Firmware;Connector pins",45,80.0,"Intermediate"),
    ("laptop","Acer","Universal","Acer TravelMate fingerprint reader not working Windows Hello driver",
     "Software issue","Fingerprint reader;Windows Hello;Driver",15,90.0,"Beginner"),
    ("laptop","Acer","Universal","Acer TravelMate battery drains overnight wake on LAN USB charging",
     "Battery failure","Wake on LAN;USB charging;Power settings",15,90.0,"Beginner"),

    # ── Physical & Liquid Damage ──────────────────────────────────────────────
    ("laptop","Acer","Universal","liquid spilled Acer no drain holes upside down battery isopropyl",
     "Liquid damage","Motherboard;Keyboard;Battery;Isopropyl alcohol",120,60.0,"Advanced"),
    ("laptop","Acer","Universal","broken hinge Nitro Acer metal hinge lid assembly replace",
     "Physical damage","Hinge assembly;Lid assembly",60,85.0,"Intermediate"),
    ("laptop","Acer","Universal","cracked palmrest Acer Aspire dropped bottom cover replace",
     "Physical damage","Palmrest;Bottom cover;Screws",60,90.0,"Intermediate"),
    ("laptop","Acer","Universal","broken DC jack Aspire Acer barrel connector common loose desolder",
     "DC jack failure","DC jack;Motherboard",90,80.0,"Advanced"),
    ("laptop","Acer","Universal","broken USB-C port Acer Swift physical damage microsoldering",
     "Physical damage","USB-C port;Motherboard",90,65.0,"Advanced"),
    ("laptop","Acer","Universal","laptop fell dropped Acer won't turn on cracked motherboard",
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
        for rec in ACER_RECORDS:
            if rec[3] in existing:
                continue
            writer.writerow(rec)
            added += 1

    print(f"Done. Added {added} Acer training records to {CSV_PATH}")


if __name__ == "__main__":
    main()
