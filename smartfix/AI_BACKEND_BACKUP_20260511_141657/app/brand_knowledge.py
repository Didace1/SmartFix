"""
Brand-specific fault knowledge base.
Maps (brand, fault) -> clear, step-by-step technician instructions.
Covers HP, Dell, Lenovo, Apple, ASUS, Acer.
"""
from typing import List, Dict

BRAND_DIAGNOSTIC_ENTRY: Dict[str, str] = {
    "HP":     "Run HP PC Hardware Diagnostics: press F2 at startup → Component Tests → select the failing area (Memory, Hard Drive, etc.).",
    "DELL":   "Run Dell ePSA Diagnostics: press F12 at startup → select 'Diagnostics'. Note any error code shown at the end.",
    "LENOVO": "Press the Novo Button (pinhole on bottom/side, laptop OFF) → select 'Diagnostics (F10)' to run Lenovo Hardware Diagnostics.",
    "APPLE":  "Run Apple Diagnostics: restart and hold D key (Intel Mac) or hold Power → Options → Cmd+D (Apple Silicon). Note the reference code (e.g. PPT001, PPM001).",
    "ASUS":   "Open MyASUS → Hardware Diagnostics, OR count the power LED blink pattern at startup and match to the ASUS blink code table.",
    "ACER":   "Listen for beep codes at startup and count the pattern (e.g. 1-3 = RAM, 1-6 = GPU, 8 = LCD). Press F2 to enter BIOS and verify hardware detection.",
    "SAMSUNG": "Open Samsung Members app → Get Help → Diagnostics → run all component tests (Battery, Screen, Touch, Sensor, Speaker, Camera).",
    "GOOGLE":  "Open Settings → About phone → tap 'Build number' 7 times to enable Developer options. Use Google Diagnostics or Pixel Diagnostics app.",
    "ONEPLUS": "Dial *#808# to enter diagnostic mode. Or open OnePlus Diagnostic in Settings → About phone → run component tests.",
    "XIAOMI":  "Dial *#*#6484#*#* (or *#*#64663#*#*) to open CIT hardware test menu. Test all components (screen, touch, speaker, camera, sensors).",
}

BRAND_HARD_RESET: Dict[str, str] = {
    "HP":     "HP hard reset: disconnect AC + battery → hold power 30 seconds → reconnect AC only (no battery) → power on.",
    "DELL":   "Dell power drain: disconnect AC + battery → hold power 30 seconds → reconnect AC only → power on.",
    "LENOVO": "Lenovo reset: insert paperclip into the bottom-case pinhole (crescent icon) for 10 seconds → reconnect AC → power on.",
    "APPLE":  "SMC reset (Intel T2): shut down → hold Power button 10 seconds → wait 5 seconds → power on. NVRAM reset: power on, immediately hold Option+Cmd+P+R for 20 seconds. (Apple Silicon: just restart.)",
    "ASUS":   "ASUS hard reset: disconnect AC → hold power button 40 seconds → reconnect AC → power on.",
    "ACER":   "Acer hard reset: disconnect AC + battery → hold power button 30 seconds → reconnect battery + AC → power on.",
    "SAMSUNG": "Samsung force restart: hold Power + Volume Down for 10-15 seconds until the phone vibrates and restarts.",
    "GOOGLE":  "Pixel force restart: hold Power button for 30 seconds until the phone restarts. For Pixel 6+: hold Power + Volume Up for 15 seconds.",
    "ONEPLUS": "OnePlus force restart: hold Power button for 10-15 seconds until the phone vibrates and reboots.",
    "XIAOMI":  "Xiaomi force restart: hold Power button for 15-20 seconds. If unresponsive, hold Power + Volume Up for 12 seconds.",
}

BRAND_BATTERY_FEATURE: Dict[str, str] = {
    "LENOVO": "Check Lenovo Vantage → Power → Battery → disable 'Conservation Mode' if ON (limits charge to 55-80% by design).",
    "ASUS":   "Open MyASUS → Battery Health Charging → switch to 'Full Capacity Mode'. Balanced/Maximum Lifespan modes cap at 80%/60% by design.",
    "ACER":   "Open Acer Care Center → Battery → disable 'Battery Health' if ON. This feature intentionally stops charging at 80%.",
    "DELL":   "Open Dell Power Manager → Battery → change from 'Primarily AC' (stops at 60%) to 'Standard' or 'ExpressCharge'.",
    "HP":     "Run HP Support Assistant → Battery Check. If wear is high, replacement is needed.",
    "APPLE":  "Check System Settings → Battery → Battery Health. Install coconutBattery to check exact cycle count (replace above 1000 cycles).",
}

