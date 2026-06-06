# Feature-Sliced Design (FSD) - Secure Multi-Factor Access Control System

## Overview
This document defines the Feature-Sliced Design architecture for a distributed access control system with hardware (Arduino Uno R3, ESP-01) and application layers (Web/Mobile UI).

---

## 1. Directory Structure

```
access-control/
├── shared/                          # Shared utilities across all features
│   ├── ui/                         # Common UI components & utilities
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Card.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useNotification.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── api/                        # Common API client logic
│   │   ├── httpClient.ts
│   │   ├── errorHandler.ts
│   │   └── interceptors.ts
│   ├── types/                      # Shared TypeScript definitions
│   │   ├── user.ts
│   │   ├── access.ts
│   │   └── device.ts
│   ├── config/                     # Shared configuration
│   │   ├── constants.ts
│   │   └── environment.ts
│   └── utils/                      # Shared utility functions
│       ├── crypto.ts
│       ├── validation.ts
│       └── formatting.ts
│
├── entities/                        # Business domain entities (data models)
│   ├── user/
│   │   ├── User.ts                # User entity definition
│   │   ├── UserSchema.ts           # Validation & serialization
│   │   └── types.ts
│   ├── access-log/
│   │   ├── AccessLog.ts
│   │   ├── LogEntry.ts
│   │   └── types.ts
│   ├── device/
│   │   ├── Device.ts
│   │   ├── Relay.ts
│   │   └── types.ts
│   ├── credential/
│   │   ├── RFIDCard.ts
│   │   ├── CardToken.ts
│   │   └── types.ts
│   └── permission/
│       ├── Permission.ts
│       ├── ACL.ts
│       └── types.ts
│
├── features/                        # Feature modules (slices)
│   │
│   ├── auth/                       # Authentication & Authorization
│   │   ├── ui/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── api/
│   │   │   ├── authService.ts      # Login, logout, token refresh
│   │   │   └── endpoints.ts
│   │   ├── model/
│   │   │   ├── authStore.ts        # State management (Redux/Zustand)
│   │   │   └── actions.ts
│   │   ├── lib/
│   │   │   ├── jwt.ts
│   │   │   ├── passwordHash.ts
│   │   │   └── sessionManager.ts
│   │   └── types.ts
│   │
│   ├── user-management/            # User CRUD operations & profile
│   │   ├── ui/
│   │   │   ├── UserList.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── UserCard.tsx
│   │   │   ├── UserPermissions.tsx
│   │   │   └── UserModal.tsx
│   │   ├── api/
│   │   │   ├── userService.ts      # GET, POST, PUT, DELETE users
│   │   │   ├── permissionService.ts
│   │   │   └── endpoints.ts
│   │   ├── model/
│   │   │   ├── userStore.ts
│   │   │   └── actions.ts
│   │   ├── lib/
│   │   │   ├── userValidator.ts
│   │   │   ├── bitmaskHelper.ts    # Floor/relay permission handling
│   │   │   └── userMapper.ts
│   │   └── types.ts
│   │
│   ├── rfid-enrollment/            # Card enrollment & matching mode
│   │   ├── ui/
│   │   │   ├── EnrollmentWizard.tsx
│   │   │   ├── MatchModeDisplay.tsx
│   │   │   ├── CardScanner.tsx
│   │   │   └── EnrollmentStatus.tsx
│   │   ├── api/
│   │   │   ├── enrollmentService.ts
│   │   │   ├── matchModeService.ts
│   │   │   └── endpoints.ts
│   │   ├── model/
│   │   │   ├── enrollmentStore.ts
│   │   │   └── actions.ts
│   │   ├── lib/
│   │   │   ├── sectorKeyGenerator.ts
│   │   │   ├── tokenValidator.ts
│   │   │   └── cardConfiguration.ts
│   │   └── types.ts
│   │
│   ├── access-control/             # Real-time access control & relay actuation
│   │   ├── ui/
│   │   │   ├── RelayDashboard.tsx
│   │   │   ├── FloorSelector.tsx
│   │   │   ├── RelayToggle.tsx
│   │   │   ├── AccessStatusBanner.tsx
│   │   │   └── LockStatus.tsx
│   │   ├── api/
│   │   │   ├── accessService.ts    # Verify & grant access
│   │   │   ├── relayService.ts     # Actuate relays
│   │   │   └── endpoints.ts
│   │   ├── model/
│   │   │   ├── accessStore.ts
│   │   │   ├── relayStore.ts
│   │   │   └── actions.ts
│   │   ├── lib/
│   │   │   ├── accessVerifier.ts
│   │   │   ├── permissionChecker.ts
│   │   │   └── relayController.ts
│   │   └── types.ts
│   │
│   ├── logging/                    # Activity & security logging
│   │   ├── ui/
│   │   │   ├── LogViewer.tsx
│   │   │   ├── LogFilter.tsx
│   │   │   ├── LogTable.tsx
│   │   │   ├── LogAnalytics.tsx    # Charts, peak hours, statistics
│   │   │   └── LogExport.tsx
│   │   ├── api/
│   │   │   ├── logService.ts       # Query, aggregate, filter logs
│   │   │   ├── analyticsService.ts
│   │   │   └── endpoints.ts
│   │   ├── model/
│   │   │   ├── logStore.ts
│   │   │   └── actions.ts
│   │   ├── lib/
│   │   │   ├── logStorage.ts       # Circular buffer management
│   │   │   ├── logFilter.ts
│   │   │   ├── logAggregator.ts    # Statistics & analytics
│   │   │   └── csvExporter.ts
│   │   └── types.ts
│   │
│   ├── device-management/          # Hardware device status & diagnostics
│   │   ├── ui/
│   │   │   ├── DeviceStatus.tsx
│   │   │   ├── RelayArray.tsx
│   │   │   ├── DiagnosticsPanel.tsx
│   │   │   ├── WiFiStatus.tsx
│   │   │   └── SystemHealth.tsx
│   │   ├── api/
│   │   │   ├── deviceService.ts
│   │   │   ├── diagnosticsService.ts
│   │   │   └── endpoints.ts
│   │   ├── model/
│   │   │   ├── deviceStore.ts
│   │   │   └── actions.ts
│   │   ├── lib/
│   │   │   ├── heartbeatMonitor.ts
│   │   │   ├── statusMapper.ts
│   │   │   └── errorDecoder.ts
│   │   └── types.ts
│   │
│   ├── batch-operations/           # Multi-user deletion, group management
│   │   ├── ui/
│   │   │   ├── BatchDeleteDialog.tsx
│   │   │   ├── GroupSelector.tsx
│   │   │   ├── ConfirmationModal.tsx
│   │   │   └── OperationStatus.tsx
│   │   ├── api/
│   │   │   ├── batchService.ts
│   │   │   └── endpoints.ts
│   │   ├── model/
│   │   │   ├── batchStore.ts
│   │   │   └── actions.ts
│   │   ├── lib/
│   │   │   ├── batchValidator.ts
│   │   │   └── operationQueue.ts
│   │   └── types.ts
│   │
│   └── settings/                   # System configuration & preferences
│       ├── ui/
│       │   ├── SettingsPanel.tsx
│       │   ├── NetworkConfig.tsx
│       │   ├── SecuritySettings.tsx
│       │   └── SystemPreferences.tsx
│       ├── api/
│       │   ├── settingsService.ts
│       │   └── endpoints.ts
│       ├── model/
│       │   ├── settingsStore.ts
│       │   └── actions.ts
│       ├── lib/
│       │   ├── configValidator.ts
│       │   └── settingsMapper.ts
│       └── types.ts
│
├── pages/                           # Application pages/routes (Next.js/React Router)
│   ├── dashboard.tsx               # Main dashboard (role-based)
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── users/
│   │   ├── index.tsx               # User list
│   │   └── [id].tsx                # User detail/edit
│   ├── access-logs/
│   │   └── index.tsx
│   ├── devices/
│   │   └── index.tsx
│   ├── settings/
│   │   └── index.tsx
│   ├── enrollment/
│   │   └── index.tsx
│   └── _app.tsx                    # Root layout
│
├── app/                             # Application-level logic
│   ├── layouts/
│   │   ├── DashboardLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── StoreProvider.tsx        # Redux/Zustand
│   │   └── QueryProvider.tsx        # React Query
│   ├── hooks/
│   │   ├── useRole.ts              # Role-based access
│   │   ├── usePagination.ts
│   │   └── useLocalStorage.ts
│   └── middleware/
│       ├── authMiddleware.ts
│       └── errorBoundary.tsx
│
├── firmware/                        # Embedded firmware code
│   ├── esp01/
│   │   ├── src/
│   │   │   ├── main.cpp             # ESP-01 entry point
│   │   │   ├── WebServer.cpp/h      # HTTP server & routing
│   │   │   ├── UserDB.cpp/h         # User & ACL database
│   │   │   ├── Logger.cpp/h         # Logging (circular buffer)
│   │   │   ├── Crypto.cpp/h         # Cryptography & token generation
│   │   │   ├── SerialComm.cpp/h     # UART communication with Arduino
│   │   │   ├── WiFiManager.cpp/h
│   │   │   └── SecurityModel.cpp/h  # Auth handshake logic
│   │   ├── include/
│   │   └── platformio.ini
│   │
│   └── arduino-uno/
│       ├── src/
│       │   ├── main.cpp             # Arduino entry point
│       │   ├── RFID.cpp/h           # SPI RFID reader interface
│       │   ├── RelayController.cpp/h # HW-281 relay actuation
│       │   ├── LCDDisplay.cpp/h     # I2C LCD management
│       │   ├── SerialComm.cpp/h     # UART communication with ESP
│       │   ├── SecurityValidator.cpp/h # Local token validation
│       │   └── StateMachine.cpp/h   # Hardware state orchestration
│       ├── include/
│       └── platformio.ini
│
└── tests/
    ├── unit/
    │   ├── auth.test.ts
    │   ├── userManagement.test.ts
    │   ├── accessControl.test.ts
    │   └── logging.test.ts
    ├── integration/
    │   ├── authFlow.test.ts
    │   ├── enrollmentFlow.test.ts
    │   └── accessFlow.test.ts
    └── e2e/
        ├── userJourney.test.ts
        └── adminOperations.test.ts
```

