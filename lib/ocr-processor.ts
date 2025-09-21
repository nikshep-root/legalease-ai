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
  }
  return ocrWorker;
}

export async function extractTextWithOcr(imageData: ImageData): Promise<string> {
  try {

    const worker = await getOcrWorker();
    const result = await worker.recognize(imageData);

    return result.data.text;
  } catch (error) {
    // OCR failed to extract text
    throw new Error('OCR text extraction failed');
  }
}

// Enhanced OCR function for canvas elements
export async function extractTextFromCanvas(canvas: HTMLCanvasElement): Promise<string> {
  try {

    
    // Use the existing cached worker for better performance
    const worker = await getOcrWorker();
    

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
    // Canvas OCR failed
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
