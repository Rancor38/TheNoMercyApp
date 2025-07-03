import { app, BrowserWindow, ipcMain, Menu } from "electron"
import path from "path"
import { promises as fs } from "fs"
import isDev from "electron-is-dev"
import { fileURLToPath } from "url"
import pkg from "electron-updater"
const { autoUpdater } = pkg

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Remove all menu bar items for bare-bones interface
Menu.setApplicationMenu(null)

// Configure auto-updater
if (!isDev) {
    // Set the server URL for updates (you'll need to host your releases)
    autoUpdater.setFeedURL({
        provider: "github",
        owner: "yourusername", // Replace with your GitHub username
        repo: "TheNoMercyApp", // Replace with your repository name
        private: false,
    })

    // Auto-updater event handlers
    autoUpdater.on("checking-for-update", () => {
        console.log("Checking for update...")
    })

    autoUpdater.on("update-available", (info) => {
        console.log("Update available:", info.version)
    })

    autoUpdater.on("update-not-available", (info) => {
        console.log("Update not available:", info.version)
    })

    autoUpdater.on("error", (err) => {
        console.log("Error in auto-updater:", err)
    })

    autoUpdater.on("download-progress", (progressObj) => {
        let log_message = "Download speed: " + progressObj.bytesPerSecond
        log_message = log_message + " - Downloaded " + progressObj.percent + "%"
        log_message =
            log_message +
            " (" +
            progressObj.transferred +
            "/" +
            progressObj.total +
            ")"
        console.log(log_message)
    })

    autoUpdater.on("update-downloaded", (info) => {
        console.log("Update downloaded:", info.version)
        // Automatically install and restart
        autoUpdater.quitAndInstall()
    })
}

// Path to store CSV file in user's Documents directory (persistent and writable)
const getDataPath = () => {
    if (isDev) {
        // During development, save in project directory for easy access
        return path.join(__dirname, "games-data.csv")
    } else {
        // In production, save in user's Documents directory
        const documentsPath = app.getPath("documents")
        const appDataDir = path.join(documentsPath, "No Mercy Tracker")

        // Ensure the directory exists
        try {
            if (!require("fs").existsSync(appDataDir)) {
                require("fs").mkdirSync(appDataDir, { recursive: true })
            }
        } catch (error) {
            console.error("Error creating app data directory:", error)
        }

        return path.join(appDataDir, "games-data.csv")
    }
}

const CSV_FILE_PATH = getDataPath()

// Log the data file location for debugging
console.log("No Mercy Tracker data will be saved to:", CSV_FILE_PATH)
console.log("Running in development mode:", isDev)

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
        icon: path.join(__dirname, "build-assets", "icon.icns"),
        titleBarStyle: "default",
        show: false,
    })

    // Show window when ready to prevent visual flash
    mainWindow.once("ready-to-show", () => {
        mainWindow.show()
    })

    if (isDev) {
        mainWindow.loadURL("http://localhost:5176")
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, "dist", "index.html"))
    }
}

// Helper function to convert games array to CSV format
function gamesToCSV(games) {
    if (!games || games.length === 0) return ""

    const headers = ["id", "date", "mercyBanned", "won", "notes", "timestamp"]
    const csvContent = [
        headers.join(","),
        ...games.map((game) =>
            [
                game.id || "",
                game.date || "",
                game.mercyBanned ? "true" : "false",
                game.won ? "true" : "false",
                `"${(game.notes || "").replace(/"/g, '""')}"`, // Escape quotes in notes
                game.timestamp || "",
            ].join(",")
        ),
    ].join("\n")

    return csvContent
}

// Helper function to parse CSV data back to games array
function csvToGames(csvContent) {
    if (!csvContent.trim()) return []

    const lines = csvContent.trim().split("\n")
    if (lines.length <= 1) return [] // Only header or empty

    const headers = lines[0].split(",")
    const games = []

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",")
        const game = {}

        headers.forEach((header, index) => {
            let value = values[index] || ""

            // Remove quotes from notes field
            if (header === "notes") {
                value = value.replace(/^"(.*)"$/, "$1").replace(/""/g, '"')
            }

            // Convert boolean strings
            if (header === "mercyBanned" || header === "won") {
                value = value === "true"
            }

            // Convert numeric ID
            if (header === "id") {
                value = parseInt(value) || Date.now()
            }

            game[header] = value
        })

        games.push(game)
    }

    return games
}

// IPC handler to load games from CSV file
ipcMain.handle("load-games", async () => {
    try {
        console.log("Loading games from:", CSV_FILE_PATH)
        const csvContent = await fs.readFile(CSV_FILE_PATH, "utf-8")
        const games = csvToGames(csvContent)
        console.log("Successfully loaded", games.length, "games")
        return games
    } catch (error) {
        // File doesn't exist yet, return empty array
        if (error.code === "ENOENT") {
            console.log("No data file found, starting with empty game list")
            return []
        }
        console.error("Error loading games:", error)
        throw error
    }
})

// IPC handler to save games to CSV file
ipcMain.handle("save-games", async (event, games) => {
    try {
        console.log("Saving", games.length, "games to:", CSV_FILE_PATH)
        const csvContent = gamesToCSV(games)
        await fs.writeFile(CSV_FILE_PATH, csvContent, "utf-8")
        console.log("Games saved successfully")
        return true
    } catch (error) {
        console.error("Error saving games:", error)
        throw error
    }
})

// IPC handlers for auto-updater
ipcMain.handle("check-for-updates", async () => {
    if (isDev) {
        return {
            available: false,
            message: "Updates not available in development mode",
        }
    }

    try {
        const result = await autoUpdater.checkForUpdates()
        return {
            available: true,
            version: result?.updateInfo?.version || "unknown",
            message: "Update check completed",
        }
    } catch (error) {
        return { available: false, message: error.message }
    }
})

ipcMain.handle("get-app-version", async () => {
    return app.getVersion()
})

ipcMain.handle("get-data-path", async () => {
    return CSV_FILE_PATH
})

app.whenReady().then(() => {
    createWindow()

    // Check for updates after app is ready (only in production)
    if (!isDev) {
        // Wait 3 seconds after startup before checking for updates
        setTimeout(() => {
            console.log("Checking for app updates...")
            autoUpdater.checkForUpdatesAndNotify()
        }, 3000)
    }
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
