# Secure Multi-Factor Access Control System

A distributed access control system utilizing **Arduino Uno R3** and **ESP-01 (ESP8266)** for secure physical access management with cryptographic RFID authentication, relay control, and cloud/app integration.

## 🔐 Features

- **Multi-Factor RFID Authentication** - Advanced cryptographic challenge-handshake with per-card sector keys and 128-bit token validation
- **Dual Hardware Architecture** - Arduino for hardware interface, ESP-01 for network logic and ACL management
- **Role-Based Access Control** - Admin and User tiers with granular floor/relay permissions (8-channel relay array)
- **Circular Activity Logging** - FIFO buffer for continuous operation without memory overflow
- **Match Mode** - Physical inventory cleanup and card verification workflow
- **Remote Access** - Web/Mobile app control with Blynk or local HTTP server
- **Real-Time Monitoring** - Device health, relay status, WiFi connectivity, system diagnostics
- **Batch Operations** - Multi-user management, group-based deletion by floor

## 📁 Project Structure

```
access-control-system/
├── docs/
│   ├── architecture/
│   │   └── FSD.md              # Feature-Sliced Design document
│   ├── design/
│   │   └── Idea.md             # System specification & requirements
│   └── api/                    # (API documentation - coming soon)
├── firmware/
│   ├── esp01/                  # ESP-01 firmware (network core)
│   └── arduino-uno/            # Arduino firmware (hardware interface)
├── src/
│   ├── features/               # Web/mobile app features
│   ├── pages/                  # Routes
│   └── shared/                 # Shared utilities & types
├── tests/                      # Unit, integration, E2E tests
├── README.md                   # This file
└── package.json                # Dependencies (if using Node.js)
```

## 🚀 Getting Started

### Prerequisites
- **Hardware:** Arduino Uno R3, ESP-01 (ESP8266), RFID-RC522, HW-281 Relay Module, 16x2 LCD (I2C)
- **Development Tools:** VS Code + PlatformIO extension
- **Frameworks:** Arduino cores, ESP-IDF/Arduino ESP8266 cores

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jeweel/access-control-system.git
   cd access-control-system
   ```

2. **Read the documentation:**
   - Start with `docs/design/Idea.md` for system overview
   - Review `docs/architecture/FSD.md` for code structure and feature breakdown

3. **Set up firmware development:**
   - Install PlatformIO in VS Code
   - Navigate to `firmware/esp01/` and `firmware/arduino-uno/`
   - Run `platformio run -t upload` to deploy

4. **Set up web/mobile app:**
   ```bash
   npm install
   npm run dev
   ```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[Idea.md](docs/design/Idea.md)** | System architecture, hardware specs, security model, workflows |
| **[FSD.md](docs/architecture/FSD.md)** | Feature-Sliced Design, module breakdown, API contracts, data flows |

## 🔐 Security Model

The system enforces **four mandatory cryptographic rules:**

1. **UID Isolation Denial** - Raw UID alone never grants access
2. **Factory Default Key Block** - All cards initialized with randomized sector keys
3. **Per-Card Diversified Keys** - Each card has isolated, non-identical keys
4. **128-bit Token Validation** - Encrypted token matches ESP-01 validation schema

**Access Verification Flow:**
```
Card Scan → Arduino reads UID → ESP validates UID & generates keys
→ Arduino challenges card sector → Card returns token → Local bitwise validation
→ Match → Relay actuation + logging
```

## 🏗️ Architecture Layers

### Hardware Layer (Arduino Uno R3)
- RFID reader polling (SPI RC522)
- Relay actuation (HW-281 active-low control)
- LCD display management (I2C)
- Local token validation
- Serial communication with ESP

### Network Layer (ESP-01)
- User & ACL database (SPIFFS/LittleFS)
- Cryptographic security engine
- Token generation & validation logic
- Circular FIFO logging (EEPROM)
- Web server / Blynk interface
- Serial communication with Arduino

### Application Layer (Web/Mobile)
- Authentication & session management
- User management CRUD
- RFID card enrollment & match mode
- Relay control dashboard
- Access log analytics
- System diagnostics & monitoring

## 🔄 Core Workflows

### Physical Access (RFID Card)
1. User scans card at Arduino terminal
2. Arduino sends UID to ESP via UART
3. ESP validates UID, generates random sector key + 128-bit token
4. Arduino challenges card with sector key
5. Card returns token → Arduino validates against expected value
6. On match → ESP logs access → Arduino toggles relay

### Remote Access (App/Web)
1. User authenticates via password
2. ESP validates credentials, issues JWT
3. User sees dashboard with authorized relays only
4. User triggers relay toggle
5. ESP logs transaction → Arduino actuates relay

### Enrollment & Match Mode
1. Admin selects floor(s) for matching
2. System buffers user subset, switches to match mode
3. Cards scanned one-by-one → System auto-verifies against buffer
4. Unmatched profiles displayed → Admin batch deletes if needed

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Microcontroller** | Arduino Uno R3, ESP-01 (ESP8266) |
| **RFID** | MFRC522 SPI module |
| **Relay Control** | HW-281 8-channel relay |
| **Display** | 16x2 LCD + PCF8574 I2C adapter |
| **Frontend** | React / Next.js, Tailwind CSS |
| **State** | Zustand / Redux Toolkit |
| **API Client** | Axios + TanStack Query |
| **Backend Framework** | ESP8266WebServer / Blynk |
| **Database** | SPIFFS/LittleFS (key-value), EEPROM logs |
| **Cryptography** | mbedTLS (built-in to ESP cores) |

## 📊 Feature Roadmap

**Phase 1 (MVP):**
- ✅ Authentication & user management
- ✅ RFID physical access
- ✅ Relay control (app-based)
- ✅ Device monitoring
- ✅ Access logging

**Phase 2 (Enhancement):**
- Card enrollment wizard
- Match mode (physical inventory cleanup)
- Batch user operations
- System configuration panel
- Advanced analytics

**Phase 3 (Optional):**
- MQTT protocol integration
- Mobile app (native iOS/Android)
- Advanced biometric support
- Multi-site federation

## 🧪 Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Firmware validation
platformio test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature: description"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Jeweel** - [GitHub Profile](https://github.com/jeweel)

## 🤝 Support

For issues, questions, or feature requests, please open an [Issue](https://github.com/jeweel/access-control-system/issues) on GitHub.

---

**Last Updated:** June 6, 2026
