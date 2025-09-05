'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useSession } from '@/contexts/SessionContext';
import type { DownloadOptions } from '@/lib/download-utils';
import type { SessionState } from '@/types/session';

interface DownloadButtonProps {
  session: SessionState | null;
  className?: string;
  variant?: 'button' | 'dropdown';
}

export function DownloadButton({ session, className = '', variant = 'button' }: DownloadButtonProps) {
  const { downloadSession: downloadSessionData } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState<DownloadOptions>({
    includeMetadata: true,
    includeAnalytics: true,
    includeTranslations: true
  });

  const handleDownload = async (format: 'json' | 'csv' | 'pdf') => {
    if (!session || session.messages.length === 0) {
      alert('No session data available for download');
      return;
    }

    setIsDownloading(true);
    
    try {
      downloadSessionData(format, downloadOptions);
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
      setShowOptions(false);
    }
  };

  const canDownload = session && session.messages.length > 0;

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <Button
          onClick={() => setShowOptions(!showOptions)}
          disabled={!canDownload || isDownloading}
          variant="secondary"
          className="w-full text-xs h-8"
        >
          {isDownloading ? 'Downloading...' : '📥 Download Conversation'}
        </Button>
        
        {showOptions && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 mb-2">Download Format</div>
                
                <Button
                  onClick={() => handleDownload('json')}
                  disabled={isDownloading}
                  variant="outline"
                  className="w-full text-xs h-7 justify-start"
                >
                  📄 JSON (Complete Data)
                </Button>
                
                <Button
                  onClick={() => handleDownload('csv')}
                  disabled={isDownloading}
                  variant="outline"
                  className="w-full text-xs h-7 justify-start"
                >
                  📊 CSV (Spreadsheet)
                </Button>
                
                <Button
                  onClick={() => handleDownload('pdf')}
                  disabled={isDownloading}
                  variant="outline"
                  className="w-full text-xs h-7 justify-start"
                >
                  📋 PDF (Printable)
                </Button>
                
                <div className="border-t pt-2 mt-2">
                  <div className="text-xs font-medium text-gray-700 mb-2">Options</div>
                  
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={downloadOptions.includeMetadata}
                      onChange={(e) => setDownloadOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Include metadata</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={downloadOptions.includeAnalytics}
                      onChange={(e) => setDownloadOptions(prev => ({ ...prev, includeAnalytics: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Include analytics</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={downloadOptions.includeTranslations}
                      onChange={(e) => setDownloadOptions(prev => ({ ...prev, includeTranslations: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Include translations</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Simple button variant
  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        onClick={() => handleDownload('json')}
        disabled={!canDownload || isDownloading}
        variant="secondary"
        className="w-full text-xs h-8"
      >
        {isDownloading ? 'Downloading...' : '📥 Download JSON'}
      </Button>
      
      <Button
        onClick={() => handleDownload('csv')}
        disabled={!canDownload || isDownloading}
        variant="secondary"
        className="w-full text-xs h-8"
      >
        {isDownloading ? 'Downloading...' : '📊 Download CSV'}
      </Button>
      
      <Button
        onClick={() => handleDownload('pdf')}
        disabled={!canDownload || isDownloading}
        variant="secondary"
        className="w-full text-xs h-8"
      >
        {isDownloading ? 'Downloading...' : '📋 Download PDF'}
      </Button>
    </div>
  );
}

// Click outside handler hook
export function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}
