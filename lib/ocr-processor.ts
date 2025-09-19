import { createWorker } from 'tesseract.js';

// Cache worker to avoid creating multiple instances
let ocrWorker: any = null;

async function getOcrWorker() {
  if (!ocrWorker) {
    ocrWorker = createWorker();
    
    await ocrWorker.load();
    await ocrWorker.loadLanguage('eng');
    await ocrWorker.initialize('eng', {
      logger: (m: any) => console.log('[OCR]', m),
    });
  }
  return ocrWorker;
}

export async function extractTextWithOcr(imageData: ImageData): Promise<string> {
  try {
    console.log('[OCR] Starting OCR processing...');
    const worker = await getOcrWorker();
    const result = await worker.recognize(imageData);
    console.log('[OCR] OCR completed, extracted:', result.data.text.length, 'characters');
    return result.data.text;
  } catch (error) {
    console.error('[OCR] Failed to extract text:', error);
    throw new Error('OCR text extraction failed');
  }
}

// Enhanced OCR function for canvas elements
export async function extractTextFromCanvas(canvas: HTMLCanvasElement): Promise<string> {
  try {
    console.log('[OCR] Starting canvas OCR processing...');
    console.log('[OCR] Canvas dimensions:', canvas.width, 'x', canvas.height);
    
    // Use the existing cached worker for better performance
    const worker = await getOcrWorker();
    
    console.log('[OCR] Recognizing text from canvas...');
    const result = await worker.recognize(canvas);
    
    const extractedText = result.data.text.trim();
    console.log('[OCR] Canvas OCR completed, extracted:', extractedText.length, 'characters');
    if (extractedText.length > 0) {
      console.log('[OCR] First 100 chars:', extractedText.substring(0, 100));
    } else {
      console.log('[OCR] No text extracted from canvas');
    }
    
    return extractedText;
  } catch (error) {
    console.error('[OCR] Canvas OCR failed:', error);
    // Don't throw error, return empty string to continue processing
    return '';
  }
}

// Clean up worker when needed
export async function cleanupOcrWorker() {
  if (ocrWorker) {
    await ocrWorker.terminate();
    ocrWorker = null;
  }
}
