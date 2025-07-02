const { contextBridge, ipcRenderer } = require("electron")

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
    loadGames: () => ipcRenderer.invoke("load-games"),
    saveGames: (games) => ipcRenderer.invoke("save-games", games),
})