---

## 2. Feature Slices - Detailed Breakdown

### 2.1 **auth** - Authentication & Authorization

**Responsibility:** User login, logout, session management, JWT token lifecycle, role-based access control.

**Key Modules:**
- **api/authService.ts** - API calls (login, logout, refresh token)
- **lib/jwt.ts** - JWT encoding/decoding, token validation
- **lib/passwordHash.ts** - Password hashing/verification
- **model/authStore.ts** - Auth state (current user, tokens, session)
- **ui/LoginForm.tsx** - Login UI component
- **types.ts** - User roles (Admin, User), auth payload

**Entry Points:**
- `POST /auth/login` - Authenticate user, return JWT
- `POST /auth/logout` - Clear session
- `POST /auth/refresh` - Refresh expired token

**State:**
```typescript
{
  isAuthenticated: boolean;
  currentUser: { id, name, role, permissions };
  accessToken: string;
  refreshToken: string;
  expiresAt: timestamp;
}
```

---

### 2.2 **user-management** - User CRUD & Profile Management

**Responsibility:** Create, read, update, delete users; assign RFID cards; configure floor/relay permissions; soft/hard delete workflows.

**Key Modules:**
- **api/userService.ts** - CRUD operations
- **lib/bitmaskHelper.ts** - Encode/decode 8-bit relay permission masks
- **ui/UserList.tsx** - Paginated user directory
- **ui/UserForm.tsx** - Add/edit user form with permission matrix
- **model/userStore.ts** - User list state, editing context

