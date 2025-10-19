'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, X, Check, Plus, Upload, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { extractTextFromCanvas } from '@/lib/ocr-processor';

interface CapturedImage {
  id: string;
  dataUrl: string;
  file: File;
  timestamp: number;
}

interface MobileCameraScannerProps {
  onComplete?: (files: File[]) => void;
  onCancel?: () => void;
}

export default function MobileCameraScanner({ onComplete, onCancel }: MobileCameraScannerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please allow camera permissions or use file upload.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Toggle camera (front/back)
  const toggleCamera = async () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(() => startCamera(), 100);
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create file
    canvas.toBlob((blob) => {
      if (!blob) return;

      const timestamp = Date.now();
      const file = new File([blob], `scan-${timestamp}.jpg`, {
        type: 'image/jpeg',
      });

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      const newImage: CapturedImage = {
        id: `img-${timestamp}`,
        dataUrl,
        file,
        timestamp,
      };

      setCapturedImages(prev => [...prev, newImage]);
    }, 'image/jpeg', 0.92);
  };

  // Remove captured image
  const removeImage = (id: string) => {
    setCapturedImages(prev => prev.filter(img => img.id !== id));
  };

  // Handle file input (alternative to camera)
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newImage: CapturedImage = {
          id: `file-${Date.now()}-${index}`,
          dataUrl,
          file,
          timestamp: Date.now() + index,
        };
        setCapturedImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Process and upload all images
  const processAndUpload = async () => {
    if (capturedImages.length === 0) return;

    setIsProcessing(true);
    stopCamera();

    try {
      // Process all images with OCR
      let combinedText = '';
      
      for (let i = 0; i < capturedImages.length; i++) {
        const image = capturedImages[i];
        
        // Create a temporary canvas to extract text from image
        const tempCanvas = document.createElement('canvas');
        const tempImg = new Image();
        
        // Wait for image to load
        await new Promise((resolve, reject) => {
          tempImg.onload = resolve;
          tempImg.onerror = reject;
          tempImg.src = image.dataUrl;
        });
        
        // Set canvas size and draw image
        tempCanvas.width = tempImg.width;
        tempCanvas.height = tempImg.height;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');
        
        ctx.drawImage(tempImg, 0, 0);
        
        // Extract text using OCR
        const pageText = await extractTextFromCanvas(tempCanvas);
        
        if (capturedImages.length > 1) {
          combinedText += `\n\n=== Page ${i + 1} ===\n\n${pageText}`;
        } else {
          combinedText = pageText;
        }
      }

      if (!combinedText || combinedText.trim().length === 0) {
        throw new Error('No text could be extracted from the images. Please ensure the document is clear and well-lit.');
      }

      // Send extracted text to analyze API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: combinedText,
          fileName: `scanned-document-${Date.now()}.jpg`,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();

      // Navigate to results page
      if (result.documentId) {
        router.push(`/results/${result.documentId}`);
      } else {
        // Fallback: store result in localStorage and navigate
        const analysisId = `analysis_scan_${Date.now()}`;
        localStorage.setItem(analysisId, JSON.stringify(result.analysis));
        router.push(`/results/${analysisId}`);
      }

      // Call completion callback
      if (onComplete) {
        onComplete(capturedImages.map(img => img.file));
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process document. Please try again.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Document Scanner</h2>
              <p className="text-sm text-muted-foreground">
                Scan documents using your camera or upload images
              </p>
            </div>
            {onCancel && (
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Camera controls */}
          {!isCameraActive && capturedImages.length === 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={startCamera}
                className="flex-1"
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                Start Camera
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Images
              </Button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handleFileInput}
            className="hidden"
          />

          {/* Camera view */}
          {isCameraActive && (
            <div className="space-y-3">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Camera overlay guide */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-8 border-2 border-white/50 rounded-lg" />
                </div>
              </div>

              {/* Camera controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  size="icon"
                >
                  <X className="h-5 w-5" />
                </Button>

                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="h-16 w-16 rounded-full"
                >
                  <Camera className="h-6 w-6" />
                </Button>

                <Button
                  onClick={toggleCamera}
                  variant="outline"
                  size="icon"
                >
                  <RotateCw className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Captured images preview */}
          {capturedImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Captured Pages ({capturedImages.length})
                </h3>
                {!isCameraActive && (
                  <Button
                    onClick={startCamera}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add More
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {capturedImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative group aspect-[3/4] bg-muted rounded-lg overflow-hidden"
                  >
                    <img
                      src={image.dataUrl}
                      alt={`Scan ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Page {index + 1}
                    </div>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload button */}
              <div className="flex gap-3">
                <Button
                  onClick={processAndUpload}
                  disabled={isProcessing}
                  className="flex-1"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Extracting Text...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Analyze Document ({capturedImages.length} {capturedImages.length === 1 ? 'page' : 'pages'})
                    </>
                  )}
                </Button>
                {!isCameraActive && (
                  <Button
                    onClick={() => setCapturedImages([])}
                    variant="outline"
                    disabled={isProcessing}
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
