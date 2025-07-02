const { app, BrowserWindow, ipcMain, Menu } = require("electron")
const path = require("path")
const fs = require("fs").promises
const isDev = require("electron-is-dev")

// Remove all menu bar items for bare-bones interface
Menu.setApplicationMenu(null)

// Path to store CSV file in app directory
const CSV_FILE_PATH = path.join(__dirname, "games-data.csv")

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
        const csvContent = await fs.readFile(CSV_FILE_PATH, "utf-8")
        return csvToGames(csvContent)
    } catch (error) {
        // File doesn't exist yet, return empty array
        if (error.code === "ENOENT") {
            return []
        }
        console.error("Error loading games:", error)
        throw error
    }
})

// IPC handler to save games to CSV file
ipcMain.handle("save-games", async (event, games) => {
    try {
        const csvContent = gamesToCSV(games)
        await fs.writeFile(CSV_FILE_PATH, csvContent, "utf-8")
        return true
    } catch (error) {
        console.error("Error saving games:", error)
        throw error
    }
})

app.whenReady().then(createWindow)

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
