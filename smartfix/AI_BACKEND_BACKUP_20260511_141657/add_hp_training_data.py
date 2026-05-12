"""
Script to append HP universal fault training data to the existing CSV.
Run once: python add_hp_training_data.py
"""
import csv
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "raw", "comprehensive_training_data_fixed.csv")

HP_RECORDS = [
    # ── Power-On Failures ─────────────────────────────────────────────────────
    ("laptop","HP","Universal","dead no lights no fan no sound completely dead no power",
     "Power supply failure","Power adapter;Battery;DC jack;Motherboard",60,75.0,"Intermediate"),
    ("laptop","HP","Universal","lights turn on fan spins screen stays black no display",
     "Display failure","RAM;LCD cable;LCD panel;Motherboard",60,80.0,"Intermediate"),
    ("laptop","HP","Universal","powers on shuts off after 2 to 5 seconds immediately off",
     "Motherboard failure","Motherboard;RAM;CPU;Voltage regulator",90,60.0,"Advanced"),
    ("laptop","HP","Universal","powers on no display caps lock light toggles on off",
     "GPU failure","GPU;LCD panel;Backlight;Motherboard",90,65.0,"Advanced"),
    ("laptop","HP","Universal","CMOS checksum error on boot date time reset",
     "CMOS battery failure","CMOS battery;BIOS",15,95.0,"Beginner"),
    ("laptop","HP","Universal","no power at all completely dead charger LED not on",
     "Power supply failure","Power adapter;Charger;DC jack",30,85.0,"Beginner"),
    ("laptop","HP","Universal","laptop starts then immediately restarts loops on boot",
     "Motherboard failure","Motherboard;RAM;Power IC",60,65.0,"Advanced"),

    # ── Beep / Blink Codes ────────────────────────────────────────────────────
    ("laptop","HP","Universal","1 long 2 short beeps blinks BIOS boot block corruption",
     "BIOS corruption","BIOS chip;USB recovery drive",30,70.0,"Advanced"),
    ("laptop","HP","Universal","2 long 2 short beeps blinks BIOS main area corruption",
     "BIOS corruption","BIOS chip;Motherboard",60,60.0,"Advanced"),
    ("laptop","HP","Universal","3 long 2 short beeps blinks RAM memory failure",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","HP","Universal","3 long 3 short beeps blinks GPU graphics failure",
     "GPU failure","Motherboard;GPU chip",120,50.0,"Advanced"),
    ("laptop","HP","Universal","3 long 4 short beeps blinks power supply failure",
     "Power supply failure","Charger;DC jack;Power IC",45,75.0,"Intermediate"),
    ("laptop","HP","Universal","3 long 5 short beeps blinks CPU failure processor",
     "CPU failure","CPU;Motherboard",120,40.0,"Advanced"),
    ("laptop","HP","Universal","4 long 2 short beeps blinks CPU thermal shutdown overheating",
     "Cooling system failure","Fan;Heat sink;Thermal paste",45,90.0,"Intermediate"),
    ("laptop","HP","Universal","4 long 3 short beeps blinks temperature sensor blocked vents",
     "Cooling system failure","Fan;Vents;Battery;Thermal sensor",30,88.0,"Intermediate"),
    ("laptop","HP","Universal","5 short beeps RTC real time clock failure",
     "CMOS battery failure","CMOS battery;RTC circuit;Motherboard",30,80.0,"Intermediate"),
    ("laptop","HP","Universal","beeps 3 times then stops no display",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","HP","Universal","continuous short beeps power delivery failure",
     "Power supply failure","Motherboard;Power rail",60,55.0,"Advanced"),

    # ── Boot & OS Errors ──────────────────────────────────────────────────────
    ("laptop","HP","Universal","boot device not found 3F0 error hard drive not detected",
     "Storage failure","SSD;HDD;SATA cable;BIOS boot order",60,85.0,"Intermediate"),
    ("laptop","HP","Universal","operating system not found corrupt bootloader",
     "Boot failure","OS;Bootloader;HDD;SSD",60,85.0,"Intermediate"),
    ("laptop","HP","Universal","no bootable device found empty failed drive",
     "Storage failure","HDD;SSD;SATA cable;BIOS settings",60,85.0,"Intermediate"),
    ("laptop","HP","Universal","blue screen CRITICAL_PROCESS_DIED crash",
     "Software issue","OS;SSD;Windows files;Drivers",90,80.0,"Intermediate"),
    ("laptop","HP","Universal","blue screen WHEA_UNCORRECTABLE_ERROR crash",
     "CPU failure","CPU;Drivers;Cooling;Motherboard",90,70.0,"Advanced"),
    ("laptop","HP","Universal","blue screen IRQL_NOT_LESS_OR_EQUAL crash",
     "RAM failure","RAM;Drivers;RAM slot",60,80.0,"Intermediate"),
    ("laptop","HP","Universal","blue screen PAGE_FAULT_IN_NONPAGED_AREA",
     "RAM failure","RAM;Page file;Drivers",60,80.0,"Intermediate"),
    ("laptop","HP","Universal","automatic repair loop boot loop Windows",
     "Software issue","OS;Registry;HDD;Windows files",90,75.0,"Intermediate"),
    ("laptop","HP","Universal","INACCESSIBLE_BOOT_DEVICE blue screen",
     "Storage failure","Storage driver;SSD;BitLocker;SATA mode",60,78.0,"Intermediate"),
    ("laptop","HP","Universal","freezes at Windows logo black screen during startup",
     "Software issue","Drivers;GPU;HDD;Safe mode",60,80.0,"Intermediate"),

    # ── Display & Graphics ────────────────────────────────────────────────────
    ("laptop","HP","Universal","screen flickering unstable display",
     "Display failure","LCD cable;LCD panel;GPU driver",45,85.0,"Intermediate"),
    ("laptop","HP","Universal","vertical lines on screen horizontal lines display",
     "Display failure","LCD panel;LCD cable;GPU",60,85.0,"Intermediate"),
    ("laptop","HP","Universal","screen has white pink green tint color issue",
     "Display failure","LCD panel;Color profile;Inverter",45,80.0,"Intermediate"),
    ("laptop","HP","Universal","screen dim but not black backlight faint image flashlight",
     "Backlight failure","LCD panel;Backlight;Motherboard fuse",60,80.0,"Intermediate"),
    ("laptop","HP","Universal","screen shows random artifacts glitches pixel distortion",
     "GPU failure","GPU;VRAM;GPU driver;Thermal paste",90,65.0,"Advanced"),
    ("laptop","HP","Universal","external monitor works internal screen completely black",
     "Display failure","LCD panel;LCD cable;Lid sensor",60,88.0,"Intermediate"),
    ("laptop","HP","Universal","screen goes black when moving lid opening closing",
     "LCD cable failure","LCD cable;Hinge",45,90.0,"Intermediate"),
    ("laptop","HP","Universal","screen cracked broken physically damaged display",
     "Screen damage","LCD panel",60,95.0,"Intermediate"),
    ("laptop","HP","Universal","dead pixels small black white dots on screen",
     "Screen damage","LCD panel",30,90.0,"Intermediate"),
    ("laptop","HP","Universal","both internal and external screen black caps lock responds",
     "GPU failure","GPU;Motherboard chipset",120,45.0,"Advanced"),

    # ── RAM / Memory ──────────────────────────────────────────────────────────
    ("laptop","HP","Universal","random restarts no blue screen no warning",
     "RAM failure","RAM;Cooling system",30,85.0,"Beginner"),
    ("laptop","HP","Universal","frequent blue screens different error codes each time",
     "RAM failure","RAM;RAM slot",30,88.0,"Intermediate"),
    ("laptop","HP","Universal","Windows shows less RAM than installed memory missing",
     "RAM failure","RAM;RAM slot;32-bit OS",15,90.0,"Beginner"),
    ("laptop","HP","Universal","laptop boots but freezes under load heavy use",
     "RAM failure","RAM;Cooling;RAM slot",45,82.0,"Intermediate"),
    ("laptop","HP","Universal","BIOS detects RAM Windows crashes on startup",
     "RAM failure","RAM;Chipset drivers",60,78.0,"Intermediate"),

    # ── Storage (HDD / SSD) ───────────────────────────────────────────────────
    ("laptop","HP","Universal","clicking grinding noise from hard drive",
     "Storage failure","HDD;SATA cable",60,85.0,"Intermediate"),
    ("laptop","HP","Universal","very slow performance 100% disk usage all the time",
     "Storage failure","HDD;SSD;File system",90,85.0,"Intermediate"),
    ("laptop","HP","Universal","files randomly corrupt or disappear bad sectors",
     "Storage failure","HDD;SSD;File system",120,75.0,"Intermediate"),
    ("laptop","HP","Universal","laptop freezes for seconds at a time intermittent hang",
     "Storage failure","HDD;SSD;SATA cable",60,80.0,"Intermediate"),
    ("laptop","HP","Universal","BIOS does not detect any drive storage not found",
     "Storage failure","HDD;SSD;SATA port;SATA cable",60,80.0,"Intermediate"),
    ("laptop","HP","Universal","SMART hard disk error warning on boot",
     "Storage failure","HDD;SSD",30,85.0,"Beginner"),
    ("laptop","HP","Universal","NVMe SSD not detected M.2 not found",
     "Storage failure","NVMe SSD;BIOS settings;M.2 slot",45,82.0,"Intermediate"),

    # ── Battery & Charging ────────────────────────────────────────────────────
    ("laptop","HP","Universal","plugged in not charging 0% stays battery not charging",
     "Battery failure","Battery;Charger;EC controller",30,85.0,"Beginner"),
    ("laptop","HP","Universal","battery drains very fast 30 minutes or less",
     "Battery failure","Battery",15,95.0,"Beginner"),
    ("laptop","HP","Universal","laptop only works when plugged in battery completely dead",
     "Battery failure","Battery;Charging circuit",30,90.0,"Beginner"),
    ("laptop","HP","Universal","laptop shuts down at 20 30 percent battery level",
     "Battery failure","Battery;Battery calibration",15,90.0,"Beginner"),
    ("laptop","HP","Universal","swollen battery puffed up trackpad bulging lifting",
     "Battery failure","Battery",15,98.0,"Beginner"),
    ("laptop","HP","Universal","charging LED blinking orange white flashing",
     "Battery failure","Battery;Charger;EC controller",30,80.0,"Beginner"),
    ("laptop","HP","Universal","laptop very hot while charging overcharging",
     "Battery failure","Battery;Motherboard charging circuit",45,75.0,"Intermediate"),
    ("laptop","HP","Universal","battery percentage jumps from 60 to 10 instantly drops",
     "Battery failure","Battery;Dead cells",15,92.0,"Beginner"),

    # ── Thermal & Fan ─────────────────────────────────────────────────────────
    ("laptop","HP","Universal","fan always running at maximum speed loud noise",
     "Cooling system failure","Fan;Vents;Thermal paste;Malware",45,90.0,"Beginner"),
    ("laptop","HP","Universal","fan makes grinding rattling noise bearing worn",
     "Cooling system failure","Fan",30,90.0,"Beginner"),
    ("laptop","HP","Universal","fan never spins not working dead fan",
     "Cooling system failure","Fan;Fan connector;BIOS",30,88.0,"Intermediate"),
    ("laptop","HP","Universal","laptop suddenly shuts down under load gaming thermal trip",
     "Cooling system failure","Fan;Heat sink;Thermal paste",45,90.0,"Intermediate"),
    ("laptop","HP","Universal","laptop is hot even when idle high idle temperature",
     "Cooling system failure","Thermal paste;Fan;Malware;Battery",45,85.0,"Intermediate"),
    ("laptop","HP","Universal","laptop throttles slows down during gaming performance drop",
     "Thermal throttling","CPU;Thermal paste;Fan;Cooling pad",45,85.0,"Intermediate"),
    ("laptop","HP","Universal","hot air from vents but fan not spinning overheating",
     "Cooling system failure","Fan;Fan connector",30,88.0,"Intermediate"),

    # ── Keyboard, Trackpad & USB ──────────────────────────────────────────────
    ("laptop","HP","Universal","specific keys not working keyboard partial failure",
     "Keyboard failure","Keyboard;Ribbon cable;Top cover",45,90.0,"Intermediate"),
    ("laptop","HP","Universal","keyboard types random letters wrong characters",
     "Keyboard failure","Keyboard;Modifier keys;Liquid damage",30,85.0,"Beginner"),
    ("laptop","HP","Universal","keyboard backlight not lighting up not working",
     "Keyboard failure","Keyboard;Keyboard driver;Fn key",15,90.0,"Beginner"),
    ("laptop","HP","Universal","trackpad not moving cursor not responding",
     "Trackpad failure","Trackpad;Trackpad cable;Driver",30,88.0,"Beginner"),
    ("laptop","HP","Universal","trackpad buttons stuck not clicking physical damage",
     "Trackpad failure","Trackpad;Battery;Palmrest",30,85.0,"Beginner"),
    ("laptop","HP","Universal","USB port not working no device detected",
     "USB failure","USB port;Chipset driver;Motherboard",30,85.0,"Beginner"),
    ("laptop","HP","Universal","USB device disconnects randomly keeps dropping connection",
     "USB failure","USB port;Power settings;USB selective suspend",15,90.0,"Beginner"),

    # ── Audio ─────────────────────────────────────────────────────────────────
    ("laptop","HP","Universal","no sound from speakers headphones work fine",
     "Audio failure","Speakers;Audio cable;Audio driver",30,85.0,"Beginner"),
    ("laptop","HP","Universal","no sound from headphones speakers work fine audio jack",
     "Audio failure","Headphone jack;Audio sensor;Audio driver",15,90.0,"Beginner"),
    ("laptop","HP","Universal","crackling distorted sound audio quality bad",
     "Audio failure","Speakers;Realtek driver;Audio enhancements",30,85.0,"Beginner"),
    ("laptop","HP","Universal","microphone not working no mic input privacy",
     "Audio failure","Microphone;Privacy settings;Audio driver",15,90.0,"Beginner"),
    ("laptop","HP","Universal","no audio output device installed error",
     "Audio failure","Audio driver;Motherboard audio chip",30,75.0,"Intermediate"),

    # ── Wi-Fi & Bluetooth ─────────────────────────────────────────────────────
    ("laptop","HP","Universal","wifi adapter not detected no wireless networks",
     "Network failure","Wifi card;Driver;Airplane mode",30,85.0,"Intermediate"),
    ("laptop","HP","Universal","wifi connects but no internet access",
     "Network failure","DNS;IP configuration;Router",15,90.0,"Beginner"),
    ("laptop","HP","Universal","wifi keeps disconnecting drops connection frequently",
     "Network failure","Wifi driver;Power management;Wifi card",15,88.0,"Beginner"),
    ("laptop","HP","Universal","bluetooth not finding devices pairing fails",
     "Network failure","Bluetooth driver;Bluetooth toggle;Antenna",15,88.0,"Beginner"),
    ("laptop","HP","Universal","very slow wifi poor wireless speed",
     "Network failure","Wifi driver;Frequency band;Wifi card",15,85.0,"Beginner"),

    # ── BIOS & Firmware ───────────────────────────────────────────────────────
    ("laptop","HP","Universal","BIOS update stuck at 0 percent or 100 percent",
     "BIOS corruption","BIOS chip;USB recovery",60,70.0,"Advanced"),
    ("laptop","HP","Universal","laptop won't boot after BIOS update bricked",
     "BIOS corruption","BIOS chip;USB Win+B recovery",60,75.0,"Advanced"),
    ("laptop","HP","Universal","secure boot prevents booting from USB drive",
     "BIOS configuration","BIOS settings;Secure boot",15,95.0,"Beginner"),
    ("laptop","HP","Universal","legacy boot option missing CSM not available",
     "BIOS configuration","BIOS settings;CSM;Legacy support",15,95.0,"Beginner"),
    ("laptop","HP","Universal","TPM not detected BitLocker recovery key required",
     "BIOS configuration","TPM;BIOS settings;Microsoft account",30,88.0,"Intermediate"),

    # ── Physical & Liquid Damage ──────────────────────────────────────────────
    ("laptop","HP","Universal","liquid spilled on laptop water damage",
     "Liquid damage","Motherboard;Keyboard;Battery;Isopropyl alcohol",120,60.0,"Advanced"),
    ("laptop","HP","Universal","broken hinge cracked hinge loose lid",
     "Physical damage","Hinge assembly;LCD cable;Lid",60,85.0,"Intermediate"),
    ("laptop","HP","Universal","broken charging port DC jack loose wobbling",
     "DC jack failure","DC jack;Motherboard",90,80.0,"Advanced"),
    ("laptop","HP","Universal","laptop fell dropped won't turn on",
     "Motherboard failure","Motherboard;RAM;SSD",120,50.0,"Advanced"),
    ("laptop","HP","Universal","cracked palmrest broken bottom case physical",
     "Physical damage","Bottom cover;Palmrest;Screws",60,90.0,"Intermediate"),
]


def main():
    if not os.path.exists(CSV_PATH):
        print(f"ERROR: CSV not found at {CSV_PATH}")
        return

    # Read existing rows to avoid duplicates
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        existing = f.read()

    added = 0
    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for rec in HP_RECORDS:
            # Skip if exact symptom text already in file
            if rec[3] in existing:
                continue
            writer.writerow(rec)
            added += 1

    print(f"Done. Added {added} HP training records to {CSV_PATH}")


if __name__ == "__main__":
    main()
