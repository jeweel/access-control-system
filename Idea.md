# System Architecture & Design Specification: Secure Multi-Factor Access Control System

This document outlines the detailed system architecture, software specifications, and security model for a multi-factor smart access control system utilizing an Arduino Uno R3, an ESP-01 Wi-Fi module, and an RFID-RC522 reader. The system supports localized physical access validation paired with a centralized management mobile application or web server interface.

---

## 1. System Components & Development Environment

### 1.1 Hardware Inventory
* **Microcontrollers / Processing Units:**
    * **Arduino Uno R3:** Acts as the primary physical hardware interface handler, processing local SPI communications from the RFID reader, driving the I2C LCD screen, and executing GPIO switching for the relay module.
    * **ESP-01 (ESP8266):** Functions as the core network gateway, user credential database manager, security verification engine, logging coordinator, and host for the Web Server / Blynk interface.
* **Peripherals & Actuators:**
    * **RFID-RC522 Module:** SPI-based Radio Frequency Identification reader/writer operating at 13.56 MHz, utilized for advanced multi-layered card verification.
    * **HW-281 8-Channel Relay Module:** Active-Low relay array configured to control physical electromechanical locks, automated gates, or elevator floor-selection circuitry.
    * **16x2 Character LCD Display with I2C PCF8574 Interface Module:** Provides real-time localized visual feedback to users and administrators.

### 1.2 Development Environment
* **Primary IDE:** VS Code equipped with the **PlatformIO** extension.
* **Alternative Framework (Optional):** Native **ESP-IDF** extension (primarily reserved for low-level optimizations on the ESP platform if transitioning beyond basic Arduino cores).
* **Key Libraries Utilized:**
    * `MFRC522` (Optimized for SPI interaction)
    * `LiquidCrystal_I2C` (For display management)
    * `ArduinoJson` (For structured UART communication packets between chips)
    * `BlynkSimpleEsp8266` or native `ESP8266WebServer` / `ESP8266WiFi`

---

## 2. System Functionality Matrix

### 2.1 ESP-01 Network & Logic Core
The ESP-01 serves as the master decision-maker and data vault. It governs user authentication, remote controls, and persistent storage management.

1.  **Dual-Role App Authentication:** Offers a secure application layer distinguishing between **Admin** and **User** authentication tiers through separate cryptographic password handshakes.
2.  **Inter-IC Communication Engine:** Establishes a robust serial connection (UART via hardware or software serial pins) with the Arduino Uno to coordinate state machines, sensor data, and execution commands.
3.  **Access Control List (ACL) Engine:** Maintains the absolute truth registry of user profiles, hardware-level mapping, and precise access rights.
4.  **User Schema Architecture:** Stores the following parameters per record:
    * `User ID` (Unique system auto-incremented index)
    * `Name` (Alphanumeric string descriptor)
    * `RFID UID` (Hardware identifier)
    * `Password` (Local alphanumeric fallback/remote app login password)
    * `Floor / Relay Permissions` (Bitmask array indicating authorization states for each of the 8 channels)
5.  **Dynamic UI Presentation:** Automatically parses active user permissions to render a stripped, secure user dashboard showing *only* authorized relay/floor trigger toggles.
6.  **Circular Logging Storage (FIFO):** Implements a fixed-boundary circular memory buffer within EEPROM or SPIFFS/LittleFS. When full, the oldest historical logs are automatically overwritten to guarantee continuous operational up-time without memory leaks or storage overflow crashes.
7.  **Network Architecture Phases:**
    * *Phase 1:* Local asynchronous Web Server or Blynk IoT platform integration for instant cross-device connectivity.
    * *Phase 2 (Future Extension):* Migration to standard lightweight MQTT protocol for streamlined enterprise broker integration.

#### 2.1.1 Logging Architecture
* **User View:**
    * Aggregated personal access metrics summary.
    * Individual call/open statistics tracked per floor/relay.
    * Timestamp and execution method of last verified entry.
