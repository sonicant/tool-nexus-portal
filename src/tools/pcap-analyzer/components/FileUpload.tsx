import React, { useCallback, useState, useRef, DragEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileX, AlertTriangle, Info } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { FileProcessingStats } from '../types/packet-types';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  processingProgress?: number;
  stats?: FileProcessingStats;
}

const FILE_SIZE_LIMITS = {
  WARNING: 5 * 1024 * 1024, // 5MB
  MAX: 10 * 1024 * 1024 // 10MB
};

const PCAP_SPLIT_COMMANDS = {
  linux: [
    'tcpdump -r large.pcap -w small.pcap -c 1000',
    'editcap -c 1000 large.pcap small.pcap',
    'capinfos large.pcap # Check packet count first'
  ],
  description: 'Use these commands to split large PCAP files into smaller chunks'
};

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isProcessing,
  processingProgress = 0,
  stats
}) => {
  const { t } = useI18n();
  const [fileError, setFileError] = useState<string | null>(null);
  const [showSplitHelp, setShowSplitHelp] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file extension
    const validExtensions = ['.pcap', '.cap', '.pcapng'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      return `Invalid file type. Please upload a PCAP file (${validExtensions.join(', ')})`;
    }

    // Check file size
    if (file.size > FILE_SIZE_LIMITS.MAX) {
      return `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is ${FILE_SIZE_LIMITS.MAX / 1024 / 1024}MB.`;
    }

    return null;
  };

  const handleFileDrop = useCallback((files: File[]) => {
    setFileError(null);
    setShowSplitHelp(false);

    if (files.length === 0) {
      setFileError('No valid files selected');
      return;
    }

    const file = files[0];
    const error = validateFile(file);
    
    if (error) {
      setFileError(error);
      if (file.size > FILE_SIZE_LIMITS.WARNING) {
        setShowSplitHelp(true);
      }
      return;
    }

    // Show warning for large files
    if (file.size > FILE_SIZE_LIMITS.WARNING) {
      setShowSplitHelp(true);
    }

    onFileSelect(file);
  }, [onFileSelect]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
    
    // Check if dragged files are valid
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const validExtensions = ['.pcap', '.cap', '.pcapng'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      setIsDragReject(!validExtensions.includes(fileExtension));
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    setIsDragReject(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    setIsDragReject(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileDrop(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileDrop(files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };



  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const renderProcessingStats = () => {
    if (!stats) return null;

    return (
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Processing Progress</span>
          <span>{processingProgress}%</span>
        </div>
        <Progress value={processingProgress} className="h-2" />
        
        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
          <div>
            <span className="text-muted-foreground">File Size:</span>
            <div className="font-mono">{formatFileSize(stats.fileSize)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.upload.processed')}:</span>
            <div className="font-mono">{stats.processedPackets}</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.upload.time')}:</span>
            <div className="font-mono">{stats.processingTime}ms</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.upload.errors')}:</span>
            <div className="font-mono">{stats.errors.length}</div>
          </div>
        </div>

        {stats.errors.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <div className="font-medium">Processing Errors:</div>
                {stats.errors.slice(0, 3).map((error, index) => (
                  <div key={index} className="text-xs font-mono">{error}</div>
                ))}
                {stats.errors.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    ... and {stats.errors.length - 3} more errors
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const renderSplitHelp = () => {
    if (!showSplitHelp) return null;

    return (
      <Alert className="mt-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div className="font-medium">Large File Detected</div>
            <div className="text-sm">
              {t('tools.pcapAnalyzer.upload.largeFileWarning')}
            </div>
            <div className="bg-muted p-2 rounded text-xs font-mono space-y-1">
              {PCAP_SPLIT_COMMANDS.linux.map((cmd, index) => (
                <div key={index}>{cmd}</div>
              ))}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
            className={`
              border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
              ${isDragActive && !isDragReject ? 'border-primary bg-primary/5' : ''}
              ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
              ${isProcessing ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:bg-primary/5'}
              ${!isDragActive && !isDragReject ? 'border-border' : ''}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pcap,.cap,.pcapng"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isProcessing}
            />
            
            <div className="space-y-2">
              {isProcessing ? (
                <div className="space-y-2">
                  <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="text-lg font-medium">{t('tools.pcapAnalyzer.upload.processing')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('tools.pcapAnalyzer.upload.pleaseWait')}
                  </div>
                </div>
              ) : isDragReject ? (
                <div className="space-y-2">
                  <div className="w-8 h-8 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                    <FileX className="w-4 h-4 text-destructive" />
                  </div>
                  <div className="text-lg font-medium text-destructive">Invalid file type</div>
                  <div className="text-sm text-muted-foreground">
                    Please upload a valid PCAP file (.pcap, .cap, .pcapng)
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-base font-medium">
                    {isDragActive ? t('tools.pcapAnalyzer.upload.dropZone') : t('tools.pcapAnalyzer.upload.title')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('tools.pcapAnalyzer.upload.browseFiles')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Supported formats: .pcap, .cap, .pcapng (max {FILE_SIZE_LIMITS.MAX / 1024 / 1024}MB)
                  </div>
                </div>
              )}

              {!isProcessing && (
                <Button variant="outline" className="mt-2" onClick={(e) => { e.stopPropagation(); openFileDialog(); }}>
                  {t('tools.pcapAnalyzer.upload.selectFile')}
                </Button>
              )}
            </div>
          </div>

          {renderProcessingStats()}
        </CardContent>
      </Card>

      {fileError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}

      {renderSplitHelp()}
    </div>
  );
};