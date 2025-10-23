'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle, Scale } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function LegalDisclaimer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the disclaimer
    const dismissed = localStorage.getItem('legal-disclaimer-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('legal-disclaimer-dismissed', 'true');
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-50 border-t-2 border-amber-400 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="h-4 w-4 text-amber-700" />
              <h3 className="font-semibold text-amber-900 text-sm">
                Legal Disclaimer
              </h3>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>This service is not a substitute for professional legal advice.</strong> 
              {' '}LegalEase AI provides AI-powered document analysis for informational purposes only. 
              Always consult a qualified attorney for legal matters. By using this service, you acknowledge 
              that no attorney-client relationship is created.
              {' '}
              <Link 
                href="/legal/disclaimer" 
                className="underline hover:text-amber-900 font-medium"
              >
                Read full disclaimer
              </Link>
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="flex-shrink-0 text-amber-700 hover:text-amber-900 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
