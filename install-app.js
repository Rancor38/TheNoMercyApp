#!/usr/bin/env node

/**
 * Cross-platform installation script for No Mercy Tracker
 * Detects OS and architecture, builds the appropriate Electron app,
 * and places it in a folder adjacent to the repository.
 */

import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import os from "os"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ANSI color codes for console output
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
}

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`)
}

function detectPlatform() {
    const platform = os.platform()
    const arch = os.arch()

    log(`\n🔍 Detecting system...`, colors.cyan)
    log(`   Platform: ${platform}`)
    log(`   Architecture: ${arch}`)

    return { platform, arch }
}

function getElectronBuilderTarget(platform, arch) {
    switch (platform) {
        case "darwin": // macOS
            // Map Node.js arch to Electron Builder arch
            const macArch = arch === "arm64" ? "arm64" : "x64"
            return {
                target: "dmg",
                platform: "mac",
                arch: macArch,
                flag: "--mac",
                outputName: macArch === "arm64" ? "arm64" : "x64",
            }
        case "win32": // Windows
            const winArch = arch === "x64" ? "x64" : "ia32"
            return {
                target: "nsis",
                platform: "win",
                arch: winArch,
                flag: "--win",
                outputName: winArch,
            }
        case "linux":
            return {
                target: "AppImage",
                platform: "linux",
                arch: "x64",
                flag: "--linux",
                outputName: "x64",
            }
        default:
            throw new Error(`Unsupported platform: ${platform}`)
    }
}

function runCommand(command, description) {
    log(`\n⚙️  ${description}...`, colors.yellow)
    try {
        execSync(command, {
            stdio: "inherit",
            cwd: __dirname,
            env: { ...process.env },
        })
        log(`✅ ${description} completed successfully!`, colors.green)
    } catch (error) {
        log(`❌ ${description} failed!`, colors.red)
        throw error
    }
}

function createOutputDirectory() {
    // Create output directory NEXT TO the project, not inside it
    const projectName = path.basename(__dirname)
    const parentDir = path.dirname(__dirname)
    const outputDir = path.join(parentDir, `${projectName}-Built`)

    log(`\n📁 Creating output directory: ${outputDir}`, colors.cyan)

    if (fs.existsSync(outputDir)) {
        log(`   Directory already exists, cleaning it...`, colors.yellow)
        fs.rmSync(outputDir, { recursive: true, force: true })
    }

    fs.mkdirSync(outputDir, { recursive: true })
    return outputDir
}

function copyBuiltApp(buildInfo, outputDir) {
    const releaseDir = path.join(__dirname, "release")

    log(`\n📦 Copying built application...`, colors.cyan)

    // Check if release directory exists
    if (!fs.existsSync(releaseDir)) {
        throw new Error(`Release directory not found: ${releaseDir}`)
    }

    try {
        const files = fs.readdirSync(releaseDir)

        if (buildInfo.platform === "mac") {
            // Copy .dmg file for macOS
            const dmgPattern =
                buildInfo.arch === "arm64"
                    ? /No Mercy Tracker.*-arm64\.dmg$/
                    : /No Mercy Tracker.*\.dmg$/

            const dmgFile = files.find(
                (file) => dmgPattern.test(file) && !file.includes("blockmap")
            )

            if (dmgFile) {
                const sourcePath = path.join(releaseDir, dmgFile)
                const targetPath = path.join(outputDir, dmgFile)
                fs.copyFileSync(sourcePath, targetPath)
                log(`   ✅ Copied: ${dmgFile}`, colors.green)
            } else {
                log(
                    `   ❌ DMG file not found for ${buildInfo.arch}`,
                    colors.red
                )
            }

            // Also copy the .app bundle for direct use
            const appDir = buildInfo.arch === "arm64" ? "mac-arm64" : "mac"
            const appPath = path.join(
                releaseDir,
                appDir,
                "No Mercy Tracker.app"
            )

            if (fs.existsSync(appPath)) {
                const targetAppPath = path.join(
                    outputDir,
                    "No Mercy Tracker.app"
                )

                // Copy the entire .app bundle
                execSync(`cp -R "${appPath}" "${targetAppPath}"`)
                log(`   ✅ Copied: No Mercy Tracker.app`, colors.green)
            }
        } else if (buildInfo.platform === "win") {
            // Copy .exe installer for Windows
            const exeFile = files.find((file) => file.endsWith(".exe"))
            if (exeFile) {
                const sourcePath = path.join(releaseDir, exeFile)
                const targetPath = path.join(outputDir, exeFile)
                fs.copyFileSync(sourcePath, targetPath)
                log(`   ✅ Copied: ${exeFile}`, colors.green)
            }
        } else if (buildInfo.platform === "linux") {
            // Copy AppImage for Linux
            const appImageFile = files.find((file) =>
                file.endsWith(".AppImage")
            )
            if (appImageFile) {
                const sourcePath = path.join(releaseDir, appImageFile)
                const targetPath = path.join(outputDir, appImageFile)
                fs.copyFileSync(sourcePath, targetPath)
                log(`   ✅ Copied: ${appImageFile}`, colors.green)
            }
        }
    } catch (error) {
        log(`   ❌ Error copying files: ${error.message}`, colors.red)
        throw error
    }
}

function createReadme(outputDir, buildInfo) {
    const readmeContent = `# No Mercy Tracker - Ready to Install

