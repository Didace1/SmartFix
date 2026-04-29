"""
Script to append Apple MacBook universal fault training data to the existing CSV.
Covers Classic Unibody (2006-2012), Retina Intel (2012-2015),
T2 Intel (2016-2020), Apple Silicon M1/M2/M3 (2020-present).
Run once: python add_apple_training_data.py
"""
import csv
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "raw", "comprehensive_training_data_fixed.csv")

APPLE_RECORDS = [
    # ── Apple Diagnostics Reference Codes ─────────────────────────────────────
    ("laptop","Apple","Universal","PPT001 battery not detected Apple diagnostics",
     "Battery failure","Battery;Battery connector",30,90.0,"Beginner"),
    ("laptop","Apple","Universal","PPT002 battery requires service Apple diagnostics worn",
     "Battery failure","Battery",15,95.0,"Beginner"),
    ("laptop","Apple","Universal","PPT003 battery not charging Apple diagnostics charging circuit SMC",
     "Battery failure","Battery;Charger;SMC;Logic board",30,85.0,"Beginner"),
    ("laptop","Apple","Universal","PPF001 fan failure Apple diagnostics CPU fan",
     "Cooling system failure","Fan;Heatsink",30,90.0,"Beginner"),
    ("laptop","Apple","Universal","PPF002 fan speed out of range Apple diagnostics bearing worn",
     "Cooling system failure","Fan",30,90.0,"Beginner"),
    ("laptop","Apple","Universal","PPM001 memory RAM failure Apple diagnostics soldered",
     "RAM failure","Motherboard;Soldered RAM",120,45.0,"Advanced"),
    ("laptop","Apple","Universal","PPM002 memory controller failure CPU RAM controller Apple",
     "RAM failure","Motherboard;CPU;RAM controller",120,40.0,"Advanced"),
    ("laptop","Apple","Universal","PPD001 display LCD failure Apple diagnostics panel cable",
     "Display failure","LCD panel;LCD cable",60,85.0,"Intermediate"),
    ("laptop","Apple","Universal","PPD002 display backlight failure Apple diagnostics",
     "Backlight failure","LCD panel;Backlight circuit;Logic board",60,80.0,"Intermediate"),
    ("laptop","Apple","Universal","PDR001 trackpad failure Apple diagnostics cable",
     "Trackpad failure","Trackpad;Trackpad cable",30,88.0,"Intermediate"),
    ("laptop","Apple","Universal","PDS001 storage SSD failure Apple diagnostics controller",
     "Storage failure","SSD;SSD controller;Motherboard",60,75.0,"Advanced"),
    ("laptop","Apple","Universal","PDS002 storage controller failure T2 chip SSD",
     "Storage failure","T2 chip;SSD controller;Motherboard",120,50.0,"Advanced"),
    ("laptop","Apple","Universal","NDL001 wifi adapter not detected Apple diagnostics card",
     "Network failure","Wifi card;Antenna;Logic board",30,85.0,"Intermediate"),
    ("laptop","Apple","Universal","NDL002 bluetooth failure Apple diagnostics module",
     "Network failure","Bluetooth module;Wifi card",30,85.0,"Intermediate"),
    ("laptop","Apple","Universal","VFD001 audio speaker failure Apple diagnostics",
     "Audio failure","Speakers;Audio IC",45,75.0,"Intermediate"),

    # ── Power-On Failures ─────────────────────────────────────────────────────
    ("laptop","Apple","Universal","MacBook absolutely dead no chime no fan no light on charger",
     "Power supply failure","Charger;MagSafe;USB-C;SMC;Logic board",60,70.0,"Intermediate"),
    ("laptop","Apple","Universal","chime sounds black screen fans spin no display MacBook",
     "GPU failure","GPU;LCD panel;Logic board",90,60.0,"Advanced"),
    ("laptop","Apple","Universal","MacBook powers on Apple logo appears then black screen",
     "Software issue","OS;SSD;T2 firmware;Recovery mode",60,80.0,"Intermediate"),
    ("laptop","Apple","Universal","folder with question mark no bootable OS SSD not detected",
     "Storage failure","SSD;OS;Boot drive;Recovery mode",60,82.0,"Intermediate"),
    ("laptop","Apple","Universal","prohibitory sign circle with slash on boot incompatible macOS",
     "Software issue","OS;macOS version;Recovery mode",30,85.0,"Beginner"),
    ("laptop","Apple","Universal","kernel panic multilingual restart message MacBook",
     "RAM failure","RAM;OS;SSD;Logic board",60,75.0,"Intermediate"),
    ("laptop","Apple","Universal","MacBook boots to white screen no Apple logo GPU firmware",
     "GPU failure","GPU;Logic board;NVRAM",90,55.0,"Advanced"),
    ("laptop","Apple","Universal","MacBook boots to blue screen GPU failure 2011",
     "GPU failure","GPU;Logic board",120,50.0,"Advanced"),
    ("laptop","Apple","Universal","MacBook support.apple.com/mac/restore screen T2 firmware",
     "BIOS corruption","T2 chip;Firmware;Apple Configurator 2",60,65.0,"Advanced"),

    # ── SMC / NVRAM Resets ────────────────────────────────────────────────────
    ("laptop","Apple","Universal","SMC reset MacBook battery not charging fan always on backlight",
     "Power supply failure","SMC;Battery;Fan;Logic board",15,85.0,"Beginner"),
    ("laptop","Apple","Universal","NVRAM PRAM reset MacBook display issues startup disk resolution",
     "Software issue","NVRAM;Display;Startup disk;Sound settings",15,85.0,"Beginner"),
    ("laptop","Apple","Universal","MacBook won't turn on T2 press hold power button 10 seconds",
     "Power supply failure","T2 chip;SMC;Logic board",15,80.0,"Beginner"),

    # ── Famous MacBook-Specific Failures ──────────────────────────────────────
    ("laptop","Apple","Universal","Flexgate screen goes black when opened past 45 degrees 2016 2017 2018 Pro",
     "LCD cable failure","LCD cable;Display assembly;Hinge",90,80.0,"Advanced"),
    ("laptop","Apple","Universal","Flexgate backlight uneven stage light dark spots bottom screen",
     "Backlight failure","LCD cable;Display assembly;Backlight",90,80.0,"Advanced"),
    ("laptop","Apple","Universal","Staingate anti-reflective coating peeling off screen Retina 2012 2013 2014 2015",
     "Screen damage","Display assembly;Anti-reflective coating",60,85.0,"Intermediate"),
    ("laptop","Apple","Universal","butterfly keyboard keys sticky mushy don't click 2016 2017 2018 2019",
     "Keyboard failure","Keyboard;Butterfly mechanism;Top case",60,88.0,"Intermediate"),
    ("laptop","Apple","Universal","butterfly keyboard key repeats when pressed once debris mechanism",
     "Keyboard failure","Keyboard;Butterfly mechanism;Compressed air",30,85.0,"Beginner"),
    ("laptop","Apple","Universal","butterfly keyboard spacebar only works one side stabilizer broken",
     "Keyboard failure","Keyboard;Spacebar;Top case",60,88.0,"Intermediate"),
    ("laptop","Apple","Universal","2011 MacBook Pro 15 AMD GPU failure black screen blue screen",
     "GPU failure","GPU;AMD chip;Logic board",120,45.0,"Advanced"),

    # ── Battery & Charging ────────────────────────────────────────────────────
    ("laptop","Apple","Universal","Service Battery warning macOS worn battery cycles 1000",
     "Battery failure","Battery",15,95.0,"Beginner"),
    ("laptop","Apple","Universal","MacBook not charging plugged in SMC charger battery",
     "Battery failure","Battery;Charger;SMC;Logic board",30,85.0,"Beginner"),
    ("laptop","Apple","Universal","battery stuck at 1 percent 0 percent SMC communication",
     "Battery failure","Battery;SMC",15,90.0,"Beginner"),
    ("laptop","Apple","Universal","MacBook only works plugged in battery dead won't hold charge",
     "Battery failure","Battery",30,90.0,"Beginner"),
    ("laptop","Apple","Universal","swollen battery MacBook trackpad hard to click case bulging fire hazard",
     "Battery failure","Battery",15,98.0,"Beginner"),
    ("laptop","Apple","Universal","MagSafe charger LED dim flickering logic board DC-in",
     "Power supply failure","Charger;MagSafe;Logic board DC-in",30,75.0,"Intermediate"),
    ("laptop","Apple","Universal","MagSafe LED green but not charging SMC battery disconnected",
     "Battery failure","Battery;SMC;Battery connector",15,90.0,"Beginner"),
    ("laptop","Apple","Universal","MacBook shuts down at 20 30 percent battery calibration dead cell",
     "Battery failure","Battery;Battery calibration",15,90.0,"Beginner"),
    ("laptop","Apple","Universal","USB-C charging MacBook stops certain percentage firmware PPT003",
     "Battery failure","Battery;USB-C firmware;SMC",30,85.0,"Beginner"),

    # ── Display Issues ────────────────────────────────────────────────────────
    ("laptop","Apple","Universal","vertical lines on MacBook screen LCD GPU failure",
     "Display failure","LCD panel;GPU;Logic board",60,80.0,"Intermediate"),
    ("laptop","Apple","Universal","screen pink green tint flickering LCD cable GPU MacBook",
     "Display failure","LCD cable;GPU;LCD panel",45,80.0,"Intermediate"),
    ("laptop","Apple","Universal","MacBook screen black external monitor works LCD backlight",
     "Backlight failure","LCD panel;Backlight;Logic board backlight IC",60,82.0,"Intermediate"),
    ("laptop","Apple","Universal","MacBook screen black external also black GPU logic board",
     "GPU failure","GPU;Logic board",120,45.0,"Advanced"),
    ("laptop","Apple","Universal","white spots pressure marks screen MacBook physical damage",
     "Screen damage","LCD panel",45,90.0,"Intermediate"),
    ("laptop","Apple","Universal","screen goes black moving lid hinge LCD cable MacBook",
     "LCD cable failure","LCD cable;Hinge;Display assembly",60,85.0,"Intermediate"),
    ("laptop","Apple","Universal","True Tone not working ambient light sensor cable 2018",
     "Display failure","Ambient light sensor;LCD cable;NVRAM",30,80.0,"Intermediate"),
    ("laptop","Apple","Universal","horizontal lines moving across screen LCD controller MacBook",
     "Display failure","LCD panel;Display assembly",60,82.0,"Intermediate"),
    ("laptop","Apple","Universal","screen cracked MacBook Retina Yoga X1 replace display assembly",
     "Screen damage","Display assembly;LCD panel",90,90.0,"Advanced"),

    # ── RAM / Memory ──────────────────────────────────────────────────────────
    ("laptop","Apple","Universal","random kernel panic restarts MacBook PPM001 RAM",
     "RAM failure","Motherboard;Soldered RAM",90,50.0,"Advanced"),
    ("laptop","Apple","Universal","MacBook freezes under load video editing RAM memory",
     "RAM failure","RAM;Motherboard",90,55.0,"Advanced"),
    ("laptop","Apple","Universal","MacBook only 8GB RAM shows less than expected Apple Silicon",
     "RAM failure","Motherboard;Unified memory",90,50.0,"Advanced"),

    # ── Storage (SSD) ─────────────────────────────────────────────────────────
    ("laptop","Apple","Universal","folder question mark MacBook SSD not detected no OS",
     "Storage failure","SSD;Boot drive;OS",60,82.0,"Intermediate"),
    ("laptop","Apple","Universal","MacBook extremely slow boot 5 minutes SSD failing",
     "Storage failure","SSD;File system;Disk Utility",90,78.0,"Intermediate"),
    ("laptop","Apple","Universal","kernel panic NVMe storage SSD controller T2",
     "Storage failure","SSD;T2 chip;SSD controller",90,65.0,"Advanced"),
    ("laptop","Apple","Universal","this disk is locked FileVault T2 security encrypted",
     "Storage failure","FileVault;T2 chip;Password;Recovery mode",30,80.0,"Intermediate"),
    ("laptop","Apple","Universal","MacBook Pro 2013 2014 2015 SSD not detected proprietary blade",
     "Storage failure","Proprietary SSD;SSD connector;M.2 adapter",60,80.0,"Intermediate"),
    ("laptop","Apple","Universal","SSD health degradation M1 MacBook high swap usage 8GB",
     "Storage failure","SSD;Swap usage;Unified memory",90,60.0,"Advanced"),

    # ── Thermal & Fan ─────────────────────────────────────────────────────────
    ("laptop","Apple","Universal","MacBook fan loud constantly hot dust thermal paste Activity Monitor",
     "Cooling system failure","Fan;Thermal paste;Heat sink",45,90.0,"Beginner"),
    ("laptop","Apple","Universal","one fan spins other doesn't MacBook Pro 15 inch",
     "Cooling system failure","Fan;Fan debris",30,90.0,"Beginner"),
    ("laptop","Apple","Universal","MacBook shuts down under load video editing gaming thermal trip",
     "Cooling system failure","Fan;Thermal paste;Heat sink;Macs Fan Control",45,90.0,"Intermediate"),
    ("laptop","Apple","Universal","fan runs max speed at idle MacBook SMC temperature sensor PPF001",
     "Cooling system failure","SMC;Temperature sensor;Fan",30,85.0,"Intermediate"),
    ("laptop","Apple","Universal","no fan noise MacBook very hot dead fan disconnected",
     "Cooling system failure","Fan;Fan connector",30,88.0,"Intermediate"),
    ("laptop","Apple","Universal","your system was restarted because of a problem overheating kernel",
     "Cooling system failure","Fan;Thermal paste;Heat sink",45,85.0,"Intermediate"),

    # ── Keyboard & Trackpad ───────────────────────────────────────────────────
    ("laptop","Apple","Universal","trackpad clicks but cursor doesn't move MacBook swollen battery cable",
     "Trackpad failure","Battery;Trackpad cable;Trackpad",30,85.0,"Beginner"),
    ("laptop","Apple","Universal","trackpad doesn't click no haptic feedback MacBook swollen battery",
     "Trackpad failure","Battery;Trackpad;Haptic motor",30,85.0,"Beginner"),
    ("laptop","Apple","Universal","Force Touch trackpad not responding logic board T2 cable",
     "Trackpad failure","Trackpad cable;Logic board;T2",45,75.0,"Advanced"),
    ("laptop","Apple","Universal","keyboard backlight not working MacBook F6 cable top case",
     "Keyboard failure","Keyboard;Keyboard backlight;F6 key",15,90.0,"Beginner"),
    ("laptop","Apple","Universal","Touch Bar not working MacBook Pro 2016 2017 2018 2019 T2",
     "Keyboard failure","Touch Bar;T2 chip;Top case;SMC",60,70.0,"Advanced"),
    ("laptop","Apple","Universal","Touch ID button not working fingerprint sensor T2 MacBook",
     "Keyboard failure","Touch ID;T2 chip;Power button",30,75.0,"Intermediate"),

    # ── Audio ─────────────────────────────────────────────────────────────────
    ("laptop","Apple","Universal","no sound speakers MacBook headphones work audio IC 2016 2017 2018",
     "Audio failure","Speakers;Audio IC;Logic board",45,70.0,"Advanced"),
    ("laptop","Apple","Universal","no sound headphones MacBook speakers work dirty jack optical sensor",
     "Audio failure","Headphone jack;Optical sensor;Audio board",15,90.0,"Beginner"),
    ("laptop","Apple","Universal","crackling distorted sound MacBook speaker driver update",
     "Audio failure","Speakers;Audio driver;macOS update",30,82.0,"Beginner"),
    ("laptop","Apple","Universal","microphone not working MacBook privacy settings T2 logic board",
     "Audio failure","Microphone;Privacy settings;T2 chip",15,85.0,"Beginner"),
    ("laptop","Apple","Universal","no output devices found MacBook sound settings audio IC reball",
     "Audio failure","Audio IC;Logic board;NVRAM",45,70.0,"Advanced"),
    ("laptop","Apple","Universal","speakers pop hiss when idle MacBook ground loop audio IC",
     "Audio failure","Audio IC;Logic board;macOS update",30,72.0,"Intermediate"),

    # ── Wi-Fi & Bluetooth ─────────────────────────────────────────────────────
    ("laptop","Apple","Universal","wifi not turning on MacBook hardware NDL001 card antenna",
     "Network failure","Wifi card;Antenna;Logic board",30,82.0,"Intermediate"),
    ("laptop","Apple","Universal","wifi no hardware installed MacBook logic board card dead",
     "Network failure","Wifi card;Logic board;Antenna",45,75.0,"Intermediate"),
    ("laptop","Apple","Universal","wifi keeps disconnecting MacBook interference driver router",
     "Network failure","Wifi driver;Wifi channel;Router",15,88.0,"Beginner"),
    ("laptop","Apple","Universal","bluetooth not finding devices MacBook module reset shift option",
     "Network failure","Bluetooth module;Bluetooth driver",15,88.0,"Beginner"),
    ("laptop","Apple","Universal","Handoff Continuity not working MacBook iCloud Bluetooth",
     "Network failure","Bluetooth;iCloud;Handoff settings",15,88.0,"Beginner"),

    # ── USB-C & Ports (2016+) ─────────────────────────────────────────────────
    ("laptop","Apple","Universal","USB-C port not charging MacBook dirt firmware different port",
     "USB failure","USB-C port;Charger;Firmware;Logic board",30,82.0,"Intermediate"),
    ("laptop","Apple","Universal","USB-C works data but not charging MacBook power delivery IC",
     "USB failure","USB-C port;Power delivery IC;Logic board",45,72.0,"Advanced"),
    ("laptop","Apple","Universal","all USB-C ports dead MacBook T2 chip logic board SMC",
     "USB failure","USB-C port;T2 chip;Logic board;SMC",60,60.0,"Advanced"),
    ("laptop","Apple","Universal","external monitor not working USB-C MacBook cable firmware adapter",
     "USB failure","USB-C cable;Firmware;DisplayPort adapter",15,88.0,"Beginner"),

    # ── T2 Chip Specific (2018-2020) ──────────────────────────────────────────
    ("laptop","Apple","Universal","T2 chip won't turn on press hold power button 10 seconds",
     "BIOS corruption","T2 chip;Firmware;Logic board",15,80.0,"Beginner"),
    ("laptop","Apple","Universal","bridge OS kernel panic T2 firmware bug macOS update",
     "BIOS corruption","T2 chip;Firmware;macOS update;SMC",30,78.0,"Intermediate"),
    ("laptop","Apple","Universal","no bootable drive after macOS update T2 security FileVault",
     "BIOS configuration","T2 chip;Startup Security;FileVault;Recovery mode",30,80.0,"Intermediate"),
    ("laptop","Apple","Universal","T2 Mac firmware corrupt Apple Configurator 2 restore DFU",
     "BIOS corruption","T2 chip;Firmware;Apple Configurator 2",60,65.0,"Advanced"),

    # ── Apple Silicon Specific (M1/M2/M3) ────────────────────────────────────
    ("laptop","Apple","Universal","M1 M2 M3 MacBook stuck on Apple logo progress bar corrupt OS",
     "Software issue","macOS;OS update;Recovery mode",30,85.0,"Beginner"),
    ("laptop","Apple","Universal","M1 MacBook only one external monitor limited display",
     "Software issue","M1 chip;DisplayLink adapter;External display",15,92.0,"Beginner"),
    ("laptop","Apple","Universal","Rosetta 2 apps crashing M1 M2 MacBook translation layer",
     "Software issue","Rosetta 2;App update;macOS",15,92.0,"Beginner"),
    ("laptop","Apple","Universal","Apple Silicon MacBook won't turn on battery drained firmware",
     "Power supply failure","Battery;Charger;Apple Silicon firmware",15,85.0,"Beginner"),

    # ── Physical & Liquid Damage ──────────────────────────────────────────────
    ("laptop","Apple","Universal","liquid spilled MacBook no drain holes flip upside down",
     "Liquid damage","Logic board;Keyboard;Battery;Isopropyl alcohol",120,55.0,"Advanced"),
    ("laptop","Apple","Universal","liquid spill indicator LSI red pink MacBook warranty voided",
     "Liquid damage","Logic board;LSI sticker;Isopropyl alcohol",120,55.0,"Advanced"),
    ("laptop","Apple","Universal","cracked MacBook screen Retina closed with object keyboard",
     "Screen damage","Display assembly;LCD panel",90,90.0,"Advanced"),
    ("laptop","Apple","Universal","broken hinge loose lid MacBook dropped worn",
     "Physical damage","Hinge;Display assembly",90,80.0,"Advanced"),
    ("laptop","Apple","Universal","dented bottom case MacBook dropped logic board damage",
     "Physical damage","Bottom case;Logic board",60,75.0,"Advanced"),

    # ── Error Messages ────────────────────────────────────────────────────────
    ("laptop","Apple","Universal","your computer restarted because of a problem kernel panic MacBook",
     "Software issue","RAM;SSD;Logic board;Apple Diagnostics",60,75.0,"Intermediate"),
    ("laptop","Apple","Universal","no bootable device macOS recovery SSD not detected MacBook",
     "Storage failure","SSD;Boot drive;Recovery mode;Disk Utility",60,82.0,"Intermediate"),
    ("laptop","Apple","Universal","the version of macOS is not compatible with this Mac",
     "Software issue","macOS version;Recovery mode;Compatibility",15,95.0,"Beginner"),
    ("laptop","Apple","Universal","battery not detected MacBook connector dead battery",
     "Battery failure","Battery;Battery connector",30,90.0,"Beginner"),
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
        for rec in APPLE_RECORDS:
            if rec[3] in existing:
                continue
            writer.writerow(rec)
            added += 1

    print(f"Done. Added {added} Apple MacBook training records to {CSV_PATH}")


if __name__ == "__main__":
    main()
