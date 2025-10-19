import { createWorker } from 'tesseract.js'    // Canvas OCR completed/ Cache worker to avoid creating multiple instances
let ocrWorker: any = null;

async function getOcrWorker() {
  if (!ocrWorker) {
    ocrWorker = createWorker();
    
    await ocrWorker.load();
    await ocrWorker.loadLanguage('eng');
    await ocrWorker.initialize('eng', {
      logger: (m: any) => {}, // Silent logger
    });
    
    // Configure Tesseract for better accuracy
    await ocrWorker.setParameters({
      tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
      preserve_interword_spaces: '1', // Preserve spaces between words
      tessedit_char_whitelist: '', // Allow all characters
    });
  }
  return ocrWorker;
}

export async function extractTextWithOcr(imageData: ImageData): Promise<string> {
  try {
    const worker = await getOcrWorker();
    const result = await worker.recognize(imageData);

    let text = result.data.text.trim();
    
    // Post-process to fix common OCR errors
    text = postProcessOcrText(text);
    
    return text;
  } catch (error) {
    // OCR failed to extract text
    throw new Error('OCR text extraction failed');
  }
}

// Enhanced OCR function for canvas elements
export async function extractTextFromCanvas(canvas: HTMLCanvasElement): Promise<string> {
  try {
    console.log('[OCR] Starting OCR on canvas:', canvas.width, 'x', canvas.height);
    
    // Preprocess image for better OCR
    const preprocessedCanvas = preprocessImage(canvas);
    
    // Use the existing cached worker for better performance
    const worker = await getOcrWorker();
    
    console.log('[OCR] Worker ready, starting recognition...');

    const result = await worker.recognize(preprocessedCanvas);
    
    let extractedText = result.data.text.trim();
    
    // Post-process to fix common OCR errors
    extractedText = postProcessOcrText(extractedText);
    
    console.log('[OCR] Canvas OCR completed, extracted:', extractedText.length, 'characters');
    console.log('[OCR] Confidence:', result.data.confidence);
    
    if (extractedText.length > 0) {
      console.log('[OCR] First 200 chars:', extractedText.substring(0, 200));
    } else {
      console.warn('[OCR] No text extracted from canvas - image might be blank or unreadable');
    }
    
    return extractedText;
  } catch (error) {
    console.error('[OCR] Canvas OCR failed:', error);
    // Don't throw error, return empty string to continue processing
    return '';
  }
}

// Preprocess image to improve OCR accuracy
function preprocessImage(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  // Create new canvas for preprocessing
  const processedCanvas = document.createElement('canvas');
  processedCanvas.width = canvas.width;
  processedCanvas.height = canvas.height;
  const processedCtx = processedCanvas.getContext('2d');
  if (!processedCtx) return canvas;
  
  // Draw original image
  processedCtx.drawImage(canvas, 0, 0);
  
  // Get image data
  const imageData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
  const data = imageData.data;
  
  // Convert to grayscale and increase contrast
  for (let i = 0; i < data.length; i += 4) {
    // Grayscale conversion
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    
    // Increase contrast (threshold)
    const threshold = 128;
    const value = gray > threshold ? 255 : 0;
    
    data[i] = value;     // R
    data[i + 1] = value; // G
    data[i + 2] = value; // B
    // Alpha stays the same
  }
  
  processedCtx.putImageData(imageData, 0, 0);
  
  return processedCanvas;
}

// Post-process OCR text to fix common errors
function postProcessOcrText(text: string): string {
  // Remove extra spaces between characters in words
  // Fix patterns like "h ttp s" -> "https"
  text = text.replace(/(\w)\s+(?=\w)/g, (match, char) => {
    // If space is between single characters (likely OCR error), remove it
    if (match.length <= 3) {
      return char;
    }
    return match;
  });
  
  // Fix common URL patterns
  text = text.replace(/h\s*t\s*t\s*p\s*s?\s*:\s*\/\s*\//gi, (match) => {
    return match.toLowerCase().includes('https') ? 'https://' : 'http://';
  });
  
  // Fix common words that get split
  const commonWords = [
    { pattern: /c\s*o\s*u\s*r\s*s\s*e\s*r\s*a/gi, replacement: 'Coursera' },
    { pattern: /v\s*e\s*r\s*i\s*f\s*y/gi, replacement: 'verify' },
    { pattern: /c\s*o\s*n\s*f\s*i\s*r\s*m\s*e\s*d/gi, replacement: 'confirmed' },
    { pattern: /i\s*d\s*e\s*n\s*t\s*i\s*t\s*y/gi, replacement: 'identity' },
    { pattern: /i\s*n\s*d\s*i\s*v\s*i\s*d\s*u\s*a\s*l/gi, replacement: 'individual' },
    { pattern: /p\s*a\s*r\s*t\s*i\s*c\s*i\s*p\s*a\s*t\s*i\s*o\s*n/gi, replacement: 'participation' },
  ];
  
  commonWords.forEach(({ pattern, replacement }) => {
    text = text.replace(pattern, replacement);
  });
  
  // Clean up multiple consecutive spaces
  text = text.replace(/\s{2,}/g, ' ');
  
  return text;
}

// Clean up worker when needed
export async function cleanupOcrWorker() {
  if (ocrWorker) {
    await ocrWorker.terminate();
    ocrWorker = null;
  }
}
