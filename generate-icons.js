import png2icons from "png2icons"
import fs from "fs"
import path from "path"
import sharp from "sharp"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to create a round icon with padding
async function createRoundIcon(inputPath, size = 1024) {
    try {
        const padding = 40 // 20px padding on each side
        const innerSize = size - padding

        // First, resize the image to fit within the inner circle
        const resizedImage = await sharp(inputPath)
            .resize(innerSize, innerSize, {
                fit: "cover",
                position: "center",
            })
            .png()
            .toBuffer()

        // Create a circular mask
        const mask = Buffer.from(`
            <svg width="${innerSize}" height="${innerSize}">
                <circle cx="${innerSize / 2}" cy="${innerSize / 2}" r="${
            innerSize / 2
        }" fill="white"/>
            </svg>
        `)

        // Apply the circular mask to make it round
        const roundImage = await sharp(resizedImage)
            .composite([
                {
                    input: mask,
                    blend: "dest-in",
                },
            ])
            .png()
            .toBuffer()

        // Create final icon with transparent background and centered round image
        const finalIcon = await sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .composite([
                {
                    input: roundImage,
                    left: padding / 2,
                    top: padding / 2,
                },
            ])
            .png()
            .toBuffer()

        return finalIcon
    } catch (error) {
        console.warn(
            "⚠️  Could not create round icon, using original:",
            error.message
        )
        // Fallback to original image
        return fs.readFileSync(inputPath)
    }
}

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

        console.log("🔄 Creating round icon from no-mercy.png...")
        const roundIconBuffer = await createRoundIcon(inputPath, 1024)

        console.log("🔄 Generating ICNS file for macOS...")
        const icns = png2icons.createICNS(roundIconBuffer, png2icons.BICUBIC, 0)
        fs.writeFileSync(path.join(buildAssetsDir, "icon.icns"), icns)

        console.log("🔄 Generating ICO file for Windows...")
        const ico = png2icons.createICO(
            roundIconBuffer,
            png2icons.BICUBIC,
            0,
            false
        )
        fs.writeFileSync(path.join(buildAssetsDir, "icon.ico"), ico)

        console.log("🔄 Generating PNG file for Linux...")
        fs.writeFileSync(path.join(buildAssetsDir, "icon.png"), roundIconBuffer)

        console.log("✅ Round icon files generated successfully!")
        console.log("📁 Generated: build-assets/icon.icns (macOS)")
        console.log("📁 Generated: build-assets/icon.ico (Windows)")
        console.log("📁 Generated: build-assets/icon.png (Linux)")
        console.log("🎯 All icons are now round and use the no-mercy image!")
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
                // Read the input PNG file
                const input = fs.readFileSync(inputPath)

                // Copy PNG as fallback icon
                fs.copyFileSync(
                    inputPath,
                    path.join(buildAssetsDir, "icon.png")
                )

                // Try to create basic ICNS
                const icns = png2icons.createICNS(input, png2icons.BICUBIC, 0)
                fs.writeFileSync(path.join(buildAssetsDir, "icon.icns"), icns)

                // Try to create basic ICO
                const ico = png2icons.createICO(
                    input,
                    png2icons.BICUBIC,
                    0,
                    false
                )
                fs.writeFileSync(path.join(buildAssetsDir, "icon.ico"), ico)

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