**Entry Points:**
- `GET /users` - List users (paginated, filterable)
- `POST /users` - Create new user
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user profile/permissions
- `DELETE /users/:id` - Hard delete user
- `PATCH /users/:id/disable` - Soft disable (disable without deletion)

**Data Model:**
```typescript
User {
  id: number;
  name: string;
  rfidUID: string | null;
  passwordHash: string;
  floorPermissions: number; // 8-bit bitmask (channels 0-7)
  isActive: boolean;
  createdAt: timestamp;
  lastModified: timestamp;
}
```

---

### 2.3 **rfid-enrollment** - Card Enrollment & Match Mode

**Responsibility:** Enroll new RFID cards, generate cryptographic keys, validate cards during matching mode, cleanup physical inventory.

**Key Modules:**
- **api/enrollmentService.ts** - Enroll new cards, verify tokens
- **lib/sectorKeyGenerator.ts** - Generate per-card random sector keys
- **lib/tokenValidator.ts** - Validate 128-bit card tokens
- **ui/EnrollmentWizard.tsx** - Step-by-step enrollment UI
- **ui/MatchModeDisplay.tsx** - Real-time matching status, remaining count

**Entry Points:**
- `POST /enrollment/start` - Begin enrollment workflow
- `POST /enrollment/verify-card` - Scan & verify physical card
- `POST /enrollment/assign-user/:userId` - Link card to user
- `POST /match-mode/start` - Initiate match mode for user subset
- `POST /match-mode/scan` - Process RFID scan in match mode
- `GET /match-mode/status` - Get remaining unmatched profiles

