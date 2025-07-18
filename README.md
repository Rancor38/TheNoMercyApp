# 🎯 No Mercy Tracker

**A professional desktop application for tracking Overwatch games and analyzing Mercy ban effectiveness**

<div align="center">

![No Mercy Tracker Logo](public/no-mercy.png)

[![macOS](https://img.shields.io/badge/macOS-Intel%20%26%20Apple%20Silicon-blue?logo=apple)](https://github.com/yourusername/TheNoMercyApp)
[![Windows](https://img.shields.io/badge/Windows-64--bit%20%26%2032--bit-blue?logo=windows)](https://github.com/yourusername/TheNoMercyApp)
[![Linux](https://img.shields.io/badge/Linux-AppImage-blue?logo=linux)](https://github.com/yourusername/TheNoMercyApp)

</div>

---

## 🎮 **What is No Mercy Tracker?**

No Mercy Tracker is a **desktop application** designed for serious Overwatch players who want to **analyze the impact of banning Mercy** on their competitive matches. Track your games, compare win rates, and make data-driven decisions about your hero bans.

### **Key Features**

-   📊 **Statistical Analysis**: Compare win rates with and without Mercy banned
-   📝 **Game Tracking**: Log matches with date, ban status, results, and notes
-   💾 **Persistent Data Storage**: Your data automatically saves and survives app restarts
-   🛠️ **Debug Tools**: Built-in data management and troubleshooting panel
-   🎨 **Professional UI**: Clean, intuitive interface optimized for quick data entry
-   🔄 **Auto-Updates**: Stay current with the latest features automatically
-   🌐 **Cross-Platform**: Works on macOS, Windows, and Linux
-   🔒 **Privacy-First**: All data stays local on your device

### **✨ Latest Updates (v1.0.1)**

-   🔧 **Fixed Data Persistence**: Games now properly save when closing/reopening the app
-   🛠️ **Added Debug Panel**: Manual save controls and data path visibility
-   📁 **Improved Data Storage**: Production data now saves to Documents folder
-   🔍 **Enhanced Logging**: Better feedback for data operations
-   ✅ **Empty State Persistence**: Deleting all games now properly saves empty state

---

## 📋 **Prerequisites**

**Before you begin, make sure you have the following installed on your computer:**

### **Required Software**

1. **📦 Node.js (version 20.19 or higher)**

    - **Download**: [nodejs.org](https://nodejs.org/)
    - **What it is**: JavaScript runtime needed to build the app
    - **Check if installed**: Open Terminal/Command Prompt and type `node --version`
    - **Expected output**: `v20.19.0` or higher

2. **📝 npm (version 10.0 or higher)**

    - **What it is**: Package manager (comes with Node.js)
    - **Check if installed**: Type `npm --version` in Terminal/Command Prompt
    - **Expected output**: `10.0.0` or higher

3. **💻 Git**
    - **Download**: [git-scm.com](https://git-scm.com/)
    - **What it is**: Version control system to download the code
    - **Check if installed**: Type `git --version` in Terminal/Command Prompt
    - **Expected output**: `git version 2.x.x` or similar

### **System Requirements**

| Requirement | Minimum                                  | Recommended     |
| ----------- | ---------------------------------------- | --------------- |
| **RAM**     | 4GB                                      | 8GB+            |
| **Storage** | 2GB free space                           | 5GB+ free space |
| **OS**      | macOS 10.15+, Windows 10+, Ubuntu 18.04+ | Latest versions |

### **🚨 First Time Setup Help**

**Never used Terminal/Command Prompt before?**

-   **macOS**: Press `Cmd + Space`, type "Terminal", press Enter
-   **Windows**: Press `Win + R`, type "cmd", press Enter
-   **Linux**: Press `Ctrl + Alt + T`

**Don't have the required software?**

1. Install Node.js from [nodejs.org](https://nodejs.org/) (this includes npm)
2. Install Git from [git-scm.com](https://git-scm.com/)
3. Restart your Terminal/Command Prompt after installation

---

## 🚀 **Quick Start - One Command Installation**

**Once you have the prerequisites, getting No Mercy Tracker is easy:**

```bash
# Clone and build in one go
git clone https://github.com/yourusername/TheNoMercyApp.git
cd TheNoMercyApp
npm install && npm run install-app
```

**That's it!** The app will:

-   ✅ Detect your system automatically
-   ✅ Build the appropriate installer
-   ✅ Open the installer when done
-   ✅ Create a `../TheNoMercyApp-Built/` folder with everything you need

### **System Requirements**

| Requirement | Version         |
| ----------- | --------------- |
| **Node.js** | 20.19+          |
| **npm**     | 10.0+           |
| **RAM**     | 4GB+            |
| **Storage** | 500MB for build |

---

## 💻 **Platform Support**

### **🍎 macOS**

-   **Intel Macs** (x64): `.dmg` installer
-   **Apple Silicon** (M1/M2/M3): `.dmg` installer
-   **Direct Use**: `.app` bundle included

### **🪟 Windows**

-   **64-bit**: `.exe` installer with NSIS
-   **32-bit**: Legacy support included
-   **Auto-install**: One-click installation

### **🐧 Linux**

-   **AppImage**: Portable executable
-   **x64 Architecture**: Universal compatibility
-   **No Installation**: Run directly

---

## 📖 **How to Use**

### **1. Installation**

After running `npm run install-app`, you'll find:

```
../TheNoMercyApp-Built/
├── No Mercy Tracker-1.0.0.dmg    # macOS installer
├── No Mercy Tracker.app           # macOS app bundle
└── README.md                      # Installation guide
```

### **2. First Launch**

1. **macOS**: Double-click the `.dmg` → Drag to Applications
2. **Windows**: Run the `.exe` installer → Follow wizard
3. **Linux**: Make executable → `./No-Mercy-Tracker.AppImage`

### **3. Using the App**

-   **Add Games**: Click "Add Game" to log a match
-   **Track Mercy Bans**: Toggle whether Mercy was banned
-   **Record Results**: Mark wins/losses with notes
-   **View Stats**: See win rate comparisons in real-time
-   **Export Data**: CSV files stored locally for backup

---

## 🛠 **Development Setup**

### **For Contributors and Developers**

```bash
# Setup development environment
git clone https://github.com/yourusername/TheNoMercyApp.git
cd TheNoMercyApp
npm install

# Run in development mode
npm run electron-dev    # Hot-reload React + Electron

# Manual build commands
npm run dist-mac       # macOS only
npm run dist           # All platforms
npm run publish        # Build + publish to GitHub releases
```

### **Project Architecture**

```
📁 TheNoMercyApp/
├── 🎨 src/                     # React frontend
│   ├── App.jsx                 # Main component
│   ├── App.css                 # Styles + themes
│   └── assets/                 # Images and icons
├── ⚡ electron.js              # Main Electron process
├── 🔒 preload.js               # Secure IPC bridge
├── 🚀 install-app.js           # Smart installer script
├── 🎯 generate-icons.js        # Round icon generator
└── 📦 build-assets/            # Generated app icons
```

### **Technologies Used**

-   **Frontend**: React 19 + Vite (latest)
-   **Desktop**: Electron 37 + Auto-updater
-   **Build**: electron-builder (cross-platform)
-   **Icons**: Sharp + png2icons (round icons)
-   **Data**: CSV storage (local + portable)

---

## 📊 **Features in Detail**

### **Game Tracking Interface**

-   **Spreadsheet-style** layout for quick data entry
-   **Date picker** with smart defaults
-   **One-click toggles** for Mercy banned/unbanned
-   **Win/Loss buttons** with visual feedback
-   **Notes field** for match details and strategies

### **Statistical Dashboard**

-   **Real-time calculations** of win rates
-   **Visual comparison** between banned vs. unbanned scenarios
-   **Game counters** showing total matches tracked
-   **Performance trends** over time

### **Data Management & Persistence**

-   **Auto-save** to CSV format with real-time persistence
-   **Debug panel** with manual save controls and data path display
-   **Reliable storage** - data survives app restarts and updates
-   **Smart data paths** - development vs production data separation
-   **Backup-friendly** CSV format that's human-readable
-   **Privacy-first** - no cloud data collection, everything stays local

### **Enhanced User Experience**

-   **Collapsible debug tools** for power users and troubleshooting
-   **Real-time save feedback** with status messages
-   **Data persistence indicators** showing loading and save states
-   **Manual save option** for additional peace of mind

### **Professional Polish**

-   **Round app icon** with Mercy imagery
-   **Native menus** and keyboard shortcuts
-   **Responsive design** for different screen sizes
-   **Auto-updates** for seamless maintenance

---

## 🔧 **Troubleshooting**

### **Common Issues**

| Problem                                             | Solution                                                                    |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| **"node is not recognized" or "command not found"** | Install Node.js from [nodejs.org](https://nodejs.org/) and restart Terminal |
| **"git is not recognized" or "command not found"**  | Install Git from [git-scm.com](https://git-scm.com/) and restart Terminal   |
| **Build fails with permission errors**              | Try running with `sudo` on macOS/Linux (not recommended on Windows)         |
| **Icons missing**                                   | Ensure `public/no-mercy.png` exists in the project folder                   |
| **App won't start on Windows**                      | Check Windows Defender/antivirus settings, add exception for the app        |
| **Updates failing**                                 | Make sure you have internet connection and GitHub access                    |
| **Data not persisting (games disappearing)**        | Use the debug panel to check data path and manually save                    |
| **Can't find saved games after app restart**        | Check `~/Documents/No Mercy Tracker/` folder for your data file             |
| **Debug panel shows wrong data path**               | Restart the app - it should detect production vs development mode correctly |

### **Data Persistence Troubleshooting**

**Problem: "My games disappear when I close the app"**

1. ✅ **Check the debug panel** - expand "Debug Info & Manual Controls"
2. ✅ **Verify data path** - should show `~/Documents/No Mercy Tracker/games-data.csv` in production
3. ✅ **Use manual save** - click the "💾 Manual Save" button to force a save
4. ✅ **Check file permissions** - ensure you can write to the Documents folder
5. ✅ **Look for the CSV file** - navigate to the path shown in debug panel

**Problem: "Debug panel shows I have 0 games but I added some"**

1. Wait for the "Games Loaded: Yes" indicator
2. Try the manual save button
3. Check if you're running in development mode (different data location)
4. Restart the app and check again

### **Step-by-Step Help**

**Problem: "I don't know if I have the right software"**

1. Open Terminal (macOS/Linux) or Command Prompt (Windows)
2. Type these commands one by one:
    ```bash
    node --version    # Should show v20.19.0 or higher
    npm --version     # Should show 10.0.0 or higher
    git --version     # Should show git version 2.x.x
    ```
3. If any command fails, install the missing software from the links above

**Problem: "The terminal commands don't work"**

1. Make sure you're in the right folder: `cd TheNoMercyApp`
2. Try cleaning and reinstalling: `rm -rf node_modules && npm install`
3. Check you have internet connection for downloading packages

**Problem: "I'm not technical, this seems complicated"**

-   Don't worry! The setup is a one-time process
-   Follow the prerequisites section step by step
-   Ask for help in our [GitHub Issues](https://github.com/yourusername/TheNoMercyApp/issues)
-   Include your operating system and any error messages you see

---

## 🤝 **Contributing**

We welcome contributions! Here's how to get started:

### **Quick Contribution**

1. 🍴 **Fork** the repository
2. 🌿 **Branch**: `git checkout -b feature/your-feature`
3. ✍️ **Code**: Make your improvements
4. 🧪 **Test**: `npm run install-app` to verify builds
5. 📤 **Submit**: Pull request with description

### **Development Workflow**

```bash
# Setup
git clone your-fork-url
cd TheNoMercyApp
npm install

# Develop
npm run electron-dev    # Live development
npm run build          # Test production build
npm run install-app    # Full build test

# Quality checks
npm run lint           # Code style
npm test              # Unit tests (if available)
```

---

## 📁 **Data & Privacy**

### **Where Your Data Lives**

-   **Development Mode**: Project directory (`games-data.csv`)
-   **Production Mode**: `~/Documents/No Mercy Tracker/games-data.csv`
-   **Format**: Human-readable CSV with quoted fields
-   **Backup**: Simply copy the CSV file to backup your data
-   **Privacy**: **100% local** - no data leaves your device

### **Data Persistence Features**

-   ✅ **Automatic saving** when adding, editing, or deleting games
-   ✅ **Empty state persistence** - deleting all games saves the empty state
-   ✅ **Debug tools** - manual save button and data path display
-   ✅ **Real-time feedback** - save status messages and loading indicators
-   ✅ **Reliable storage** - data survives app restarts and system reboots

### **Debug Panel (New!)**

The app now includes a collapsible debug panel that shows:

-   📁 Current data file location
-   📊 Number of games loaded
-   ✅ Data loading status
-   💾 Manual save button with feedback
-   🔍 Development vs production mode indicator

### **Data Format**

```csv
id,date,mercyBanned,won,notes,timestamp
1751514112550,2025-07-03,true,true,"Great teamwork",2025-07-03T03:41:52.550Z
1751514118594,2025-07-03,false,false,"Mercy caused issues",2025-07-03T03:41:58.594Z
```

---

## 🎯 **Roadmap**

### **Current Version (1.0.1)**

-   ✅ Core game tracking with persistent data storage
-   ✅ Win rate statistics and real-time calculations
-   ✅ Cross-platform builds (macOS, Windows, Linux)
-   ✅ Auto-update system with GitHub integration
-   ✅ **NEW**: Reliable data persistence that survives app restarts
-   ✅ **NEW**: Debug panel with manual controls and data insights
-   ✅ **NEW**: Enhanced error handling and user feedback
-   ✅ **NEW**: Smart data storage locations for dev/production

### **Recent Improvements (v1.0.1)**

-   🔧 **Fixed Critical Data Loss Issue**: Games now persist properly when closing the app
-   🛠️ **Added Debug Tools**: Collapsible panel showing data path, save status, and manual controls
-   📁 **Improved Data Storage**: Production apps now save to `~/Documents/No Mercy Tracker/`
-   🔍 **Enhanced Logging**: Better console output and user feedback for data operations
-   ✅ **Empty State Handling**: Deleting all games now properly saves the empty state
-   💾 **Manual Save Option**: Power users can force saves with visual feedback

### **Planned Features (Future Releases)**

-   📈 **Advanced Analytics**: Trend graphs and deeper insights
-   🎮 **Hero Integration**: Track other hero bans beyond Mercy
-   📱 **Mobile Companion**: Sync with mobile app
-   🌐 **Team Features**: Share data with teammates
-   🎨 **Themes**: Dark mode and customization options
-   📊 **Export Options**: PDF reports and advanced data export

---

## 📜 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

-   **Overwatch Community** - For the inspiration and feedback
-   **Electron Team** - For the amazing desktop framework
-   **React Team** - For the powerful UI library
-   **Contributors** - Everyone who helps improve this project

---

## 📞 **Support & Community**

-   🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/TheNoMercyApp/issues)
-   💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/TheNoMercyApp/discussions)
-   📧 **Contact**: [your.email@example.com](mailto:your.email@example.com)
-   🎮 **Discord**: [Join our community](https://discord.gg/your-invite)

---

<div align="center">

**Built with ❤️ for the Overwatch community**

[⭐ Star this repo](https://github.com/yourusername/TheNoMercyApp) • [🔄 Share with friends](https://twitter.com/intent/tweet?text=Check%20out%20No%20Mercy%20Tracker!) • [📖 Read the docs](https://github.com/yourusername/TheNoMercyApp/wiki)

</div>

```bash
# Install dependencies
npm install

# Build for macOS (both Intel and Apple Silicon)
npm run dist-mac

# Build for Windows
npx electron-builder --win

# Build for Linux
npx electron-builder --linux

# Build for all platforms
npm run dist
```

## Development

### Running in Development Mode

```bash
# Start the React dev server and Electron together
npm run electron-dev

# Or run them separately:
npm run dev        # Start Vite dev server
npm run electron   # Start Electron (after dev server is running)
```

### Project Structure

```
TheNoMercyApp/
├── src/                    # React source code
│   ├── App.jsx            # Main React component
│   ├── App.css            # Application styles
│   └── assets/            # Static assets
├── public/                # Public assets
├── electron.js            # Electron main process
├── preload.js             # Electron preload script
├── install-app.js         # Cross-platform installation script
└── package.json           # Dependencies and scripts
```

### Key Technologies

-   **Frontend**: React 19 + Vite
-   **Desktop**: Electron
-   **Styling**: CSS with modern layout techniques
-   **Build**: electron-builder for cross-platform packaging
-   **Icons**: png2icons for multi-format icon generation

## Data Storage

Game data is automatically saved to a CSV file in the application directory:

-   **Location**: Same folder as the application executable
-   **Format**: CSV with columns for date, Mercy ban status, game result, and notes
-   **Privacy**: All data stays on your device - no cloud sync or data collection

## Screenshots

_Add screenshots of your application here_

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test the build: `npm run install-app`
5. Submit a pull request

## License

[Add your license here]

## Support

If you encounter any issues:

1. Check that you have Node.js 20.19+ installed
2. Try deleting `node_modules` and running `npm install` again
3. Make sure you have the `no-mercy.png` logo in the `public/` folder
4. Open an issue with your OS, Node version, and error details

---

**Built with ❤️ for the Overwatch community**
