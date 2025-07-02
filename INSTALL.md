# No Mercy Tracker - Installation Guide

## Quick Start

After cloning the repository, build and install the app with one command:

```bash
npm install && npm run install-app
```

This will:

1. 🔍 **Auto-detect** your OS and architecture
2. 📦 **Install** all dependencies
3. 🎨 **Generate** platform-specific icons
4. ⚙️ **Build** the React application
5. 📱 **Package** the Electron desktop app
6. 📁 **Output** ready-to-install files in `../TheNoMercyApp-Built/`

## What You Get

### macOS Users

-   **Intel Macs**: `No Mercy Tracker-1.0.0.dmg`
-   **Apple Silicon**: `No Mercy Tracker-1.0.0-arm64.dmg`
-   **Direct Use**: `No Mercy Tracker.app` (ready to run)

### Windows Users

-   **Installer**: `No Mercy Tracker Setup 1.0.0.exe`
-   **Portable**: Standalone executable

### Linux Users

-   **AppImage**: `No-Mercy-Tracker-1.0.0.AppImage`
-   **Portable**: Self-contained, no installation needed

## System Requirements

-   **Node.js**: 20.19+ (download from [nodejs.org](https://nodejs.org))
-   **RAM**: 4GB minimum
-   **Storage**: 500MB for build process
-   **OS**: macOS 10.14+, Windows 10+, or modern Linux

## Manual Build Options

```bash
# For your current platform only
npm run dist

# macOS specific (builds both Intel and Apple Silicon)
npm run dist-mac

# Windows specific
npx electron-builder --win

# Linux specific
npx electron-builder --linux

# All platforms
npx electron-builder -mwl
```

## Development Mode

```bash
# Run in development (with hot reload)
npm run electron-dev

# Or run separately:
npm run dev        # Start React dev server
npm run electron   # Start Electron app
```

## Troubleshooting

### "Command not found: npm"

Install Node.js from [nodejs.org](https://nodejs.org)

### "Engine not supported" warnings

These are safe to ignore - the app will still build correctly

### Build fails on macOS

Try: `sudo xcode-select --install`

### Windows antivirus blocks build

Add the project folder to your antivirus exclusions

### Linux missing dependencies

Install: `sudo apt-get install libnss3-dev libatk-bridge2.0-dev libdrm2 libgtk-3-dev`

## File Structure

```
TheNoMercyApp/
├── 📱 src/              # React app source
├── ⚙️ electron.js       # Desktop app logic
├── 🎨 public/           # Logo and assets
├── 📦 package.json      # Dependencies
└── 🚀 install-app.js    # Cross-platform installer
```

## Features

-   ✅ **Cross-Platform**: Works on macOS, Windows, Linux
-   📊 **Statistics**: Compare win rates with/without Mercy banned
-   💾 **Local Storage**: Data saved as CSV in app folder
-   🎮 **Game Tracking**: Record matches with notes
-   🚫 **No Cloud**: Everything stays on your device

---

**Questions?** Open an issue on GitHub or check the main README.md