This folder contains the built No Mercy Tracker application for your system.

## System Information
- **Platform**: ${
        buildInfo.platform === "mac"
            ? "macOS"
            : buildInfo.platform === "win"
            ? "Windows"
            : "Linux"
    }
- **Architecture**: ${buildInfo.arch}
- **Build Date**: ${new Date().toLocaleString()}

## Installation Instructions

${
    buildInfo.platform === "mac"
        ? `### macOS
1. **Option A - DMG Installer**: Double-click the \`.dmg\` file and drag the app to Applications
2. **Option B - Direct Use**: Double-click \`No Mercy Tracker.app\` to run directly

**Note**: You may need to right-click → "Open" the first time due to macOS security settings.
`
        : ""
}${
        buildInfo.platform === "win"
            ? `### Windows
1. Double-click the \`.exe\` installer file
2. Follow the installation wizard
3. The app will be available in your Start Menu
`
            : ""
    }${
        buildInfo.platform === "linux"
            ? `### Linux
1. Make the AppImage executable: \`chmod +x *.AppImage\`
2. Double-click the AppImage file to run
3. Or run from terminal: \`./No-Mercy-Tracker*.AppImage\`
`
            : ""
    }
## About No Mercy Tracker

Track your Overwatch games and analyze the effectiveness of banning Mercy!

- **Spreadsheet-like interface** for easy game tracking
- **Statistics dashboard** comparing win rates with/without Mercy banned
- **Local data storage** - your data stays on your device
- **Clean, modern UI** focused on data entry and analysis

## Data Storage

Your game data is automatically saved to a CSV file in the application directory. This ensures your data persists between app launches and can be easily backed up or transferred.

---

