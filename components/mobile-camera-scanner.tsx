'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, X, Check, Plus, Upload, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Start camera
  const startCamera = async () => {
    try {
      console.log('[Camera] Starting camera with facing mode:', facingMode);
      setError(null);
      setIsVideoReady(false);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this browser');
      }
      
      let mediaStream: MediaStream | null = null;
      
      // Try with ideal constraints first
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
      } catch (idealError) {
        console.warn('[Camera] Ideal constraints failed, trying basic:', idealError);
        // Fallback to basic constraints
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
        });
      }
      
      if (!mediaStream) {
        throw new Error('Failed to get media stream');
      }
      
      console.log('[Camera] Media stream obtained:', mediaStream.active, 
        'tracks:', mediaStream.getTracks().length);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = async () => {
          console.log('[Camera] Video metadata loaded, dimensions:', 
            videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          try {
            await videoRef.current?.play();
            console.log('[Camera] Video playing');
          } catch (playErr) {
            console.error('[Camera] Play error:', playErr);
          }
        };
        
        videoRef.current.oncanplay = () => {
          console.log('[Camera] Video can play - ready!');
          setIsVideoReady(true);
        };
        
        videoRef.current.onerror = (e) => {
          console.error('[Camera] Video element error:', e);
        };
      } else {
        console.error('[Camera] Video ref not available');
      }
      
      setStream(mediaStream);
      setIsCameraActive(true);
      console.log('[Camera] Camera activated');
    } catch (err) {
      console.error('[Camera] Camera access error:', err);
      setError(`Camera access denied: ${err instanceof Error ? err.message : 'Unknown error'}. Please allow camera permissions.`);
      setIsCameraActive(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    console.log('[Camera] Stopping camera');
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('[Camera] Stopped track:', track.kind);
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
      videoRef.current.oncanplay = null;
      videoRef.current.onerror = null;
    }
    setIsCameraActive(false);
    setIsVideoReady(false);
  };

  // Toggle camera (front/back)
  const toggleCamera = async () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(() => startCamera(), 100);
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('[Camera] Video or canvas ref not available');
      setError('Camera not ready. Please try again.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Check if video is actually playing
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.error('[Camera] Video not ready, readyState:', video.readyState);
      setError('Video not ready. Please wait a moment and try again.');
      return;
    }
    
    if (!isVideoReady) {
      console.error('[Camera] Video state not ready');
      setError('Camera is loading. Please wait a moment.');
      return;
    }
    
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('[Camera] Canvas context not available');
      setError('Canvas error. Please refresh and try again.');
      return;
    }

    try {
      // Set canvas size to video size
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;

      console.log('[Camera] Capturing image:', canvas.width, 'x', canvas.height);

      // Flash effect
      if (video.parentElement) {
        video.parentElement.style.opacity = '0.3';
        setTimeout(() => {
          if (video.parentElement) {
            video.parentElement.style.opacity = '1';
          }
        }, 150);
      }

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob and create file
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('[Camera] Failed to create blob');
          setError('Failed to capture image. Please try again.');
          return;
        }

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

        console.log('[Camera] Image captured successfully:', newImage.id);
        setCapturedImages(prev => [...prev, newImage]);
        setError(null);
      }, 'image/jpeg', 0.92);
    } catch (err) {
      console.error('[Camera] Capture error:', err);
      setError('Failed to capture image. Please try again.');
    }
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
      // For single image, use Gemini Vision API directly
      if (capturedImages.length === 1) {
        setError('Analyzing image with AI...');
        
        const formData = new FormData();
        formData.append('file', capturedImages[0].file);

        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Image analysis failed');
        }

        const result = await response.json();
        
        setError(null);

        // Navigate to results page
        if (result.analysis) {
          const analysisId = `analysis_scan_${Date.now()}`;
          localStorage.setItem(analysisId, JSON.stringify(result.analysis));
          router.push(`/results/${analysisId}`);
        }
      } else {
        // For multiple images, process each and combine results
        setError(`Analyzing ${capturedImages.length} pages...`);
        
        const analyses = [];
        
        for (let i = 0; i < capturedImages.length; i++) {
          setError(`Analyzing page ${i + 1} of ${capturedImages.length}...`);
          
          const formData = new FormData();
          formData.append('file', capturedImages[i].file);

          const response = await fetch('/api/analyze-image', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            analyses.push({
              page: i + 1,
              text: result.extractedText || '',
              analysis: result.analysis,
            });
          }
        }

        if (analyses.length === 0) {
          throw new Error('Failed to analyze any pages');
        }

        // Combine analyses
        const combinedAnalysis = {
          summary: analyses.map((a, i) => `Page ${a.page}: ${a.analysis?.summary || 'No summary'}`).join('\n\n'),
          documentType: analyses[0]?.analysis?.documentType || 'Multi-page Document',
          keyPoints: analyses.flatMap(a => a.analysis?.keyPoints || []),
          risks: analyses.flatMap(a => a.analysis?.risks || []),
          obligations: analyses.flatMap(a => a.analysis?.obligations || []),
          importantClauses: analyses.flatMap(a => a.analysis?.importantClauses || []),
          deadlines: analyses.flatMap(a => a.analysis?.deadlines || []),
          extractedText: analyses.map(a => `=== Page ${a.page} ===\n\n${a.text}`).join('\n\n'),
        };

        setError(null);

        const analysisId = `analysis_scan_${Date.now()}`;
        localStorage.setItem(analysisId, JSON.stringify(combinedAnalysis));
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

          {/* Debug info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded text-xs space-y-1">
              <div><strong>Debug:</strong></div>
              <div>Camera Active: {isCameraActive ? '✅' : '❌'}</div>
              <div>Video Ready: {isVideoReady ? '✅' : '❌'}</div>
              <div>Stream: {stream ? '✅' : '❌'}</div>
              <div>Images Captured: {capturedImages.length}</div>
            </div>
          )}

          {/* Camera controls */}
          {!isCameraActive && capturedImages.length === 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                Take Photo
              </Button>
              <Button
                onClick={startCamera}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Scan Document
              </Button>
            </div>
          )}

          {/* Hidden file input - triggers native camera */}
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
              <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3', minHeight: '300px' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ backgroundColor: '#000' }}
                />
                
                {/* Loading indicator while video initializes */}
                {!isVideoReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                    <div className="text-white text-center space-y-2">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                      <p className="text-sm">Initializing camera...</p>
                      <p className="text-xs text-gray-300">Please allow camera access if prompted</p>
                    </div>
                  </div>
                )}
                
                {/* Camera overlay guide */}
                {isVideoReady && (
                  <div className="absolute inset-0 pointer-events-none z-20">
                    <div className="absolute inset-8 border-2 border-white/50 rounded-lg" />
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                      Position document within frame
                    </div>
                  </div>
                )}
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
                  disabled={!isVideoReady}
                  title={isVideoReady ? 'Capture photo' : 'Camera loading...'}
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