* **Admin View:**
    * Unfiltered system-wide chronological telemetry logs.
    * Multi-parameter filtering capabilities: query logs by `User ID`, `RFID Token`, specific `Floor/Relay`, and discrete `Date/Time Range`.
    * Graphical/tabular analytical summaries highlighting Peak Load Hours, Rejected Access Attempts, and System Fault warnings.

#### 2.1.2 Advanced User Management & Deletion Framework
* **Operational Directives:** Add User, Edit User, Assign RFID, Assign Password, Configure Floor/Relay Permissions, Disable User (Soft-lock profile state), Restore User (Re-activate), and Hard Delete User.
* **Targeted Deletion Workflows:**
    * **Method 1 (Direct Query):** Admin queries database via specific User ID or User Name string match, selects profile, and executes removal.
    * **Method 2 (Group Allocation Purge):** Admin filters user directory by selecting a specific Floor or set of Floors. System isolates all profiles containing active permission bitmasks for those selections. Admin evaluates the list to multiselect single or grouped users for rapid batch deletion.

#### 2.1.3 Advanced Matching & Enrollment Clean-up Mode ("Match Mode")
Designed to clean up physical inventory or cross-verify physical card states against digital records:
1.  Admin isolates a subset of users by selecting specific Floor(s).
2.  The target user registry matching those parameters is buffered into the active workspace.
3.  The system transitions the physical terminal into **Match Mode**.
4.  Users/Admin scan local physical RFID cards one by one at the reader.
5.  If a card scan matches a buffered profile, that profile is successfully verified and **automatically stripped from the transient target list**.
6.  Any scanned card failing authentication triggers an on-screen visual error state.
7.  At the completion of the cycle, remaining unmatched profiles represent missing cards or invalid users. The Admin can inspect this remaining subset on-screen and purge them instantly from the system.

### 2.2 Arduino Uno Hardware Interface Controller
The Arduino Uno executes high-speed edge interactions, drives localized peripherals, and acts as a pure hardware slave to the ESP-01 verification engine.

1.  **RFID Raw Acquisition:** Continuously polls the RC522 via SPI. Upon card detection, it extracts the raw Unique Identifier (UID) and dispatches it upstream to the ESP-01.
2.  **Relay Actuation Array:** Monitors downstream commands from the ESP-01, decoding specific channel execution strings to toggle individual or multiple bits on the HW-281 active-low relay bank.
3.  **Localized Diagnostics:** Streamlines runtime logging by mirroring hardware transaction data concurrently across the hardware Serial Bus and the 16x2 I2C LCD interface.
4.  **I2C LCD Display Management:** Orchestrates the system's human-machine interface using the following dedicated visual display modes:
    * *System Status:* Standard idling loop (e.g., "System Ready", "Awaiting Sync", "Wi-Fi Connected").
    * *RFID Scan Feedback:* Detects card approximation ("Card Read...", "Processing...").
    * *Access Result Intercepts:* Triggers unique timed text configurations for `"Access Granted - Floor X"` or `"Access Denied - Invalid Token"`.
    * *Relay Execution Feedback:* Visually maps changing relay arrays (e.g., `"Relay 4 Active"`).
    * *ESP-01 Communication Link Status:* Real-time ping/heartbeat monitoring; flags an instant alert if the serial link to the ESP drops (e.g., `"Comm Link Error"`).
    * *Match Mode Telemetry:* Displays explicit dynamic counts during validation sweeps (e.g., `"Match Mode Active"`, `"Remaining: 04"`).

---

## 3. Access Verification Workflows

### 3.1 Advanced RFID Multi-Factor Challenge-Handshake Authentication
To prevent standard cloning vectors, replay attacks, and card-emulation exploits, physical credential verification adheres to a multi-factor cryptographic security sequence:

