'use client';

import { useState } from 'react';
import { Dropzone } from '@/components/ui/dropzone';
import { ConversionList } from '@/components/conversion-list';
import { convertImage, downloadAllAsZip, type ConversionFormat } from '@/lib/imageConverter';
import { ConverterHeader } from '@/components/converter/header';
import { FormatSelector } from '@/components/converter/format-selector';
import { OptimizationSettings } from '@/components/converter/optimization-settings';
import { useConversions } from '@/hooks/use-conversions';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Play, X } from 'lucide-react';
import { truncateFilename } from '@/lib/utils';
import { MAX_FILES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { toast } = useToast();
  const { conversions, addConversions, updateConversion, clearConversions } = useConversions();
  const [isConverting, setIsConverting] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState<ConversionFormat>('webp-to-png');
  const [targetSizeKB, setTargetSizeKB] = useState<number>(100);

  const handleFilesDrop = (files: File[]) => {
    if (files.length > MAX_FILES) {
      toast({
        title: "Maximum files exceeded",
        description: "You can only upload 20 images at once",
        variant: "destructive"
      });
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(file => {
      const acceptedTypes = ACCEPTED_IMAGE_TYPES[format].split(',');
      return !acceptedTypes.some(ext => file.name.toLowerCase().endsWith(ext));
    });

    if (invalidFiles.length > 0) {
      const formatName = format === 'jpeg-optimize' ? 'JPEG' : 
                        format === 'png-optimize' ? 'PNG' :
                        format === 'webp-to-png' ? 'WebP' : 'PNG';
      
      toast({
        title: "Invalid file type",
        description: `Please upload only ${formatName} files for this conversion type.`,
        variant: "destructive"
      });
      return;
    }

    setPendingFiles(files);
    setProgress(0);
  };

  const clearFiles = () => {
    setPendingFiles([]);
    setProgress(0);
  };

  const startConversion = async () => {
    const newConversions = pendingFiles.map(file => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      url: '',
      status: 'converting' as const
    }));

    addConversions(newConversions);
    setIsConverting(true);
    setProgress(0);

    try {
      for (let i = 0; i < pendingFiles.length; i++) {
        const file = pendingFiles[i];
        const conversionId = newConversions[i].id;
        const startTime = performance.now();

        try {
          const result = await convertImage(
            file, 
            format, 
            (format === 'png-optimize' || format === 'jpeg-optimize') ? targetSizeKB : undefined
          );
          const timeTaken = performance.now() - startTime;
          
          updateConversion(conversionId, {
            url: result.url,
            name: result.name,
            blob: result.blob,
            status: 'completed',
            timeTaken
          });
        } catch (error) {
          const errorMessage = (error as Error).message;
          toast({
            title: "Conversion failed",
            description: errorMessage,
            variant: "destructive"
          });
          updateConversion(conversionId, {
            status: 'error',
            error: errorMessage
          });
        }
        
        const newProgress = Math.round(((i + 1) / pendingFiles.length) * 100);
        setProgress(newProgress);
      }
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "An unexpected error occurred during conversion.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
      setPendingFiles([]);
      setProgress(0);
    }
  };

  const handleDownloadAll = async () => {
    const completedConversions = conversions
      .filter(conv => conv.status === 'completed' && conv.blob)
      .map(({ name, blob }) => ({ name, blob: blob! }));

    if (completedConversions.length > 0) {
      try {
        await downloadAllAsZip(completedConversions);
      } catch (error) {
        toast({
          title: "Download failed",
          description: "Failed to create zip file for download.",
          variant: "destructive"
        });
      }
    }
  };

  const hasCompletedConversions = conversions.some(conv => conv.status === 'completed');
  const hasPendingFiles = pendingFiles.length > 0;

  const getAcceptedFileType = () => ACCEPTED_IMAGE_TYPES[format];

  const getDropzoneText = () => {
    switch (format) {
      case 'webp-to-png':
        return 'Drop WebP files here or click to select';
      case 'png-to-webp':
        return 'Drop PNG files here or click to select';
      case 'png-optimize':
        return 'Drop PNG files here to optimize';
      case 'jpeg-optimize':
        return 'Drop JPEG files here to optimize';
      default:
        return 'Drop files here or click to select';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <ConverterHeader />
        
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <FormatSelector
              value={format}
              onChange={(newFormat) => {
                setFormat(newFormat);
                setPendingFiles([]);
              }}
              disabled={isConverting || hasPendingFiles}
            />
            
            {(format === 'png-optimize' || format === 'jpeg-optimize') && (
              <OptimizationSettings
                onTargetSizeChange={setTargetSizeKB}
                disabled={isConverting}
              />
            )}
          </div>

          <Dropzone
            onFilesDrop={handleFilesDrop}
            className="mb-8 transition-all duration-200 hover:border-primary/50"
            disabled={isConverting}
            accept={getAcceptedFileType()}
            text={getDropzoneText()}
          />

          {(hasPendingFiles || conversions.length > 0) && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">
                  {hasPendingFiles ? 'Selected Files' : 'Conversions'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {hasPendingFiles ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={clearFiles}
                        disabled={isConverting}
                        className="min-w-[120px]"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Files
                      </Button>
                      <Button
                        onClick={startConversion}
                        disabled={isConverting}
                        className="min-w-[160px]"
                      >
                        {isConverting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {progress}%
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Conversion
                          </>
                        )}
                      </Button>
                    </>
                  ) : hasCompletedConversions && (
                    <>
                      <Button
                        variant="outline"
                        onClick={clearConversions}
                        disabled={isConverting}
                        className="min-w-[120px]"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                      <Button
                        onClick={handleDownloadAll}
                        disabled={isConverting}
                        className="min-w-[160px]"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download All
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {hasPendingFiles ? (
                <div className="space-y-2">
                  {pendingFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground/90">
                            {truncateFilename(file.name)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ConversionList items={conversions} />
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}