BRAND_BIOS_RECOVERY: Dict[str, str] = {
    "HP":     "HP BIOS Recovery: FAT32 USB + BIOS file → hold Win+B while powering on → release when recovery starts.",
    "DELL":   "Dell BIOS Recovery: rename BIOS file to 'BIOS_IMG.rcv' on FAT32 USB → hold Ctrl+Esc while plugging in AC adapter.",
    "LENOVO": "Lenovo BIOS Recovery: rename BIOS file to 'BIOS.CAP' on FAT32 USB → press Fn+R+Power (or Novo Button → BIOS Recovery).",
    "APPLE":  "Apple firmware restore: use Apple Configurator 2 on a second Mac → DFU mode (hold Power + all keys 10 seconds) → Restore.",
    "ASUS":   "ASUS CrashFree BIOS 3: rename BIOS file to 'ASUS.CAP' on FAT32 USB → hold Ctrl+Home (or Fn+Esc) while pressing Power.",
    "ACER":   "Acer BIOS Recovery: rename BIOS file (check Acer support for exact name) on FAT32 USB → hold Fn+Esc while pressing Power.",
}

FAULT_BASE_ACTIONS: Dict[str, List[str]] = {
    "RAM failure": [
        "Remove all RAM sticks and reseat them firmly until both side clips click into place.",
        "Clean the gold contacts with a dry eraser to remove oxidation.",
        "Test each RAM stick individually in each slot to isolate the faulty module.",
        "Run Windows Memory Diagnostic (type 'mdsched' in Run dialog) or MemTest86 overnight.",
        "Replace the RAM stick that fails the memory test.",
    ],
    "Battery failure": [
        "Charge for at least 30 minutes with a known good original charger before concluding battery failure.",
        "Check the battery health percentage and cycle count in the brand's diagnostic software.",
        "If the battery is swollen (trackpad hard to click, case bulging) — stop charging immediately and replace as a priority.",
        "If battery stops at a fixed percentage (60%/80%), check the brand's battery management software first — this is often a software feature.",
        "Replace the battery if health is below 60% or cycle count is over the brand threshold (300 cycles for pre-2012 Mac, 1000 for modern).",
    ],
    "Power supply failure": [
        "Test with a known good charger of the correct wattage for this brand and model.",
        "Inspect the charging port for bent pins, debris, or physical damage.",
        "Perform the brand-specific hard reset (disconnect battery + AC, hold power 30-40 seconds).",
        "If the charger LED is off or dim, the charger itself is faulty — replace charger first.",
        "If no power after charger replacement and hard reset → motherboard power circuit failure.",
    ],
    "Cooling system failure": [
        "Blow compressed air through the exhaust vent (not into the intake) to clear dust from the fan and heatsink.",
        "Open the bottom cover and clean the fan blades and heatsink fins thoroughly.",
        "Replace the thermal paste on the CPU (and GPU if present) — use Thermal Grizzly Kryonaut or equivalent.",
        "Confirm the fan spins freely by hand — if it is stiff or noisy, replace the fan.",
        "After reassembly, run HWMonitor + Prime95 stress test to confirm temperatures stay under 90°C under load.",
    ],
    "Thermal throttling": [
        "Clean heatsink and fan vents with compressed air — clogged vents are the most common cause.",
        "Replace the CPU/GPU thermal paste (dries out after 2-3 years, especially on gaming laptops).",
        "In the brand's gaming software (Armoury Crate / PredatorSense / NitroSense / Lenovo Vantage), set the fan profile to 'Performance' or 'Turbo'.",
        "Use a cooling pad to lower the ambient temperature at the intake vents.",
        "Consider undervolting the CPU with Intel XTU or ThrottleStop to reduce heat without losing performance.",
    ],
    "Display failure": [
        "Connect to an external monitor (HDMI/VGA/USB-C) to determine if the issue is the LCD or the GPU/motherboard.",
        "If external monitor works normally: the internal LCD panel, backlight, or LCD cable is faulty.",
        "Gently press around the screen bezel — if lines or flickering changes, the LCD cable is loose; reseat it.",
        "Run the brand's built-in display test to isolate backlight failure from panel failure.",
        "Replace the LCD panel if reseating the cable does not resolve the issue.",
    ],
    "Backlight failure": [
        "Shine a flashlight at the screen at a low angle — if you can faintly see the desktop image, only the backlight is dead (panel is fine).",
        "Test with an external monitor to confirm the GPU is working.",
        "Replace the LCD panel (backlight is built into modern LCD panels and cannot be serviced separately).",
        "If a new panel is still dim, a backlight fuse on the motherboard may be blown — requires board-level repair.",
    ],
    "LCD cable failure": [
        "Slowly open and close the lid — if the screen flickers or goes black at a specific angle, the LCD cable is torn.",
        "On convertible models (Yoga, Spin, ZenBook Flip), this is very common from hinge rotation stress.",
        "Replace the LCD cable (runs through the hinge; separate from the panel on most models).",
        "On 2016-2018 MacBook Pro, the cable is integrated into the display assembly (Flexgate) — replace the full display assembly.",
    ],
    "Screen damage": [
        "Inspect the LCD panel closely — cracks, white pressure spots, and dead pixel clusters are signs of physical panel damage.",
        "Test with an external monitor to confirm the GPU and logic board are working normally.",
        "Order a replacement LCD panel that matches the exact screen resolution, size, and connector type for this model.",
        "Replace the LCD panel — on most laptops this does not require replacing the full lid assembly.",
    ],
    "Storage failure": [
        "Enter BIOS (F2/F10/Del) and check if the drive appears in the Storage or Boot section.",
        "Run the brand's built-in hard drive diagnostic test — it will confirm whether the drive is failing.",
        "Check the drive health using CrystalDiskInfo (Windows) — any 'Caution' or 'Bad' status means imminent failure.",
        "If the drive has bad sectors, back up all data immediately before it becomes unreadable.",
        "Replace the drive with a new SSD. If the new SSD is also not detected, check or replace the SATA cable / M.2 slot.",
    ],
    "Boot failure": [
        "Boot from a USB recovery drive (Windows install USB or brand recovery USB) to bypass the internal drive.",
        "Run 'chkdsk /r' and 'sfc /scannow' from the recovery command prompt to repair system files.",
        "If drive is detected but Windows fails to load, use 'bootrec /fixboot' and 'bootrec /fixmbr' commands.",
        "Run the brand's hard drive test to rule out physical drive failure.",
        "If drive passes all tests, reinstall the operating system.",
    ],
    "Motherboard failure": [
        "Remove all external peripherals, extra RAM sticks, and the SSD — try to power on with minimum hardware.",
        "Listen for beep codes or count LED blink patterns to identify the exact failing component on the board.",
        "Check for any burnt components, swollen capacitors, or corrosion on the motherboard surface.",
        "If the laptop was dropped or had liquid damage, inspect the board for cracks or corrosion under a magnifier.",
        "Motherboard replacement or professional board-level repair (reballing/microsoldering) is required.",
    ],
    "GPU failure": [
        "Connect an external monitor — if it works normally, the GPU is functional and the LCD/cable is the issue.",
        "If the external monitor also shows artifacts or is black, the GPU itself is failing.",
        "Run the brand's diagnostics to confirm GPU failure (Dell: 6 blinks; HP: 6 red blinks; Lenovo: 6 blinks).",
        "On gaming laptops (Legion, ROG, Predator), update or fully reinstall the GPU driver using DDU (Display Driver Uninstaller) first.",
        "If the GPU is soldered to the motherboard (most modern laptops), motherboard replacement is required.",
    ],
    "Keyboard failure": [
        "Test whether all keys fail or only specific ones — partial failure usually means liquid damage or debris.",
        "Blow compressed air under the keys to remove debris (for butterfly keyboards on 2016-2019 MacBook Pro, this is often sufficient).",
        "Connect an external USB keyboard to confirm the issue is the built-in keyboard and not the OS.",
        "On ThinkPads, the keyboard is replaceable without full disassembly. On most other laptops, it requires removing the top case.",
        "Replace the keyboard or top case assembly if cleaning does not resolve the issue.",
    ],
    "Trackpad failure": [
        "Check if the trackpad is disabled by a function key shortcut (Fn+F6/F7/F9/F10/F11 depending on brand).",
        "Check for a swollen battery pushing up against the trackpad from underneath — this is a very common cause.",
        "Reseat the trackpad ribbon cable (accessible from inside after removing the bottom cover).",
        "Update or reinstall the trackpad driver in Device Manager.",
        "Replace the trackpad assembly if reseating the cable and updating the driver does not work.",
    ],
    "USB failure": [
        "Test the port with multiple known-working USB devices to confirm the port is faulty.",
        "Disable USB Selective Suspend in Power Options (Power → Change plan settings → Advanced → USB settings).",
        "Update or reinstall the chipset and USB controller drivers.",
        "Inspect the port for bent or broken pins and debris — clean with a wooden toothpick.",
        "If physically damaged, the port requires microsoldering or motherboard replacement.",
    ],
    "Audio failure": [
        "Check that the volume is not muted and the correct audio output device is selected in sound settings.",
        "Update or fully reinstall the Realtek (or Cirrus/Apple) audio driver.",
        "Reset NVRAM (Apple Mac Intel) — this often fixes 'No output devices found' errors.",
        "If speakers crackle or distort, disable all audio enhancements in sound settings first.",
        "On 2016-2018 MacBook Pro, audio IC failure is common — requires audio chip reballing, not full motherboard replacement.",
        "Replace the speakers if driver reinstallation and settings changes do not restore sound.",
    ],
    "Network failure": [
        "Check that Airplane Mode is OFF (Fn+F2/F3/F8/F12 depending on brand).",
        "Forget the Wi-Fi network and reconnect — this resolves most 'connected but no internet' issues.",
        "Update the Wi-Fi driver from the chip manufacturer website (Intel, Realtek, Qualcomm, MediaTek) — not the OEM website.",
        "Disable 'Allow the computer to turn off this device to save power' in the Wi-Fi adapter's Power Management settings.",
        "If the Wi-Fi card is not detected at all, reseat the M.2 card inside the laptop.",
        "Replace the Wi-Fi card with an Intel AX210 (compatible with most HP, Dell, ASUS, Acer, Lenovo without whitelist restrictions).",
    ],
    "BIOS corruption": [
        "Perform a hard reset first (disconnect battery + AC, hold power 30-40 seconds) — minor corruption clears this way.",
        "Use the brand-specific BIOS recovery method with a FAT32 USB drive and the BIOS file from the manufacturer support website.",
        "Do NOT power off the laptop during BIOS recovery — let it complete fully even if it takes 10-15 minutes.",
        "If BIOS recovery fails, the BIOS chip may need physical reflashing with a programmer.",
    ],
    "BIOS configuration": [
        "Enter BIOS (F1/F2/Del at startup) and load default settings (usually F9 or 'Load Optimized Defaults').",
        "Verify the correct boot drive is set as #1 in the Boot Order section.",
        "Disable Secure Boot if trying to boot from an unsigned USB drive.",
        "Enable or disable Intel RST/VMD if an NVMe SSD is not being detected.",
        "Replace the CMOS battery (CR2032) if BIOS settings reset after every shutdown.",
    ],
    "CMOS battery failure": [
        "The CMOS battery is a small CR2032 coin cell — replace it to stop date/time and BIOS settings from resetting.",
        "Access it by removing the bottom cover. On ThinkPads it is easy to reach; on sealed ultrabooks it may require more disassembly.",
        "After replacement, set the correct date and time in BIOS, then save and exit.",
    ],
    "CPU failure": [
        "CPU failure is rare but serious. Confirm using the brand's diagnostics (Dell: 7 blinks; HP: 5 blinks; ASUS: 1 blink; Acer: 1-7 beeps).",
        "Check CPU temperature under load using HWMonitor — if temperatures reach 100°C+, thermal shutdown mimics CPU failure.",
        "Clean the heatsink and replace thermal paste before concluding the CPU has failed.",
        "On most modern laptops, the CPU is soldered to the motherboard — CPU failure means motherboard replacement.",
    ],
    "DC jack failure": [
        "Wiggle the charging cable gently — if the laptop charges in some positions but not others, the DC jack is loose.",
        "Inspect the jack for physical movement, bent pins, or burn marks.",
        "On older barrel-jack laptops: desolder the old jack and solder a new compatible replacement.",
        "On newer motherboard-integrated jacks: motherboard replacement or professional microsoldering is required.",
    ],
    "Physical damage": [
        "Inspect all hinge mounts, the lid assembly, and the bottom case for cracks — hinge failure is extremely common on Vivobook, Aspire, and IdeaPad models.",
        "Do not force the lid open past its natural range — this tears the LCD cable inside the hinge.",
        "Replace the hinge assembly or full lid assembly as required.",
        "After any physical repair, confirm all internal cables were not pinched or disconnected during the repair.",
    ],
    "Liquid damage": [
        "IMMEDIATELY disconnect the AC adapter and remove the battery (if accessible) — do not power on.",
        "Turn the laptop upside down to drain liquid out of the keyboard and away from the motherboard.",
        "Remove the bottom cover and disconnect the battery connector from the motherboard.",
        "Clean the motherboard and all connectors with 99% isopropyl alcohol and a soft brush.",
        "Leave disassembled to dry in a warm dry environment for at least 48-72 hours before attempting to power on.",
        "Assess motherboard for corrosion damage after drying — corroded components will need replacement.",
    ],
    "Touch failure": [
        "Clean the screen surface with a microfiber cloth — oils and moisture can interfere with touch digitizer readings.",
        "Remove any screen protector and test touch response — some thick protectors reduce sensitivity.",
        "Restart the phone in Safe Mode to rule out software/app interference with the touch layer.",
        "Run the built-in touch screen diagnostic test (Samsung Members, Pixel Diagnostics, or dialer codes).",
        "If only part of the screen is unresponsive, the digitizer flex cable or the display panel itself is damaged — replace the display assembly.",
    ],
    "Camera failure": [
        "Force-close the Camera app and clear its cache (Settings → Apps → Camera → Force stop → Clear cache).",
        "Check if another app is using the camera — restart the phone to release the camera resource.",
        "Test with a third-party camera app to rule out a software issue with the default camera.",
        "If the camera shows a black screen or 'Camera failed' error, the camera module may be disconnected — professional teardown required.",
        "Replace the faulty camera module (rear wide, ultrawide, and front cameras are separate modules on most phones).",
    ],
    "DC jack failure": [
        "Inspect the USB-C / Lightning port for lint, debris, or bent pins — clean with a wooden toothpick or compressed air.",
        "Test with a known-good cable and charger to rule out cable/adapter issues.",
        "Check for loose connection by gently wiggling the cable in the port — if charging drops, the port is worn.",
        "On most smartphones, the charging port is on a replaceable flex cable — order the correct part for your model.",
        "If the port is soldered to the mainboard (some flagships), professional microsoldering repair is required.",
    ],
    "Software issue": [
        "Boot into Safe Mode (Shift+Restart → Troubleshoot → Advanced → Startup Settings → F4) to isolate software vs hardware.",
        "Run System File Checker: open Command Prompt as admin → type 'sfc /scannow' → wait for completion.",
        "Check for recently installed drivers or Windows updates that may have caused the issue and roll them back.",
        "Run Windows Startup Repair from a USB recovery drive if the system will not boot to the desktop.",
        "As a last resort, reset Windows (Settings → Recovery → Reset this PC → Keep my files).",
    ],
}