```
[Physical Card]                       [Arduino Uno R3]                      [ESP-01 Engine]
       |                                      |                                     |
       | ----- 1. Scans Card & Reads UID ---->|                                     |
       |                                      | --------- 2. Forwards UID --------->|
       |                                      |                                     |
       |                                      |                               [Validates UID]
       |                                      |                               [Generates Keys]
       |                                      |<-- 3. Transmits Validation Packet --|
       |                                      |    (Sector Key + 128-bit Token)     |
       |                                      |                                     |
       |<-- 4. Challenges Card Sector Key ----|                                     |
       |                                      |                                     |
       | ==== 5. Validates 128-bit Token ====>|                                     |
       |                                      |                                     |
       |                                      |-- 6. Activates Authorized Relays    |
```

1.  The user scans their card against the RFID-RC522 reader interface.
2.  The Arduino Uno acquires the card's **Unique Identifier (UID)** and immediately transmits it across the Serial Link to the ESP-01 processor.
3.  The ESP-01 queries its local access control memory structure. If the UID is valid, it retrieves or computes a **Per-Card Random Sector Key** and generates a highly volatile **128-bit Random Token**.
4.  The ESP-01 packs this verification context along with the user's specific floor permission bitmap and transmits it securely back down to the Arduino Uno.
5.  The Arduino Uno configures its local RC522 transceiver using the received *Per-Card Random Sector Key* to unlock a protected, non-public storage sector on the physical MIFARE card.
6.  The Arduino Uno reads the physical 128-bit secure block embedded on the card and conducts a local, bitwise evaluation against the *128-bit Random Token* supplied by the ESP-01.
7.  Upon a perfect cryptographic match, the Arduino Uno changes the status flags on the matching bits of the HW-281 Active-Low Relay Module to grant access and refreshes the I2C LCD screen status.

### 3.2 Mobile Application / Cloud Access Workflow
1.  The user opens the client interface (Blynk or localized Web Interface) and authenticates via their User Password credentials.
2.  The application establishes a secure connection to the ESP-01 interface.
3.  The ESP-01 parses the user profile permissions and presents a customized virtual control dashboard, rendering toggles *only* for relays the user is explicitly authorized to operate.
4.  The user triggers a virtual interface control (e.g., "Unlock Floor 3").
5.  The ESP-01 bypasses local physical card checks, registers the cloud transaction event to the circular logging queue, and dispatches a direct execution primitive to the Arduino Uno via UART.
6.  The Arduino Uno immediately pulls down the targeted pin on the active-low relay array to open the physical pathway.

---

## 4. Mandatory RFID Cryptographic Security Model

The system enforces strict compliance rules to protect against security degradation:

$$	ext{Valid Authorization} \iff 	ext{UID} \;\land\; 	ext{Per-Card Random Sector Key} \;\land\; 	ext{128-bit Random Token}$$

### Architectural Enforcement Rules:
* **Rule I: UID Isolation Denial**
    The hardware UID is classified as public, unencrypted data. Acquisition of a valid UID alone **never grants access** under any scenario. If a cloned card presents a valid UID but fails secondary memory sector handshakes, access is rejected and a critical security flag is logged.
* **Rule II: Factory Default Key Block**
    The default factory cryptographic transport keys (`0xFFFFFFFFFFFF` or `Key A / Key B` defaults) are strictly blacklisted. During system user enrollment, any new token initialized must undergo a sector transformation routine, replacing standard factory keys with a randomized profile sequence.
* **Rule III: Per-Card Diversified Sector Keys**
    Every individual card enrolled within the database must possess an isolated, non-identical cryptographic key signature assigned to its secure internal sectors. Compromise of a single card's sector key cannot lead to a cascade compromise of other cards across the network deployment.
* **Rule IV: 128-bit Token Validation Requirement**
    The physical internal sector of the target token must securely store an encrypted 128-bit data token that corresponds directly with the validation schemas generated by the ESP-01 security database matrix during cross-checks.