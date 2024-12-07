'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { downloadImage } from '@/lib/imageConverter';
import { truncateFilename } from '@/lib/utils';
import { formatTime } from '@/lib/time';

interface ConversionItem {
  id: string;
  name: string;
  url: string;
  blob?: Blob;
  status: 'converting' | 'completed' | 'error';
  error?: string;
  timeTaken?: number;
}

interface ConversionListProps {
  items: ConversionItem[];
}

export function ConversionList({ items }: ConversionListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-200 ${
            item.status === 'error' 
              ? 'bg-destructive/10 border-destructive/20' 
              : item.status === 'completed'
              ? 'bg-muted/50 border-border/50 hover:bg-muted/70'
              : 'bg-muted/30 border-border/30'
          }`}
        >
          <div className="flex items-center space-x-4 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {truncateFilename(item.name)}
              </p>
              {item.error && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  {item.error}
                </p>
              )}
              {item.timeTaken && item.status === 'completed' && (
                <p className="text-xs text-emerald-500 mt-0.5">
                  Converted in {formatTime(item.timeTaken)}
                </p>
              )}
            </div>
          </div>
          
          {item.status === 'converting' && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
          
          {item.status === 'completed' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => downloadImage(item.url, item.name)}
              className="hover:bg-background"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}