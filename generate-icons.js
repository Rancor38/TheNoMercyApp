import png2icons from "png2icons"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generateIcons() {
    try {
        console.log("🔄 Generating application icons...")
        
        const inputPath = path.join(__dirname, "public/no-mercy.png")
        
        // Check if input file exists
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input PNG file not found: ${inputPath}`)
        }
        
        // Create build-assets directory if it doesn't exist
        const buildAssetsDir = path.join(__dirname, "build-assets")
        if (!fs.existsSync(buildAssetsDir)) {
            fs.mkdirSync(buildAssetsDir)
        }

        // Read the input PNG file
        const input = fs.readFileSync(inputPath)
        
        console.log("🔄 Generating ICNS file for macOS...")
        const icns = png2icons.createICNS(input, png2icons.BICUBIC, 0)
        fs.writeFileSync(path.join(buildAssetsDir, "icon.icns"), icns)

        console.log("🔄 Generating ICO file for Windows...")
        const ico = png2icons.createICO(input, png2icons.BICUBIC, 0, false)
        fs.writeFileSync(path.join(buildAssetsDir, "icon.ico"), ico)

        console.log("🔄 Generating PNG file for Linux...")
        fs.copyFileSync(inputPath, path.join(buildAssetsDir, "icon.png"))

        console.log("✅ Multi-platform icon files generated successfully!")
        console.log("📁 Generated: build-assets/icon.icns (macOS)")
        console.log("📁 Generated: build-assets/icon.ico (Windows)")
        console.log("📁 Generated: build-assets/icon.png (Linux)")
        
    } catch (error) {
        console.error("❌ Error generating icons:", error.message)
        console.log("📝 Creating fallback icons...")
        
        // Fallback: Create build-assets directory and copy the PNG as basic icons
        try {
            const buildAssetsDir = path.join(__dirname, "build-assets")
            if (!fs.existsSync(buildAssetsDir)) {
                fs.mkdirSync(buildAssetsDir)
            }
            
            const inputPath = path.join(__dirname, "public/no-mercy.png")
            if (fs.existsSync(inputPath)) {
                // Copy PNG as fallback icon
                fs.copyFileSync(inputPath, path.join(buildAssetsDir, "icon.png"))
                
                // Try to create basic ICNS
                const input = fs.readFileSync(inputPath)
                const icns = png2icons.createICNS(input, png2icons.BICUBIC, 0)
                fs.writeFileSync(path.join(buildAssetsDir, "icon.icns"), icns)
                
                console.log("✅ Fallback icons generated successfully")
            } else {
                console.error("❌ No input PNG file found for fallback")
                // Create a minimal build-assets directory so the build doesn't fail
                fs.mkdirSync(buildAssetsDir, { recursive: true })
            }
        } catch (fallbackError) {
            console.error("❌ Fallback also failed:", fallbackError.message)
            // Ensure build-assets exists even if empty
            const buildAssetsDir = path.join(__dirname, "build-assets")
            fs.mkdirSync(buildAssetsDir, { recursive: true })
        }
    }
}

generateIcons()
