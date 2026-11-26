/**
 * Client-side image compression utility using HTML5 Canvas.
 * Resizes uploaded executive portraits or partner logos so they stay crisp, fast, and lightweight.
 */
export function compressImageFile(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number; preserveTransparency?: boolean } = {}
): Promise<string> {
  const { maxWidth = 420, maxHeight = 420, quality = 0.84, preserveTransparency = false } = options

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (PNG, JPG, WebP, or SVG).'))
      return
    }

    // SVG files are already vector and lightweight
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(new Error('Failed to read SVG file.'))
      reader.readAsDataURL(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(String(e.target?.result || ''))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        const mime = preserveTransparency || file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const dataUrl = canvas.toDataURL(mime, quality)
        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('Could not decode image file.'))
      img.src = String(e.target?.result || '')
    }
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.readAsDataURL(file)
  })
}
