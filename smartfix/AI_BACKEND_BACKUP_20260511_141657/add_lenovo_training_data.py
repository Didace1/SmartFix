"""
Script to append Lenovo universal fault training data to the existing CSV.
Covers ThinkPad, IdeaPad, Legion, Yoga, ThinkBook.
Run once: python add_lenovo_training_data.py
"""
import csv
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "raw", "comprehensive_training_data_fixed.csv")

LENOVO_RECORDS = [
    # ── Power Button Blink Codes ──────────────────────────────────────────────
    ("laptop","Lenovo","Universal","power button 1 blink CPU processor failure soldered",
     "CPU failure","CPU;Motherboard",120,40.0,"Advanced"),
    ("laptop","Lenovo","Universal","power button 2 blinks motherboard system board failure",
     "Motherboard failure","Motherboard;System board",120,45.0,"Advanced"),
    ("laptop","Lenovo","Universal","power button 3 blinks RAM memory not detected",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","Lenovo","Universal","power button 4 blinks all RAM sticks failed memory subsystem",
     "RAM failure","RAM;Motherboard",30,80.0,"Intermediate"),
    ("laptop","Lenovo","Universal","power button 5 blinks CMOS battery RTC failure",
     "CMOS battery failure","CMOS battery;RTC circuit",15,95.0,"Beginner"),
    ("laptop","Lenovo","Universal","power button 6 blinks video GPU graphics chip failure",
     "GPU failure","GPU;LCD panel;Motherboard",120,50.0,"Advanced"),
    ("laptop","Lenovo","Universal","power button 7 blinks LCD failure backlight panel cable",
     "Display failure","LCD panel;LCD cable;Backlight",60,85.0,"Intermediate"),
    ("laptop","Lenovo","Universal","power button 8 blinks battery failure charging IC",
     "Battery failure","Battery;Motherboard charging IC",30,85.0,"Beginner"),
    ("laptop","Lenovo","Universal","power button 9 blinks power rail short voltage regulator",
     "Motherboard failure","Motherboard;Voltage regulator",120,40.0,"Advanced"),
    ("laptop","Lenovo","Universal","power button 10 blinks touchpad trackpad failure cable",
     "Trackpad failure","Trackpad;Trackpad cable",30,88.0,"Beginner"),
    ("laptop","Lenovo","Universal","power button continuous blinking power delivery issue charger",
     "Power supply failure","Charger;DC jack;Battery;Motherboard",45,70.0,"Intermediate"),
    ("laptop","Lenovo","Universal","power button fast blinking EC embedded controller crash firmware",
     "BIOS corruption","EC firmware;Reset hole",30,75.0,"Intermediate"),

    # ── Beep Codes ────────────────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","1 beep pause 3 beeps RAM not detected memory error",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","Lenovo","Universal","1 beep pause 4 beeps battery critically low",
     "Battery failure","Battery;Charger",15,95.0,"Beginner"),
    ("laptop","Lenovo","Universal","2 beeps CMOS battery error RTC",
     "CMOS battery failure","CMOS battery",15,95.0,"Beginner"),
    ("laptop","Lenovo","Universal","3 beeps motherboard failure system board",
     "Motherboard failure","Motherboard",120,45.0,"Advanced"),
    ("laptop","Lenovo","Universal","4 beeps RAM failure read write error memory",
     "RAM failure","RAM;RAM slot",30,85.0,"Beginner"),
    ("laptop","Lenovo","Universal","5 beeps real time clock failure CMOS",
     "CMOS battery failure","CMOS battery;RTC circuit",15,95.0,"Beginner"),
    ("laptop","Lenovo","Universal","6 beeps video GPU graphics failure",
     "GPU failure","GPU;Motherboard",120,50.0,"Advanced"),
    ("laptop","Lenovo","Universal","7 beeps CPU processor failure",
     "CPU failure","CPU;Motherboard",120,40.0,"Advanced"),
    ("laptop","Lenovo","Universal","8 beeps LCD display failure panel cable",
     "Display failure","LCD panel;LCD cable",60,88.0,"Intermediate"),
    ("laptop","Lenovo","Universal","9 beeps power system failure charger motherboard",
     "Power supply failure","Charger;Motherboard",60,65.0,"Advanced"),

    # ── Novo Button & Recovery ────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","Novo button not responding laptop dead no menu appears",
     "Power supply failure","Charger;DC jack;Battery;EC firmware",45,75.0,"Intermediate"),
    ("laptop","Lenovo","Universal","Novo button menu appears but system recovery fails OneKey",
     "Software issue","OneKey Recovery;OS;SSD",60,75.0,"Intermediate"),
    ("laptop","Lenovo","Universal","use Novo button pinhole to access BIOS recovery diagnostics",
     "BIOS corruption","BIOS;Novo button;USB recovery",30,80.0,"Intermediate"),

    # ── Power-On Failures ─────────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","absolutely dead no lights no fan no power Lenovo",
     "Power supply failure","Power adapter;DC jack;Battery;EC firmware",60,75.0,"Intermediate"),
    ("laptop","Lenovo","Universal","power button blinks but no boot no POST Lenovo",
     "RAM failure","RAM;BIOS;CPU",45,78.0,"Intermediate"),
    ("laptop","Lenovo","Universal","turns on fans spin screen completely black no display",
     "RAM failure","RAM;LCD panel;GPU;BIOS",60,78.0,"Intermediate"),
    ("laptop","Lenovo","Universal","powers on shuts off after 3 seconds short circuit VRM",
     "Motherboard failure","Motherboard;VRM;CPU",90,55.0,"Advanced"),
    ("laptop","Lenovo","Universal","boot loop turns on off repeatedly corrupt BIOS",
     "BIOS corruption","BIOS;Power IC;Motherboard",60,65.0,"Advanced"),
    ("laptop","Lenovo","Universal","Lenovo logo appears then black screen drive OS",
     "Boot failure","OS;HDD;SSD;Lenovo diagnostics",60,80.0,"Intermediate"),
    ("laptop","Lenovo","Universal","hard reset reset hole paperclip bottom case crescent icon",
     "Power supply failure","EC firmware;Battery;Charger",30,80.0,"Beginner"),

    # ── ThinkPad Specific ─────────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","fan error on boot ThinkPad CPU fan not spinning",
     "Cooling system failure","Fan;Heatsink",30,90.0,"Beginner"),
    ("laptop","Lenovo","Universal","thermal sensing error on boot ThinkPad temperature sensor",
     "Motherboard failure","Temperature sensor;Motherboard",120,45.0,"Advanced"),
    ("laptop","Lenovo","Universal","unauthorized network card ThinkPad whitelist Wi-Fi",
     "Network failure","Wifi card;Lenovo FRU card",15,95.0,"Beginner"),
    ("laptop","Lenovo","Universal","machine type serial number invalid motherboard replaced HMD",
     "BIOS corruption","Motherboard;Lenovo HMD tool;Serial number",60,70.0,"Advanced"),
    ("laptop","Lenovo","Universal","TrackPoint red dot not working ThinkPad driver BIOS disabled",
     "Keyboard failure","TrackPoint;BIOS settings;Keyboard driver",15,90.0,"Beginner"),

    # ── IdeaPad Hinge (Very Common) ───────────────────────────────────────────
    ("laptop","Lenovo","Universal","broken hinge IdeaPad cracked plastic mount very common",
     "Physical damage","Hinge assembly;Lid assembly;Back cover",60,85.0,"Intermediate"),
    ("laptop","Lenovo","Universal","loose hinge lid wobbles IdeaPad hinge mount cracked",
     "Physical damage","Hinge assembly;Back cover",60,85.0,"Intermediate"),

    # ── Yoga Specific (LCD cable) ─────────────────────────────────────────────
    ("laptop","Lenovo","Universal","Yoga screen goes black when rotating flipping convertible",
     "LCD cable failure","LCD cable;Hinge",45,88.0,"Intermediate"),
    ("laptop","Lenovo","Universal","Yoga screen flickering when rotating lid hinge cable tear",
     "LCD cable failure","LCD cable;Hinge",45,88.0,"Intermediate"),
    ("laptop","Lenovo","Universal","touchscreen not working Yoga IdeaPad touch driver cable",
     "Trackpad failure","Touch driver;Touch cable;Digitizer",30,85.0,"Intermediate"),
    ("laptop","Lenovo","Universal","Yoga touchscreen dead stops responding driver update",
     "Trackpad failure","Touch driver;Touch cable;Lenovo Vantage",30,85.0,"Intermediate"),

    # ── Legion Gaming Specific ────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","Legion overheating thermal throttling gaming performance drop",
     "Thermal throttling","CPU;GPU;Thermal paste;Fan;Cooling pad",45,85.0,"Intermediate"),
    ("laptop","Lenovo","Universal","Legion GPU failure dead graphics gaming laptop",
     "GPU failure","GPU;Thermal paste;Motherboard",120,50.0,"Advanced"),
    ("laptop","Lenovo","Universal","Legion fan very loud gaming laptop thermal paste dry",
     "Cooling system failure","Fan;Thermal paste;Heat sink",45,88.0,"Intermediate"),

    # ── RAM / Memory ──────────────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","3 blinks Lenovo RAM not detected reseat memory",
     "RAM failure","RAM;RAM slot",30,90.0,"Beginner"),
    ("laptop","Lenovo","Universal","Windows shows less RAM than installed Lenovo slot bad",
     "RAM failure","RAM;RAM slot",15,90.0,"Beginner"),
    ("laptop","Lenovo","Universal","random blue screens different error codes Lenovo memory",
     "RAM failure","RAM;RAM slot",30,88.0,"Intermediate"),
    ("laptop","Lenovo","Universal","freezes at Lenovo logo splash screen RAM BIOS",
     "RAM failure","RAM;BIOS;RAM slot",30,85.0,"Intermediate"),
    ("laptop","Lenovo","Universal","laptop boots freezes under heavy load RAM Lenovo",
     "RAM failure","RAM;Cooling;RAM slot",45,82.0,"Intermediate"),

    # ── Storage (HDD / SSD) ───────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","boot device not found black screen no OS Lenovo",
     "Storage failure","HDD;SSD;BIOS boot order",60,85.0,"Intermediate"),
    ("laptop","Lenovo","Universal","operating system not found corrupt bootloader Lenovo",
     "Boot failure","OS;Bootloader;HDD",60,85.0,"Intermediate"),
    ("laptop","Lenovo","Universal","clicking grinding noise hard drive Lenovo",
     "Storage failure","HDD;SATA cable",60,85.0,"Intermediate"),
    ("laptop","Lenovo","Universal","very slow boot 5 minutes Lenovo diagnostics hard drive test",
     "Storage failure","HDD;SSD;Startup items",90,80.0,"Intermediate"),
    ("laptop","Lenovo","Universal","NVMe SSD not detected Intel RST RAID AHCI SATA mode Lenovo",
     "Storage failure","NVMe SSD;BIOS SATA mode;Intel RST;M.2 slot",45,82.0,"Intermediate"),
    ("laptop","Lenovo","Universal","SMART error on boot drive predicted to fail Lenovo",
     "Storage failure","HDD;SSD",30,85.0,"Beginner"),
    ("laptop","Lenovo","Universal","hard drive not detected error message Lenovo BIOS F1",
     "Storage failure","HDD;SSD;SATA cable;BIOS",60,82.0,"Intermediate"),

    # ── Display & Graphics ────────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","screen flickering Yoga flip hinge slowly cable",
     "LCD cable failure","LCD cable;Hinge",45,88.0,"Intermediate"),
    ("laptop","Lenovo","Universal","vertical horizontal lines screen press bezel Lenovo",
     "Display failure","LCD panel;LCD cable",60,85.0,"Intermediate"),
    ("laptop","Lenovo","Universal","screen dim backlight failure flashlight image Lenovo",
     "Backlight failure","LCD panel;Backlight;Motherboard fuse",60,80.0,"Intermediate"),
    ("laptop","Lenovo","Universal","external monitor works internal screen black Lenovo",
     "Display failure","LCD panel;LCD cable;Lid sensor",60,88.0,"Intermediate"),
    ("laptop","Lenovo","Universal","screen pressure marks white spots physical damage Lenovo",
     "Screen damage","LCD panel",45,90.0,"Intermediate"),
    ("laptop","Lenovo","Universal","screen goes black moving lid hinge cable Lenovo",
     "LCD cable failure","LCD cable;Hinge",45,90.0,"Intermediate"),
    ("laptop","Lenovo","Universal","7 blinks LCD failure panel cable Lenovo",
     "Display failure","LCD panel;LCD cable",60,88.0,"Intermediate"),
    ("laptop","Lenovo","Universal","screen cracked broken Lenovo IdeaPad ThinkPad",
     "Screen damage","LCD panel",60,95.0,"Intermediate"),

    # ── Battery & Charging ────────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","plugged in not charging Lenovo center pin charger",
     "Battery failure","Battery;Charger;EC controller",30,85.0,"Beginner"),
    ("laptop","Lenovo","Universal","battery not detected Windows Lenovo connector EC frozen",
     "Battery failure","Battery;Battery connector;EC controller",30,85.0,"Beginner"),
    ("laptop","Lenovo","Universal","Lenovo Vantage battery not genuine non-original aftermarket",
     "Battery failure","Battery;Lenovo Vantage",15,95.0,"Beginner"),
    ("laptop","Lenovo","Universal","battery stops charging at 55 60 80 percent Conservation Mode Vantage",
     "Battery failure","Battery;Lenovo Vantage Conservation Mode",15,98.0,"Beginner"),
    ("laptop","Lenovo","Universal","swollen battery puffed up Lenovo trackpad case bulging",
     "Battery failure","Battery",15,98.0,"Beginner"),
    ("laptop","Lenovo","Universal","laptop only works plugged in battery completely dead Lenovo",
     "Battery failure","Battery;Charging circuit;Motherboard",30,88.0,"Beginner"),
    ("laptop","Lenovo","Universal","8 blinks battery failure Lenovo power button LED",
     "Battery failure","Battery;Motherboard charging IC",30,85.0,"Beginner"),
    ("laptop","Lenovo","Universal","battery drains fast 30 minutes Lenovo Vantage health check",
     "Battery failure","Battery;Lenovo Vantage",15,95.0,"Beginner"),

    # ── Thermal & Fan ─────────────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","fan error boot message ThinkPad fan not spinning dead",
     "Cooling system failure","Fan;Heatsink",30,90.0,"Beginner"),
    ("laptop","Lenovo","Universal","fan loud constantly dust clog Lenovo vents blocked",
     "Cooling system failure","Fan;Vents;Thermal paste",45,90.0,"Beginner"),
    ("laptop","Lenovo","Universal","fan rattling grinding noise worn bearing Lenovo Legion",
     "Cooling system failure","Fan",30,90.0,"Beginner"),
    ("laptop","Lenovo","Universal","laptop very hot fan never spins dead Lenovo",
     "Cooling system failure","Fan;Fan connector",30,88.0,"Intermediate"),
    ("laptop","Lenovo","Universal","sudden shutdown gaming thermal trip Lenovo Legion",
     "Cooling system failure","Fan;Heat sink;Thermal paste",45,90.0,"Intermediate"),
    ("laptop","Lenovo","Universal","thermal sensing error boot ThinkPad sensor motherboard",
     "Motherboard failure","Temperature sensor;Motherboard",120,45.0,"Advanced"),

    # ── Keyboard, Trackpad & Ports ────────────────────────────────────────────
    ("laptop","Lenovo","Universal","specific keys not working Lenovo ThinkPad keyboard removable",
     "Keyboard failure","Keyboard;Ribbon cable;Top cover",45,90.0,"Intermediate"),
    ("laptop","Lenovo","Universal","keyboard backlight not working Fn Space Lenovo Vantage",
     "Keyboard failure","Keyboard;Keyboard driver;Fn key",15,90.0,"Beginner"),
    ("laptop","Lenovo","Universal","trackpad not responding disabled Fn F6 Fn F10 ThinkPad IdeaPad",
     "Trackpad failure","Trackpad;Trackpad cable;Driver",30,88.0,"Beginner"),
    ("laptop","Lenovo","Universal","USB port not working Lenovo chipset driver dead port",
     "USB failure","USB port;Chipset driver;Motherboard",30,85.0,"Beginner"),
    ("laptop","Lenovo","Universal","USB-C port not charging no display Lenovo firmware update",
     "USB failure","USB-C port;USB-C firmware;Motherboard",45,75.0,"Advanced"),
    ("laptop","Lenovo","Universal","headphone jack not working Lenovo audio jack sensor",
     "Audio failure","Headphone jack;Audio sensor;Realtek driver",15,90.0,"Beginner"),

    # ── Audio ─────────────────────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","no sound speakers Lenovo audio not working driver",
     "Audio failure","Speakers;Audio driver;Realtek",30,85.0,"Beginner"),
    ("laptop","Lenovo","Universal","microphone not working Lenovo privacy settings driver",
     "Audio failure","Microphone;Privacy settings;Audio driver",15,90.0,"Beginner"),
    ("laptop","Lenovo","Universal","crackling distorted audio Lenovo speaker driver",
     "Audio failure","Speakers;Realtek driver;Audio enhancements",30,85.0,"Beginner"),

    # ── Wi-Fi, Bluetooth & Network ────────────────────────────────────────────
    ("laptop","Lenovo","Universal","wifi adapter not detected Fn F8 airplane mode driver Lenovo",
     "Network failure","Wifi card;Driver;Airplane mode",30,85.0,"Intermediate"),
    ("laptop","Lenovo","Universal","wifi keeps disconnecting power management Lenovo driver",
     "Network failure","Wifi driver;Power management",15,88.0,"Beginner"),
    ("laptop","Lenovo","Universal","bluetooth not working service driver Lenovo",
     "Network failure","Bluetooth driver;Bluetooth service",15,88.0,"Beginner"),
    ("laptop","Lenovo","Universal","unauthorized network card ThinkPad Wi-Fi whitelist FRU",
     "Network failure","Wifi card;Lenovo FRU authorized card",15,95.0,"Beginner"),
    ("laptop","Lenovo","Universal","Killer wifi slow Legion gaming driver suite",
     "Network failure","Killer Wifi driver;Killer performance suite",15,88.0,"Beginner"),

    # ── BIOS & Firmware ───────────────────────────────────────────────────────
    ("laptop","Lenovo","Universal","BIOS update failed Lenovo Novo button recovery BIOS.CAP USB",
     "BIOS corruption","BIOS;USB BIOS.CAP recovery;Novo button",60,70.0,"Advanced"),
    ("laptop","Lenovo","Universal","real time clock error CMOS battery dead Lenovo",
     "CMOS battery failure","CMOS battery;RTC circuit",15,95.0,"Beginner"),
    ("laptop","Lenovo","Universal","secure boot prevents USB boot Lenovo F1 BIOS security",
     "BIOS configuration","BIOS settings;Secure boot",15,95.0,"Beginner"),
    ("laptop","Lenovo","Universal","TPM not detected BitLocker key Lenovo BIOS security",
     "BIOS configuration","TPM;BIOS settings;Microsoft account",30,88.0,"Intermediate"),
    ("laptop","Lenovo","Universal","system security invalid password HDD BIOS Lenovo locked",
     "BIOS configuration","BIOS password;HDD password;Motherboard",60,40.0,"Advanced"),
    ("laptop","Lenovo","Universal","battery cannot be identified non-genuine Lenovo Vantage warning",
     "Battery failure","Battery;Lenovo Vantage",15,95.0,"Beginner"),

    # ── Physical & Liquid Damage ──────────────────────────────────────────────
    ("laptop","Lenovo","Universal","liquid spilled water damage Lenovo ThinkPad drain holes",
     "Liquid damage","Motherboard;Keyboard;Battery;Isopropyl alcohol",120,60.0,"Advanced"),
    ("laptop","Lenovo","Universal","broken hinge IdeaPad Yoga cracked plastic mounts common",
     "Physical damage","Hinge assembly;Lid assembly;Back cover",60,85.0,"Intermediate"),
    ("laptop","Lenovo","Universal","cracked palmrest Lenovo dropped physical damage",
     "Physical damage","Palmrest;Bottom cover",60,90.0,"Intermediate"),
    ("laptop","Lenovo","Universal","broken DC jack soldered Lenovo charging port loose",
     "DC jack failure","DC jack;Motherboard",90,80.0,"Advanced"),
    ("laptop","Lenovo","Universal","broken USB-C port Yoga Lenovo physical damage microsoldering",
     "Physical damage","USB-C port;Motherboard",90,65.0,"Advanced"),
    ("laptop","Lenovo","Universal","laptop fell dropped Lenovo won't turn on cracked motherboard",
     "Motherboard failure","Motherboard;RAM;SSD",120,50.0,"Advanced"),
    ("laptop","Lenovo","Universal","screen cracked Yoga ThinkPad X1 Carbon expensive LCD",
     "Screen damage","LCD panel",60,95.0,"Intermediate"),
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
        for rec in LENOVO_RECORDS:
            if rec[3] in existing:
                continue
            writer.writerow(rec)
            added += 1

    print(f"Done. Added {added} Lenovo training records to {CSV_PATH}")


if __name__ == "__main__":
    main()
