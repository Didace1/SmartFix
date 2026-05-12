"""
Script to append ASUS universal fault training data to the existing CSV.
Covers ROG, TUF, ZenBook, Vivobook, ProArt, ExpertBook.
Run once: python add_asus_training_data.py
"""
import csv
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "raw", "comprehensive_training_data_fixed.csv")

ASUS_RECORDS = [
    # ── Power LED Blink Codes ─────────────────────────────────────────────────
    ("laptop","ASUS","Universal","power LED 1 blink CPU processor failure ASUS soldered",
     "CPU failure","CPU;Motherboard",120,40.0,"Advanced"),
    ("laptop","ASUS","Universal","power LED 2 blinks RAM not detected memory ASUS",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","ASUS","Universal","power LED 3 blinks motherboard chipset failure ASUS",
     "Motherboard failure","Motherboard;Chipset",120,45.0,"Advanced"),
    ("laptop","ASUS","Universal","power LED 4 blinks all RAM sticks failed memory subsystem ASUS",
     "RAM failure","RAM;Motherboard",30,80.0,"Intermediate"),
    ("laptop","ASUS","Universal","power LED 5 blinks CMOS battery RTC failure ASUS",
     "CMOS battery failure","CMOS battery;RTC circuit",15,95.0,"Beginner"),
    ("laptop","ASUS","Universal","power LED 6 blinks video GPU graphics failure ASUS",
     "GPU failure","GPU;LCD panel;Motherboard",120,50.0,"Advanced"),
    ("laptop","ASUS","Universal","power LED 7 blinks CPU thermal shutdown overheating ASUS",
     "Cooling system failure","Fan;Heat sink;Thermal paste",45,90.0,"Intermediate"),
    ("laptop","ASUS","Universal","power LED 8 blinks LCD display failure panel cable ASUS",
     "Display failure","LCD panel;LCD cable",60,88.0,"Intermediate"),
    ("laptop","ASUS","Universal","power LED continuous fast blink power rail short voltage regulator",
     "Motherboard failure","Motherboard;Voltage regulator",120,40.0,"Advanced"),

    # ── Beep Codes ────────────────────────────────────────────────────────────
    ("laptop","ASUS","Universal","1 beep pause 2 beeps RAM not detected ASUS memory",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","ASUS","Universal","1 beep pause 3 beeps RAM failure read write error ASUS",
     "RAM failure","RAM;RAM slot",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","1 beep pause 4 beeps battery critically low ASUS",
     "Battery failure","Battery;Charger",15,95.0,"Beginner"),
    ("laptop","ASUS","Universal","2 beeps CMOS battery error ASUS",
     "CMOS battery failure","CMOS battery",15,95.0,"Beginner"),
    ("laptop","ASUS","Universal","3 beeps motherboard chipset failure ASUS",
     "Motherboard failure","Motherboard;Chipset",120,45.0,"Advanced"),
    ("laptop","ASUS","Universal","5 beeps CPU failure ASUS processor",
     "CPU failure","CPU;Motherboard",120,40.0,"Advanced"),
    ("laptop","ASUS","Universal","6 beeps video GPU graphics failure ASUS",
     "GPU failure","GPU;Motherboard",120,50.0,"Advanced"),
    ("laptop","ASUS","Universal","7 beeps CPU thermal shutdown cooling ASUS",
     "Cooling system failure","Fan;Heat sink;Thermal paste",45,90.0,"Intermediate"),
    ("laptop","ASUS","Universal","8 beeps LCD display failure ASUS panel cable",
     "Display failure","LCD panel;LCD cable",60,88.0,"Intermediate"),
    ("laptop","ASUS","Universal","continuous short beeps power rail short ASUS motherboard",
     "Motherboard failure","Motherboard;Power rail",120,40.0,"Advanced"),

    # ── Power-On Failures ─────────────────────────────────────────────────────
    ("laptop","ASUS","Universal","absolutely dead no lights no fan no power ASUS",
     "Power supply failure","Power adapter;DC jack;Battery;EC firmware",60,75.0,"Intermediate"),
    ("laptop","ASUS","Universal","power LED on screen black no logo RAM BIOS GPU ASUS",
     "RAM failure","RAM;BIOS;GPU;LCD",60,78.0,"Intermediate"),
    ("laptop","ASUS","Universal","ASUS turns on fans spin screen black no display",
     "RAM failure","RAM;LCD;GPU;BIOS",60,78.0,"Intermediate"),
    ("laptop","ASUS","Universal","ASUS powers on shuts off 2 to 5 seconds short circuit VRM",
     "Motherboard failure","Motherboard;VRM;CPU",90,55.0,"Advanced"),
    ("laptop","ASUS","Universal","boot loop ASUS turns on off repeatedly corrupt BIOS",
     "BIOS corruption","BIOS;Power IC;Motherboard",60,65.0,"Advanced"),
    ("laptop","ASUS","Universal","ASUS logo appears then black screen corrupt OS drive",
     "Boot failure","OS;HDD;SSD;Drivers",60,80.0,"Intermediate"),
    ("laptop","ASUS","Universal","ASUS hard reset disconnect battery AC hold power 40 seconds",
     "Power supply failure","EC firmware;Battery;Charger",30,80.0,"Beginner"),

    # ── MyASUS Battery Health Charging (Key ASUS Feature) ────────────────────
    ("laptop","ASUS","Universal","ASUS battery won't charge past 60 percent MyASUS Battery Health Charging Maximum Lifespan Mode",
     "Battery failure","Battery;MyASUS Battery Health Charging;Full Capacity Mode",15,99.0,"Beginner"),
    ("laptop","ASUS","Universal","ASUS battery stops at 80 percent plugged in not charging Balanced Mode",
     "Battery failure","Battery;MyASUS;Balanced Mode;Full Capacity Mode",15,99.0,"Beginner"),
    ("laptop","ASUS","Universal","plugged in not charging ASUS MyASUS battery health feature 60 80",
     "Battery failure","Battery;MyASUS Battery Health Charging",15,98.0,"Beginner"),

    # ── Battery & Charging ────────────────────────────────────────────────────
    ("laptop","ASUS","Universal","ASUS battery not detected Windows EC frozen hard reset",
     "Battery failure","Battery;Battery connector;EC controller",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","swollen battery ASUS puffed up trackpad bulging case fire hazard",
     "Battery failure","Battery",15,98.0,"Beginner"),
    ("laptop","ASUS","Universal","ASUS laptop only works plugged in battery completely dead",
     "Battery failure","Battery;Charging circuit;Motherboard",30,88.0,"Beginner"),
    ("laptop","ASUS","Universal","ASUS battery drains fast 30 minutes worn MyASUS health check",
     "Battery failure","Battery;MyASUS Battery Health",15,95.0,"Beginner"),
    ("laptop","ASUS","Universal","ASUS charger LED off dead charger bad DC jack 19V barrel USB-C",
     "Power supply failure","Charger;DC jack;Power adapter",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","ASUS laptop shuts down 20 30 percent battery calibration dead cell",
     "Battery failure","Battery;Battery calibration",15,90.0,"Beginner"),
    ("laptop","ASUS","Universal","AC adapter wattage not recognized ASUS wrong charger",
     "Power supply failure","Charger;Power adapter;Wattage",15,95.0,"Beginner"),
    ("laptop","ASUS","Universal","battery cannot be identified ASUS communication failure connector",
     "Battery failure","Battery;Battery connector",15,90.0,"Beginner"),

    # ── RAM / Memory ──────────────────────────────────────────────────────────
    ("laptop","ASUS","Universal","2 blinks ASUS RAM not detected reseat memory",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","ASUS","Universal","Windows shows less RAM than installed ASUS slot bad",
     "RAM failure","RAM;RAM slot",15,90.0,"Beginner"),
    ("laptop","ASUS","Universal","random blue screens different error codes ASUS memory",
     "RAM failure","RAM;RAM slot",30,88.0,"Intermediate"),
    ("laptop","ASUS","Universal","freezes at ASUS logo splash screen RAM BIOS",
     "RAM failure","RAM;BIOS;RAM slot",30,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","soldered RAM failure ZenBook Vivobook motherboard replacement",
     "RAM failure","Motherboard;Soldered RAM",120,45.0,"Advanced"),
    ("laptop","ASUS","Universal","laptop boots freezes heavy load RAM ASUS MyASUS diagnostics",
     "RAM failure","RAM;Cooling;RAM slot",45,82.0,"Intermediate"),

    # ── Storage (HDD / SSD) ───────────────────────────────────────────────────
    ("laptop","ASUS","Universal","no bootable device found ASUS black screen no OS F2 BIOS",
     "Storage failure","HDD;SSD;BIOS boot order",60,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","operating system not found ASUS corrupt bootloader boot order",
     "Boot failure","OS;Bootloader;HDD;BIOS",60,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","clicking grinding noise hard drive ASUS mechanical failure",
     "Storage failure","HDD;SATA cable",60,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","very slow boot ASUS MyASUS hardware diagnostics storage test",
     "Storage failure","HDD;SSD;Startup items",90,80.0,"Intermediate"),
    ("laptop","ASUS","Universal","NVMe SSD not detected ASUS Intel RST RAID AHCI SATA mode",
     "Storage failure","NVMe SSD;BIOS SATA mode;Intel RST;M.2 slot",45,82.0,"Intermediate"),
    ("laptop","ASUS","Universal","SMART error on boot ASUS drive predicted to fail",
     "Storage failure","HDD;SSD",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","SSD detected BIOS not Windows ASUS driver partition corrupt",
     "Storage failure","SSD;Driver;Partition;diskpart",45,78.0,"Intermediate"),
    ("laptop","ASUS","Universal","invalid system disk ASUS boot order wrong drive failing",
     "Storage failure","HDD;SSD;Boot order;BIOS",45,82.0,"Intermediate"),

    # ── Display & Graphics ────────────────────────────────────────────────────
    ("laptop","ASUS","Universal","screen flickering ASUS ZenBook OLED refresh rate driver",
     "Display failure","LCD panel;GPU driver;Refresh rate",45,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","vertical horizontal lines screen ASUS press bezel cable",
     "Display failure","LCD panel;LCD cable",60,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","screen dim backlight failure ASUS MyASUS LCD test flashlight",
     "Backlight failure","LCD panel;Backlight;Logic board",60,80.0,"Intermediate"),
    ("laptop","ASUS","Universal","external monitor works internal screen black ASUS LCD cable",
     "Display failure","LCD panel;LCD cable;Lid sensor",60,88.0,"Intermediate"),
    ("laptop","ASUS","Universal","touchscreen not working ASUS Vivobook Flip ZenBook Flip driver cable",
     "Trackpad failure","Touch driver;Touch cable;Digitizer",30,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","screen white spots pressure marks physical damage ASUS",
     "Screen damage","LCD panel",45,90.0,"Intermediate"),
    ("laptop","ASUS","Universal","screen goes black moving lid hinge LCD cable Vivobook ASUS",
     "LCD cable failure","LCD cable;Hinge",45,90.0,"Intermediate"),
    ("laptop","ASUS","Universal","8 blinks LCD failure ASUS power LED display panel",
     "Display failure","LCD panel;LCD cable",60,88.0,"Intermediate"),
    ("laptop","ASUS","Universal","OLED burn-in ZenBook Pro ROG static image pixel refresh MyASUS",
     "Screen damage","OLED panel;Pixel refresh;MyASUS",30,80.0,"Intermediate"),
    ("laptop","ASUS","Universal","screen yellow tint color profile failing LCD ASUS calibration",
     "Display failure","LCD panel;Color profile;Display calibration",30,80.0,"Intermediate"),
    ("laptop","ASUS","Universal","screen cracked ASUS ZenBook ROG broken display",
     "Screen damage","LCD panel",60,95.0,"Intermediate"),

    # ── Thermal & Fan (Critical for ROG/TUF) ─────────────────────────────────
    ("laptop","ASUS","Universal","fans loud constantly ASUS dust gaming mode Armoury Crate Turbo",
     "Cooling system failure","Fan;Vents;Thermal paste;Armoury Crate",45,90.0,"Beginner"),
    ("laptop","ASUS","Universal","fan rattling grinding noise ASUS ROG TUF worn bearing left fan",
     "Cooling system failure","Fan",30,90.0,"Beginner"),
    ("laptop","ASUS","Universal","ASUS laptop very hot fan never spins dead fan Armoury Crate curve",
     "Cooling system failure","Fan;Fan connector;Fan curve settings",30,88.0,"Intermediate"),
    ("laptop","ASUS","Universal","sudden shutdown gaming ROG TUF thermal trip CPU GPU overheat",
     "Cooling system failure","Fan;Heat sink;Thermal paste",45,90.0,"Intermediate"),
    ("laptop","ASUS","Universal","thermal error on boot ASUS overheating detected cooling",
     "Cooling system failure","Fan;Heat sink;Thermal paste",45,88.0,"Intermediate"),
    ("laptop","ASUS","Universal","laptop throttles slow FPS games ASUS ROG power limit undervolt",
     "Thermal throttling","CPU;Thermal paste;Fan;Intel XTU;ThrottleStop",45,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","one fan spins other doesn't ASUS ROG 15 inch dead fan",
     "Cooling system failure","Fan;Fan debris",30,90.0,"Beginner"),
    ("laptop","ASUS","Universal","7 blinks CPU thermal shutdown ASUS immediate cooling clean",
     "Cooling system failure","Fan;Heat sink;Thermal paste",45,90.0,"Intermediate"),

    # ── Keyboard, Trackpad & RGB ──────────────────────────────────────────────
    ("laptop","ASUS","Universal","specific keys not working ASUS liquid debris keyboard",
     "Keyboard failure","Keyboard;Ribbon cable;Top cover",45,90.0,"Intermediate"),
    ("laptop","ASUS","Universal","keyboard backlight not working ASUS Fn F3 F4 Armoury Crate",
     "Keyboard failure","Keyboard;Keyboard backlight;Fn key;Armoury Crate",15,90.0,"Beginner"),
    ("laptop","ASUS","Universal","RGB not working ASUS ROG Armoury Crate dead LEDs reinstall",
     "Keyboard failure","Keyboard;RGB LEDs;Armoury Crate;EC firmware",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","trackpad not responding ASUS disabled Fn F9 F10 driver ZenBook Vivobook",
     "Trackpad failure","Trackpad;Trackpad cable;Driver;Fn key",30,88.0,"Beginner"),
    ("laptop","ASUS","Universal","trackpad buttons stuck ASUS swollen battery physical damage",
     "Trackpad failure","Trackpad;Battery;Palmrest",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","NumberPad not working ZenBook ASUS driver firmware update",
     "Keyboard failure","NumberPad;ASUS NumberPad driver;Cable",15,90.0,"Beginner"),
    ("laptop","ASUS","Universal","USB port not working ASUS chipset driver dead port",
     "USB failure","USB port;Chipset driver;Motherboard",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","USB-C port not charging display ASUS firmware update ZenBook ROG",
     "USB failure","USB-C port;USB-C firmware;Motherboard",45,75.0,"Advanced"),

    # ── Audio ─────────────────────────────────────────────────────────────────
    ("laptop","ASUS","Universal","no sound speakers ASUS audio not working driver Realtek",
     "Audio failure","Speakers;Audio driver;Realtek",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","crackling distorted audio ASUS Realtek driver enhancements",
     "Audio failure","Speakers;Realtek driver;Audio enhancements",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","microphone not working ASUS privacy settings driver",
     "Audio failure","Microphone;Privacy settings;Audio driver",15,90.0,"Beginner"),
    ("laptop","ASUS","Universal","no audio output device ASUS Realtek driver reinstall",
     "Audio failure","Audio driver;Realtek;Motherboard audio chip",30,78.0,"Intermediate"),

    # ── Wi-Fi, Bluetooth & Network ────────────────────────────────────────────
    ("laptop","ASUS","Universal","wifi adapter not detected ASUS Fn F12 airplane mode driver MediaTek",
     "Network failure","Wifi card;Driver;Airplane mode",30,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","wifi keeps disconnecting ASUS power management Intel Realtek",
     "Network failure","Wifi driver;Power management",15,88.0,"Beginner"),
    ("laptop","ASUS","Universal","bluetooth not working ASUS service driver card",
     "Network failure","Bluetooth driver;Bluetooth service",15,88.0,"Beginner"),
    ("laptop","ASUS","Universal","slow wifi ASUS ROG TUF Killer MediaTek driver update Intel AX210",
     "Network failure","Wifi driver;MediaTek;Killer wifi;Intel AX210 upgrade",15,88.0,"Beginner"),
    ("laptop","ASUS","Universal","Realtek wifi ASUS poor driver slow replace Intel AX210 upgrade",
     "Network failure","Realtek Wifi card;Driver;Intel AX210",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","Ethernet port not working ASUS Realtek driver bent pins",
     "Network failure","Ethernet port;Realtek driver;Bent pins",30,82.0,"Intermediate"),

    # ── BIOS & Firmware (CrashFree BIOS 3) ───────────────────────────────────
    ("laptop","ASUS","Universal","BIOS update failed ASUS won't boot CrashFree BIOS 3 ASUS.CAP USB",
     "BIOS corruption","BIOS;USB ASUS.CAP recovery;CrashFree BIOS 3",60,72.0,"Advanced"),
    ("laptop","ASUS","Universal","ASUS BIOS recovery Ctrl Home Fn Esc power ASUS.CAP FAT32",
     "BIOS corruption","BIOS;USB ASUS.CAP;CrashFree BIOS 3",60,72.0,"Advanced"),
    ("laptop","ASUS","Universal","Secure Boot violation ASUS boot device not signed F2 BIOS disable",
     "BIOS configuration","BIOS settings;Secure Boot",15,95.0,"Beginner"),
    ("laptop","ASUS","Universal","real time clock error ASUS CMOS battery dead F2 BIOS",
     "CMOS battery failure","CMOS battery;RTC circuit",15,95.0,"Beginner"),
    ("laptop","ASUS","Universal","TPM not detected ASUS BitLocker key Microsoft account BIOS",
     "BIOS configuration","TPM;BIOS settings;Microsoft account",30,88.0,"Intermediate"),
    ("laptop","ASUS","Universal","fan always max speed after ASUS BIOS update EC reset fan curve",
     "Cooling system failure","Fan;EC firmware;BIOS fan curve;Armoury Crate",30,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","press F2 enter BIOS stuck ASUS corruption keyboard issue",
     "BIOS corruption","BIOS;Keyboard;CrashFree BIOS 3",45,72.0,"Advanced"),
    ("laptop","ASUS","Universal","CPU fan error ASUS fan not spinning won't boot",
     "Cooling system failure","Fan;Fan connector",30,90.0,"Beginner"),

    # ── ROG Gaming Specific ───────────────────────────────────────────────────
    ("laptop","ASUS","Universal","low FPS games ROG thermal throttling power limit driver Armoury Crate Turbo",
     "Thermal throttling","CPU;GPU;Thermal paste;Armoury Crate;GPU driver",45,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","RGB lighting not working ROG Armoury Crate crash service restart",
     "Keyboard failure","Armoury Crate;RGB LEDs;EC firmware",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","screen flickering games ROG GSync FreeSync conflict NVIDIA",
     "Display failure","GSync;FreeSync;NVIDIA driver;LCD panel",30,82.0,"Intermediate"),
    ("laptop","ASUS","Universal","ROG laptop shuts down gaming overheating power adapter too weak 240W",
     "Cooling system failure","Fan;Thermal paste;Charger wattage;Heat sink",45,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","GPU not detected Device Manager ROG driver crash DDU reinstall",
     "GPU failure","GPU;GPU driver;DDU;Motherboard",60,70.0,"Advanced"),
    ("laptop","ASUS","Universal","Turbo mode not working ROG Armoury Crate EC firmware update",
     "Software issue","Armoury Crate;EC firmware",15,88.0,"Beginner"),
    ("laptop","ASUS","Universal","ROG needs 240W charger laptop slow plugged wrong adapter gaming",
     "Power supply failure","Charger;Power adapter wattage;ROG",15,95.0,"Beginner"),

    # ── ZenBook Specific ──────────────────────────────────────────────────────
    ("laptop","ASUS","Universal","ZenBook OLED screen flicker refresh rate driver 60Hz",
     "Display failure","OLED panel;GPU driver;Refresh rate",30,85.0,"Beginner"),
    ("laptop","ASUS","Universal","ZenBook NumberPad not working driver firmware MyASUS update",
     "Keyboard failure","NumberPad;ASUS NumberPad driver",15,90.0,"Beginner"),
    ("laptop","ASUS","Universal","ZenBook Flip touchscreen not rotating driver Intel sensor recalibrate",
     "Trackpad failure","Intel sensor driver;Touch driver;Windows calibration",15,90.0,"Beginner"),
    ("laptop","ASUS","Universal","ZenBook USB-C port loose worn replace microsoldering",
     "USB failure","USB-C port;Microsoldering;Motherboard",90,65.0,"Advanced"),

    # ── Vivobook Specific ─────────────────────────────────────────────────────
    ("laptop","ASUS","Universal","broken hinge Vivobook ASUS very common plastic cracked lid",
     "Physical damage","Hinge assembly;Lid assembly;Back cover",60,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","Vivobook lid won't stay open hinge broken plastic mount",
     "Physical damage","Hinge assembly;Back cover;Epoxy",60,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","keyboard keys popping off Vivobook cheap mechanism full disassembly",
     "Keyboard failure","Keyboard;Key mechanism;Top cover",45,88.0,"Intermediate"),
    ("laptop","ASUS","Universal","bottom case cracking screw mounts Vivobook plastic stress",
     "Physical damage","Bottom cover;Screw mounts;Washers",30,85.0,"Beginner"),

    # ── Physical & Liquid Damage ──────────────────────────────────────────────
    ("laptop","ASUS","Universal","liquid spilled ASUS no drain holes upside down battery isopropyl",
     "Liquid damage","Motherboard;Keyboard;Battery;Isopropyl alcohol",120,60.0,"Advanced"),
    ("laptop","ASUS","Universal","broken hinge TUF ASUS metal hinge lid assembly replace",
     "Physical damage","Hinge assembly;Lid assembly",60,85.0,"Intermediate"),
    ("laptop","ASUS","Universal","cracked palmrest ASUS Vivobook dropped bottom cover",
     "Physical damage","Palmrest;Bottom cover;Screws",60,90.0,"Intermediate"),
    ("laptop","ASUS","Universal","broken DC jack ASUS barrel connector loose desolder solder",
     "DC jack failure","DC jack;Motherboard",90,80.0,"Advanced"),
    ("laptop","ASUS","Universal","broken USB-C port ASUS ZenBook physical damage microsoldering",
     "Physical damage","USB-C port;Motherboard",90,65.0,"Advanced"),
    ("laptop","ASUS","Universal","laptop fell dropped ASUS won't turn on cracked motherboard",
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
        for rec in ASUS_RECORDS:
            if rec[3] in existing:
                continue
            writer.writerow(rec)
            added += 1

    print(f"Done. Added {added} ASUS training records to {CSV_PATH}")


if __name__ == "__main__":
    main()