BRAND_FAULT_HINTS: Dict[str, Dict[str, str]] = {
    "HP": {
        "RAM failure":          "HP indicator: 3 long blinks (or 3 red blinks) = RAM failure. Confirm with HP F2 → Component Tests → Memory.",
        "Battery failure":      "HP indicator: 'Plugged in, not charging' — perform HP hard reset first (30-sec power button). Then run HP Support Assistant → Battery Check.",
        "BIOS corruption":      "HP: download the exact BIOS file from HP support (search by product number, not model name). Ensure the USB drive is formatted as FAT32 — NTFS will not work for BIOS recovery.",
        "Cooling system failure": "HP indicator: 4 long blinks = CPU thermal shutdown. Clean fan and heatsink immediately.",
        "GPU failure":          "HP indicator: 6 blinks = GPU failure. Test external monitor first before replacing motherboard.",
        "Display failure":      "HP: run HP PC Hardware Diagnostics (F2) → Component Tests → Video → LCD test for built-in display test.",
        "Storage failure":      "HP: run HP PC Hardware Diagnostics (F2) → Component Tests → Hard Drive → Full test.",
        "Network failure":      "HP: update Wi-Fi driver from HP support page or directly from Intel/Realtek manufacturer site.",
    },
    "DELL": {
        "RAM failure":          "Dell indicator: 2 power button LED blinks = RAM failure. Run Dell ePSA (F12 → Diagnostics) → Memory test.",
        "Battery failure":      "Dell: check charger center pin — if 'Unknown' or 'No battery' in BIOS, reseat battery connector or replace battery.",
        "BIOS corruption":      "Dell BIOS recovery: rename file to 'BIOS_IMG.rcv' on FAT32 USB, hold Ctrl+Esc while plugging in AC adapter.",
        "Display failure":      "Dell: run LCD BIST — hold D key while pressing Power button. Color bars = LCD good. Black = LCD faulty.",
        "Cooling system failure": "Dell: check BIOS logs for 'Thermal Event'. Clean vents and repaste CPU/GPU.",
        "Storage failure":      "Dell: run ePSA (F12 → Diagnostics) → Hard Drive test. If test fails, replace drive immediately.",
        "GPU failure":          "Dell indicator: 6 power button LED blinks = GPU failure. External monitor test first.",
        "Network failure":      "Dell: update Wi-Fi driver from Intel or Killer (not Dell) website for best results.",
        "Keyboard failure":     "Dell: run Keyboard BIST — hold Fn key while pressing Power button. Each key press should register.",
    },
    "LENOVO": {
        "RAM failure":          "Lenovo indicator: 3 power button blinks = RAM failure. Remove all RAM → should beep. Add one stick at a time.",
        "Battery failure":      "Lenovo: check Lenovo Vantage → Power → Battery. Disable Conservation Mode if it is ON (limits to 55-80%).",
        "BIOS corruption":      "Lenovo BIOS recovery: rename BIOS file to 'BIOS.CAP' on FAT32 USB → press Fn+R+Power or use Novo Button.",
        "Cooling system failure": "ThinkPad: 'Fan error' on boot means the CPU fan is not spinning — replace fan immediately (laptop will not boot without it).",
        "Display failure":      "Lenovo: run Lenovo Diagnostics (F10 via Novo Button) → LCD Test — screen cycles through red/green/blue/white/black.",
        "Storage failure":      "Lenovo: run Lenovo Diagnostics (Novo Button → F10) → Hard Drive Test. Also change BIOS SATA mode from RAID to AHCI if NVMe not detected.",
        "Network failure":      "ThinkPad warning: only Lenovo FRU-authorized Wi-Fi cards work (whitelist). Replace with the correct FRU part number.",
        "Keyboard failure":     "ThinkPad: keyboard is field-replaceable without full disassembly — easier than other brands.",
        "GPU failure":          "Lenovo indicator: 6 power button blinks = GPU failure. External monitor test. Gaming laptops: update GPU driver via DDU first.",
    },
    "APPLE": {
        "RAM failure":          "Apple Diagnostics code PPM001 or PPM002 = RAM/memory controller failure. On Retina/modern Macs, RAM is soldered → motherboard replacement required.",
        "Battery failure":      "Apple: check System Settings → Battery → Battery Health. PPT001 = battery not detected; PPT002 = replace battery; PPT003 = not charging (reset SMC first).",
        "BIOS corruption":      "Apple T2 firmware corrupt: use Apple Configurator 2 on a second Mac. DFU mode: hold Power + all other keys 10 seconds on target Mac.",
        "Cooling system failure": "Apple: PPF001 = fan failure. Check Activity Monitor for CPU-heavy processes. Use Macs Fan Control to manually set fan speed.",
        "Display failure":      "Apple Flexgate (2016-2018 MacBook Pro): screen goes black past 45° or has stage-light effect at bottom → replace display assembly (cable is built into screen).",
        "Storage failure":      "Apple: PDS001 = SSD failure. Folder with question mark = SSD not detected. Boot to Recovery (Cmd+R) → Disk Utility to check.",
        "Keyboard failure":     "Apple Butterfly keyboard (2016-2019): use compressed air at an angle. Apple offers free keyboard replacement under the Keyboard Service Program for eligible models.",
        "Network failure":      "Apple: NDL001 = Wi-Fi not detected. Reset NVRAM (Option+Cmd+P+R) first. Then reseat or replace Wi-Fi card.",
        "Audio failure":        "Apple 2016-2018 MacBook Pro audio IC failure is common: 'No output devices found' — audio chip reballing needed, not full board replacement.",
        "GPU failure":          "Apple 2011 15-inch MacBook Pro has known AMD GPU failure — logic board replacement required. Run Apple Diagnostics first.",
    },
    "ASUS": {
        "RAM failure":          "ASUS indicator: 2 power LED blinks = RAM not detected. 4 blinks = all RAM failed. Reseat RAM and test slots.",
        "Battery failure":      "ASUS: check battery cycle count in MyASUS → System Info. ASUS batteries are rated for 500+ cycles. Replace if health is below 60% or battery is physically swollen.",
        "BIOS corruption":      "ASUS CrashFree BIOS 3: rename BIOS file to 'ASUS.CAP' on FAT32 USB → hold Ctrl+Home or Fn+Esc while pressing Power.",
        "Cooling system failure": "ASUS indicator: 7 power LED blinks = CPU thermal shutdown. Open Armoury Crate → fan settings. Clean heatsink and repaste CPU/GPU.",
        "Display failure":      "ASUS: use MyASUS → Hardware Diagnostics → Display Test. Also check OLED ZenBook models for burn-in — run pixel refresh in MyASUS.",
        "Storage failure":      "ASUS: change BIOS SATA Mode from RAID to AHCI (Advanced tab) if NVMe SSD is not detected.",
        "Network failure":      "ASUS: no Wi-Fi card whitelist — upgrade to Intel AX210 for significantly better performance than stock Realtek/MediaTek cards.",
        "Keyboard failure":     "ASUS ROG/TUF: keyboard backlight controlled by Fn+F3/F4. RGB controlled by Armoury Crate — reinstall if RGB is not working.",
        "Physical damage":      "ASUS Vivobook hinge failure is extremely common — the plastic hinge mounts crack. Replace the full lid assembly (back cover + hinge).",
        "GPU failure":          "ASUS indicator: 6 power LED blinks = GPU failure. Use DDU to cleanly uninstall GPU driver before reinstalling. If failure persists → motherboard.",
    },
    "ACER": {
        "RAM failure":          "Acer beep code 1-3 (1 beep, pause, 3 beeps) = RAM bank 1 failure. 1-4 = bank 2 failure. 2 beeps = RAM not detected. Reseat and test each slot.",
        "Battery failure":      "Acer: open Acer Care Center → Battery → disable 'Battery Health' feature if ON. This intentionally stops charging at 80%.",
        "BIOS corruption":      "Acer BIOS recovery: rename BIOS file (see Acer support for exact name) on FAT32 USB → hold Fn+Esc while pressing Power.",
        "Cooling system failure": "Acer Predator/Nitro: use PredatorSense or NitroSense to set fan to Maximum mode. Nitro fans commonly fail after 2-3 years — replacement fans are inexpensive.",
        "Display failure":      "Acer beep code 8 = LCD failure. Acer beep code 1-6 = GPU failure. Use external monitor to isolate LCD vs GPU.",
        "Storage failure":      "Acer: change BIOS SATA Mode from RAID/Intel RST to AHCI (Main tab) if NVMe SSD is not detected. Press Alt+F10 at boot for Acer Recovery Management.",
        "Network failure":      "Acer: no Wi-Fi whitelist — upgrade to Intel AX210 for best results. Predator models often have Killer Wi-Fi — uninstall Killer software suite, keep driver only.",
        "Physical damage":      "Acer Aspire hinge failure is extremely common — the plastic mounts crack. Replace the full lid assembly. Always open the lid from the center, not the corners.",
        "GPU failure":          "Acer beep code 1-6 = GPU failure. Predator/Nitro: run DDU → reinstall GPU driver before replacing hardware.",
        "CMOS battery failure": "Acer beep code 1-1 or 1-5 = CMOS/RTC failure. Replace the CR2032 coin cell battery inside the bottom case.",
        "Keyboard failure":     "Acer beep code 6 = keyboard controller failure. Reseat keyboard ribbon cable first. Replace keyboard if reseating fails.",
    },
    "SAMSUNG": {
        "Screen damage":        "Samsung: use original Samsung AMOLED replacement panels. Third-party OLED panels often have colour shift and lower brightness.",
        "Battery failure":      "Samsung: check Settings → Battery → Battery usage. Galaxy phones rated for 800+ charge cycles. Replace if health below 80% or battery is swollen.",
        "Touch failure":        "Samsung: if only edges are unresponsive on curved-screen models (S-series Ultra), recalibrate touch in Settings → Display → Touch sensitivity.",
        "Cooling system failure": "Samsung: close background apps via Device Care → Memory. Galaxy phones use vapour-chamber cooling — thermal pad replacement requires full teardown.",
        "Camera failure":       "Samsung: clear Camera app cache first (Settings → Apps → Camera → Clear cache). If issue persists, camera module replacement is needed.",
        "Audio failure":        "Samsung: test speakers in Samsung Members → Diagnostics → Speaker. Clean speaker grills with a soft brush. Replace speaker module if test fails.",
        "Network failure":      "Samsung: reset network settings (Settings → General management → Reset → Reset network settings). Check SIM tray for corrosion.",
        "DC jack failure":      "Samsung: USB-C charging port is soldered on most Galaxy models. Replace the charging port flex cable (includes microphone on most models).",
        "Liquid damage":        "Samsung: Galaxy S/Z series are IP68 rated but seals degrade after drops. If water indicator is red, open and clean with 99% isopropyl alcohol.",
        "Software issue":       "Samsung: boot into Recovery Mode (Power + Volume Up) → Wipe cache partition. If that fails, try Safe Mode (hold Volume Down during boot logo).",
        "Power supply failure":  "Samsung: hold Volume Down + Power for 10 seconds to force restart. If no response, check charging port and battery connector.",
    },
    "GOOGLE": {
        "Screen damage":        "Pixel: use Google-authorized replacement OLED panels. Pixel 6+ uses under-display fingerprint — display replacement must include new fingerprint calibration.",
        "Battery failure":      "Pixel: check Settings → Battery → Battery health. Pixel batteries are rated for 800 cycles. Pixel 6+ battery replacement requires heating the back glass.",
        "Touch failure":        "Pixel: run Pixel Diagnostics (Settings → About phone → Diagnostics). Touch issues on Pixel 6 Pro are often firmware — update to latest Android version.",
        "Camera failure":       "Google: Pixel camera bar is modular. Clear Google Camera app data. If hardware, replace the camera module (wide/ultrawide are separate modules).",
        "Network failure":      "Pixel: reset network settings in Settings → System → Reset → Reset Wi-Fi, mobile & Bluetooth. Pixel 6+ modem issues often fixed by software update.",
        "Software issue":       "Pixel: boot into Safe Mode (hold Power → long-press 'Power off' → tap 'OK'). Factory reset via Recovery (Power + Volume Down → select 'Recovery mode').",
        "Power supply failure":  "Pixel: hold Power for 30 seconds to force restart. Check USB-C port for lint or debris. Try a different USB-C cable and power adapter.",
        "Audio failure":        "Pixel: check adaptive sound in Settings → Sound → Adaptive Sound. Clean speaker grills. Test with Pixel Diagnostics → Speaker test.",
        "Cooling system failure": "Pixel: Pixel phones use graphite sheet cooling. Overheating usually caused by background apps or direct sunlight. Close heavy apps and remove case.",
        "DC jack failure":      "Pixel: USB-C port flex cable replacement is straightforward on most Pixel models. Pixel 6+ requires removing the back glass first.",
    },
    "ONEPLUS": {
        "Screen damage":        "OnePlus: use original AMOLED panels. OnePlus 10 Pro+ use LTPO panels — aftermarket replacements may not support adaptive refresh rate.",
        "Battery failure":      "OnePlus: check Settings → Battery → Battery health. OnePlus Warp/DASH charge puts extra stress on batteries — replace if health below 80%.",
        "Touch failure":        "OnePlus: dial *#808# → Touch Panel test. Ghost touch on OnePlus Nord series is a known issue — display replacement usually required.",
        "Camera failure":       "OnePlus: clear camera app cache. Hasselblad-branded cameras on OnePlus 10+ use Hasselblad colour calibration — use OEM replacement modules.",
        "Network failure":      "OnePlus: reset network settings in Settings → System → Reset. If Wi-Fi 6 drops, disable 'Intelligent network' in Wi-Fi settings.",
        "Software issue":       "OnePlus: boot into Recovery (Power + Volume Down) → Wipe cache → try reboot. OxygenOS updates can be rolled back from Recovery.",
        "Power supply failure":  "OnePlus: hold Power for 15 seconds to force restart. Test with original Warp/DASH charger — third-party chargers may not trigger fast charge.",
        "Cooling system failure": "OnePlus: gaming overheating is common. Enable Fnatic mode or reduce screen refresh to 60Hz. Clean internal thermal pad if device is older than 2 years.",
        "DC jack failure":      "OnePlus: USB-C port is on a separate flex cable on most models. Replace the flex cable — includes microphone.",
    },
    "XIAOMI": {
        "Screen damage":        "Xiaomi: use original AMOLED panels. Redmi/POCO LCD models are cheaper to replace. Always check if digitizer is fused to the display.",
        "Battery failure":      "Xiaomi: check Settings → Battery → Battery health (MIUI 14+). Xiaomi batteries rated for 800 cycles. Fast charge (67W-120W) degrades batteries faster.",
        "Touch failure":        "Xiaomi: dial *#*#6484#*#* → Touch Panel test. Ghost touch on POCO models sometimes fixed by MIUI update. Otherwise replace display assembly.",
        "Camera failure":       "Xiaomi: clear camera cache in Settings → Apps → Camera. 108MP/200MP sensors on Xiaomi Ultra series require precise alignment during replacement.",
        "Network failure":      "Xiaomi: reset network settings in Settings → Connection → Reset. Dual-SIM issues common — try swapping SIM slot positions.",
        "Software issue":       "Xiaomi: boot into Recovery (Power + Volume Up) → Wipe cache. MIUI system apps can be reset in Settings → Apps → select app → Clear data.",
        "Power supply failure":  "Xiaomi: hold Power for 15-20 seconds to force restart. HyperCharge (67W-120W) requires original Mi charger — third-party may charge slowly.",
        "Cooling system failure": "Xiaomi: gaming phones (POCO F-series, Xiaomi 14) have LiquidCool technology. Overheating in normal use → check for rogue background apps in Battery settings.",
        "DC jack failure":      "Xiaomi: USB-C port is on a sub-board on most Redmi/POCO models — easy and cheap to replace. Xiaomi flagship models may have it soldered to the mainboard.",
    },
}


