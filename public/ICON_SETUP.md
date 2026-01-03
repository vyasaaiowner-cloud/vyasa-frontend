# Generate PWA Icons

You need to convert the SVG icons to PNG format for proper PWA support.

## Option 1: Using Online Tools
1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload a logo or use the SVG icons created
3. Download the generated icon pack
4. Replace the SVG files with PNG files in the public directory

## Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Then run:
magick icon-192x192.svg icon-192x192.png
magick icon-256x256.svg icon-256x256.png
magick icon-384x384.svg icon-384x384.png
magick icon-512x512.svg icon-512x512.png
magick apple-touch-icon.svg apple-touch-icon.png
```

## Required Icon Files
- icon-192x192.png (maskable)
- icon-256x256.png
- icon-384x384.png
- icon-512x512.png
- apple-touch-icon.png (for iOS)
- favicon.ico (optional)

## Quick Setup
The SVG placeholders have been created. Replace them with your actual logo for production.