**Enrollment Flow:**
1. Admin initiates enrollment → Card detected → Sector key generated
2. Arduino writes token to card's secure sector
3. ESP validates token matches generated key
4. Card linked to user profile

**Match Mode Flow:**
1. Admin selects floors → User subset buffered
2. Terminal switches to match mode
3. Cards scanned → Profiles automatically removed from buffer
4. Remaining profiles shown at end → Can be batch deleted

---

### 2.4 **access-control** - Real-time Access Control & Relay Actuation

**Responsibility:** Verify access requests (RFID or app), validate permissions, actuate relays, provide instant feedback.

**Key Modules:**
- **api/accessService.ts** - Access verification & permission validation
- **api/relayService.ts** - Relay toggle commands
- **lib/accessVerifier.ts** - Multi-factor cryptographic handshake
- **lib/permissionChecker.ts** - Check user floor/relay permissions
- **ui/RelayDashboard.tsx** - User's authorized relay toggles
- **ui/AccessStatusBanner.tsx** - Real-time grant/deny feedback

**Entry Points:**
- `POST /access/verify` - Verify RFID card + generate challenge token
- `POST /access/validate-token` - Validate 128-bit card token response
- `POST /relay/toggle/:channelId` - Actuate relay (app-based)
- `GET /relay/status` - Get current relay states

**Access Verification Handshake:**
1. Arduino sends UID → ESP validates UID in database
2. ESP generates random sector key + 128-bit token → sends to Arduino
3. Arduino challenges card with sector key
4. Card returns 128-bit token → Arduino compares with expected
5. On match → ESP logs access → Arduino toggles relay

---

### 2.5 **logging** - Activity & Security Logging

**Responsibility:** Record all access events, generate audit trail, analyze patterns, filter/export logs, manage circular EEPROM buffer.

**Key Modules:**
- **api/logService.ts** - Query, filter, aggregate logs
- **lib/logStorage.ts** - Circular FIFO buffer management (EEPROM/SPIFFS)
- **lib/logFilter.ts** - Multi-parameter filtering (user, floor, date range)
- **lib/logAggregator.ts** - Generate analytics (peak hours, rejection rate)
- **ui/LogViewer.tsx** - Browsable log timeline
- **ui/LogAnalytics.tsx** - Statistical visualizations

**Entry Points:**
- `GET /logs?userId=X&floor=Y&startDate=&endDate=` - Query filtered logs
- `GET /logs/statistics` - Aggregate analytics
- `GET /logs/export?format=csv` - Export logs
- `POST /logs/clear` - Clear historical logs (admin only)