def get_brand_actions(brand: str, fault: str, symptoms: str = "") -> List[str]:
    """
    Return a clear, ordered list of technician actions for the given brand and fault.
    Steps are:
      1. Brand-specific diagnostic entry point
      2. Brand-specific hard reset (if power-related)
      3. Brand-specific hint for this fault (blink code, software tool, warning)
      4. Fault-specific repair steps (from FAULT_BASE_ACTIONS)
    """
    brand_key = brand.strip().upper() if brand else ""
    symptoms_lower = symptoms.lower() if symptoms else ""

    actions: List[str] = []

    # Step 1 — brand diagnostic entry
    diag = BRAND_DIAGNOSTIC_ENTRY.get(brand_key)
    if diag:
        actions.append(diag)

    # Step 2 — hard reset for power/motherboard/battery/BIOS faults
    power_faults = {
        "Power supply failure", "Motherboard failure", "BIOS corruption",
        "Battery failure", "CPU failure", "RAM failure",
    }
    if fault in power_faults:
        reset = BRAND_HARD_RESET.get(brand_key)
        if reset:
            actions.append(reset)

    # Step 3 — battery software feature warning
    if fault == "Battery failure":
        feature = BRAND_BATTERY_FEATURE.get(brand_key)
        if feature:
            actions.append(feature)

    # Step 4 — BIOS recovery hint
    if fault == "BIOS corruption":
        bios = BRAND_BIOS_RECOVERY.get(brand_key)
        if bios:
            actions.append(bios)

    # Step 5 — brand-specific fault hint (blink code / software / warning)
    brand_hints = BRAND_FAULT_HINTS.get(brand_key, {})
    hint = brand_hints.get(fault)
    if hint and hint not in actions:
        actions.append(hint)

    # Step 6 — general fault repair steps
    base = FAULT_BASE_ACTIONS.get(fault, [])
    for step in base:
        if step not in actions:
            actions.append(step)

    # Fallback if nothing matched
    if not base and not hint:
        actions.append(f"Inspect components related to {fault} and run the brand hardware diagnostic tool.")
        actions.append("If no hardware fault is found, reinstall the operating system and drivers.")

    return actions