For issues or updates, visit: https://github.com/your-username/NoMercyTracker-Releases
`

    const readmePath = path.join(outputDir, "README.md")
    fs.writeFileSync(readmePath, readmeContent)
    log(`   ✅ Created installation README`, colors.green)
}

// Function to automatically open the distribution file
async function autoOpenDistribution(buildInfo) {
    try {
        log(`\n🚀 Opening distribution file...`, colors.cyan)

        const releaseDir = path.join(__dirname, "release")
        const packageJsonPath = path.join(__dirname, "package.json")
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
        const version = packageJson.version

        let distFileName = ""
        let openCommand = ""

        if (buildInfo.platform === "mac") {
            // For macOS, open the appropriate DMG file
            if (buildInfo.arch === "arm64") {
                distFileName = `No Mercy Tracker-${version}-arm64.dmg`
            } else {
                distFileName = `No Mercy Tracker-${version}.dmg`
            }
            openCommand = `open "${path.join(releaseDir, distFileName)}"`
        } else if (buildInfo.platform === "win") {
            // For Windows, open the installer
            distFileName = `No Mercy Tracker Setup ${version}.exe`
            openCommand = `start "${path.join(releaseDir, distFileName)}"`
        } else if (buildInfo.platform === "linux") {
            // For Linux, open the file manager to the release directory
            openCommand = `xdg-open "${releaseDir}"`
        }

        const distFilePath = path.join(releaseDir, distFileName)

        if (fs.existsSync(distFilePath)) {
            execSync(openCommand, { stdio: "inherit" })
            log(`   ✅ Opened: ${distFileName}`, colors.green)
        } else {
            log(
                `   ⚠️  Distribution file not found: ${distFileName}`,
                colors.yellow
            )
            // Fallback: open the release directory
            const fallbackCommand =
                buildInfo.platform === "mac"
                    ? `open "${releaseDir}"`
                    : buildInfo.platform === "win"
                    ? `start "${releaseDir}"`
                    : `xdg-open "${releaseDir}"`
            execSync(fallbackCommand, { stdio: "inherit" })
            log(`   ✅ Opened release directory instead`, colors.green)
        }
    } catch (error) {
        log(
            `   ⚠️  Could not auto-open distribution: ${error.message}`,
            colors.yellow
        )
        log(
            `   💡 You can manually open the file from the release/ directory`,
            colors.cyan
        )
    }
}

async function main() {
    try {
        log(`${colors.bright}${colors.magenta}`, colors.magenta)
        log(`╔══════════════════════════════════════════════════════════╗`)
        log(`║                  No Mercy Tracker                       ║`)
        log(`║                 Installation Script                     ║`)
        log(`╚══════════════════════════════════════════════════════════╝`)
        log(``, colors.reset)

        // Detect platform and architecture
        const { platform, arch } = detectPlatform()
        const buildInfo = getElectronBuilderTarget(platform, arch)

        log(`\n🎯 Target build configuration:`, colors.cyan)
        log(`   Target: ${buildInfo.target}`)
        log(`   Platform: ${buildInfo.platform}`)
        log(`   Architecture: ${buildInfo.arch}`)

        // Check if Node.js and npm are available
        log(`\n🔍 Checking prerequisites...`, colors.cyan)
        try {
            execSync("node --version", { stdio: "pipe" })
            execSync("npm --version", { stdio: "pipe" })
            log(`   ✅ Node.js and npm are available`, colors.green)
        } catch (error) {
            throw new Error(
                "Node.js and npm are required but not found in PATH"
            )
        }

        // Install dependencies
        runCommand("npm install", "Installing dependencies")

        // Generate icons
        runCommand("npm run generate-icons", "Generating application icons")

        // Build the web app
        runCommand("npm run build", "Building React application")

        // Build the Electron app for the detected platform
        const buildCommand = `npx electron-builder ${buildInfo.flag} --${buildInfo.arch}`
        runCommand(
            buildCommand,
            `Building Electron app for ${buildInfo.platform} (${buildInfo.arch})`
        )

        // Create output directory
        const outputDir = createOutputDirectory()

        // Copy built application
        copyBuiltApp(buildInfo, outputDir)

        // Create README with installation instructions
        createReadme(outputDir, buildInfo)

        // Auto-open the distribution file
        await autoOpenDistribution(buildInfo)

        log(
            `\n${colors.bright}${colors.green}🎉 Installation completed successfully!${colors.reset}`
        )
        log(
            `\n📍 Your app is ready at: ${colors.cyan}${outputDir}${colors.reset}`
        )
        log(
            `\n📖 Check the README.md in that folder for installation instructions.`
        )

        if (buildInfo.platform === "mac") {
            log(
                `\n💡 Quick start: Double-click the .app file to run immediately!`,
                colors.yellow
            )
        }

        log(
            `\n✨ New in v1.0.1: Enhanced data persistence and debug tools!`,
            colors.magenta
        )
        log(
            `   📁 Game data now saves to ~/Documents/No Mercy Tracker/`,
            colors.cyan
        )
        log(
            `   🛠️ Use the debug panel for manual saves and troubleshooting`,
            colors.cyan
        )
    } catch (error) {
        log(`\n❌ Installation failed: ${error.message}`, colors.red)
        process.exit(1)
    }
}

// Run the installation
main()