**Log Entry Schema:**
```typescript
LogEntry {
  id: number;
  timestamp: timestamp;
  userId: number | null;
  accessMethod: 'RFID' | 'APP';
  floorTarget: number;
  relayChannel: number;
  result: 'GRANTED' | 'DENIED';
  failureReason?: string;
  ipAddress?: string;
}
```

**Admin View Features:**
- Chronological log stream
- Filter by: user ID, RFID token, floor/relay, date/time range
- Peak load analysis (hourly distribution)
- Rejection rate trends
- System fault warnings

**User View Features:**
- Aggregated personal access summary
- Per-floor/relay statistics
- Last access timestamp & method

---

### 2.6 **device-management** - Hardware Device Status & Diagnostics

**Responsibility:** Monitor ESP-01 & Arduino health, relay array status, WiFi connectivity, communicate system errors.

**Key Modules:**
- **api/deviceService.ts** - Fetch device status/diagnostics
- **lib/heartbeatMonitor.ts** - Ping/heartbeat polling
- **ui/DeviceStatus.tsx** - Real-time device state display
- **ui/RelayArray.tsx** - Visualization of 8-channel relay states
- **ui/SystemHealth.tsx** - Overall system diagnostics

**Entry Points:**
- `GET /device/status` - Current device state (online/offline, uptime, memory)
- `GET /device/relay-status` - Relay channel states (on/off)
- `POST /device/heartbeat` - Keepalive/diagnostics
- `GET /device/logs/errors` - Recent system errors

**Device State:**
```typescript
DeviceStatus {
  espStatus: 'online' | 'offline';
  arduinoStatus: 'online' | 'offline';
  wifiSignal: number; // dBm
  uptime: seconds;
  memoryUsed: number;
  relayStates: [boolean × 8];
  lastSync: timestamp;
}
```

---

### 2.7 **batch-operations** - Multi-User Operations

**Responsibility:** Batch delete users by floor, multi-select management, safe operation confirmation.

**Key Modules:**
- **api/batchService.ts** - Execute batch operations
- **lib/operationQueue.ts** - Queue & execute operations safely
- **ui/BatchDeleteDialog.tsx** - Multi-user selection & confirmation
- **ui/GroupSelector.tsx** - Filter users by floor

**Entry Points:**
- `POST /batch/delete-users` - Delete array of user IDs
- `POST /batch/delete-by-floor` - Delete all users with specific floor permissions

**Workflow:**
1. Admin selects floor(s) → System filters matching users
2. Admin multi-selects users to delete
3. Confirmation modal shows user count & impact
4. On confirm → Users deleted from database → Logs updated → ACL refreshed

---

### 2.8 **settings** - System Configuration

**Responsibility:** Configure WiFi, network mode (Blynk vs local server), security policies, system preferences.

**Key Modules:**
- **api/settingsService.ts** - Get/update system configuration
- **ui/NetworkConfig.tsx** - WiFi SSID/password, IP settings
- **ui/SecuritySettings.tsx** - Key rotation, factory reset options
- **lib/configValidator.ts** - Validate network settings

**Entry Points:**
- `GET /settings` - Current system configuration
- `PUT /settings` - Update configuration
- `POST /settings/test-connection` - Verify WiFi connectivity
- `POST /settings/factory-reset` - Reset system to defaults

---

## 3. Shared Layer Modules

### **entities/** - Core Domain Models
- User.ts / UserSchema.ts
- AccessLog.ts / LogEntry.ts
- RFIDCard.ts / CardToken.ts
- Permission.ts / ACL.ts
- Device.ts / Relay.ts

### **shared/api/** - HTTP Client & Interceptors
- httpClient.ts (axios/fetch wrapper)
- errorHandler.ts (standardized error responses)
- interceptors.ts (auth token injection, error handling)

### **shared/types/** - Global TypeScript Definitions
- user.ts (User, UserRole, Permission)
- access.ts (AccessRequest, AccessResult)
- device.ts (DeviceStatus, RelayState)

### **shared/utils/** - Utility Functions
- crypto.ts (HMAC, hashing for client-side ops)
- validation.ts (email, RFID UID format, password strength)
- formatting.ts (date formatting, number display)

---

## 4. Firmware Architecture (Embedded)

### **firmware/esp01/** - Network & Logic Core
- **WebServer.cpp/h** - HTTP endpoints, REST API
- **UserDB.cpp/h** - User & ACL database (SPIFFS/LittleFS)
- **Logger.cpp/h** - Circular buffer logging
- **Crypto.cpp/h** - Token generation, sector key management
- **SerialComm.cpp/h** - UART protocol with Arduino
- **SecurityModel.cpp/h** - Multi-factor auth handshake

### **firmware/arduino-uno/** - Hardware Interface
- **RFID.cpp/h** - SPI communication with RC522
- **RelayController.cpp/h** - GPIO control of HW-281 relay
- **LCDDisplay.cpp/h** - I2C display management
- **SerialComm.cpp/h** - UART protocol with ESP
- **SecurityValidator.cpp/h** - Local token validation against card
- **StateMachine.cpp/h** - Orchestrate hardware state transitions

---

## 5. Data Flow & API Contracts

### Authentication Flow
```
Client → POST /auth/login → ESP validates password → returns JWT
Client stores JWT → includes in Authorization header for all requests
```

### RFID Access Flow (Physical)
```
Card scan → Arduino reads UID → sends to ESP via UART
ESP validates UID, generates token → sends back to Arduino
Arduino challenges card with sector key → reads 128-bit response
On match → ESP logs access → Arduino toggles relay → LCD displays result
```

### App Access Flow (Remote)
```
User selects relay in app → POST /relay/toggle/:channelId + JWT
ESP validates JWT + user permissions → logs event → commands Arduino
Arduino toggles relay → confirms to ESP → status reflected in UI
```

---

## 6. Cross-Feature Dependencies

| Feature | Depends On |
|---------|-----------|
| access-control | auth, user-management, device-management |
| logging | auth, access-control, user-management |
| batch-operations | user-management |
| rfid-enrollment | device-management, user-management |
| device-management | auth (permissions) |
| settings | device-management |

---

## 7. Implementation Priorities

**Phase 1 (MVP):**
1. auth
2. user-management
3. access-control (RFID physical flow)
4. device-management
5. logging

**Phase 2 (Enhancement):**
1. rfid-enrollment (match mode)
2. batch-operations
3. settings

**Phase 3 (Optional):**
1. Advanced analytics
2. MQTT integration
3. Mobile app native version

---

## 8. Technology Recommendations

### Web/Mobile Frontend
- **Framework:** Next.js / React
- **State:** Zustand or Redux Toolkit
- **Styling:** Tailwind CSS
- **API Client:** TanStack Query + Axios
- **Auth:** JWT stored in httpOnly cookies

### Backend (ESP-01)
- **Framework:** Arduino cores for ESP8266
- **Database:** SPIFFS/LittleFS (key-value JSON storage)
- **Logging:** Circular FIFO buffer (EEPROM fallback)
- **Cryptography:** mbedTLS (built-in to ESP cores)
- **API:** ESP8266WebServer or Blynk

### Hardware
- **Arduino Uno:** PlatformIO + standard Arduino libraries
- **RFID:** MFRC522 SPI library
- **Display:** LiquidCrystal_I2C
- **Communication:** SoftwareSerial or hardware UART

---

## 9. File Naming Conventions

- **UI Components:** PascalCase (e.g., UserForm.tsx)
- **Utilities/Services:** camelCase (e.g., userService.ts)
- **Types:** PascalCase (e.g., User.ts)
- **Tests:** `[name].test.ts`
- **C++ Firmware:** PascalCase for classes (e.g., RFIDReader.cpp/h)

---

## 10. Module Exports Pattern

Each feature slice exports via **index.ts**:

```typescript
// features/user-management/index.ts
export * from './types';
export { userService } from './api/userService';
export { UserList } from './ui/UserList';
export { useUserStore } from './model/userStore';
```

This enables clean imports:
```typescript
import { userService, UserList, useUserStore } from '@/features/user-management';
```

---

**End of FSD Document**
