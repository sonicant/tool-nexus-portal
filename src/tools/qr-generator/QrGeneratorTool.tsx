import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/hooks/useI18n';
import { QrCode, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HomeButton } from '@/components/ui/home-button';
import { PrivacyNotice } from '@/components/ui/privacy-notice';
import QRCode from 'qrcode';

export const QrGeneratorTool = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [inputText, setInputText] = useState('https://example.com');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate QR code
  const generateQRCode = async () => {
    if (!inputText.trim()) {
      toast({
        title: t('tools.qrGenerator.error'),
        description: t('tools.qrGenerator.emptyInputError'),
        variant: 'destructive'
      });
      return;
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Generate QR code to canvas
      await QRCode.toCanvas(canvas, inputText, {
        errorCorrectionLevel,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        },
        width: 256,
        margin: 2
      });

      // Convert canvas to data URL for download
      const dataUrl = canvas.toDataURL('image/png');
      setQrCodeDataUrl(dataUrl);

      toast({
        title: t('tools.qrGenerator.success'),
        description: t('tools.qrGenerator.generateSuccess')
      });
    } catch (error) {
      console.error('QR Code generation error:', error);
      toast({
        title: t('tools.qrGenerator.error'),
        description: t('tools.qrGenerator.generateError'),
        variant: 'destructive'
      });
    }
  };

  // Download QR code
  const downloadQRCode = () => {
    if (!qrCodeDataUrl) {
      toast({
        title: t('tools.qrGenerator.error'),
        description: t('tools.qrGenerator.noQrCodeError'),
        variant: 'destructive'
      });
      return;
    }

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: t('tools.qrGenerator.success'),
      description: t('tools.qrGenerator.downloadSuccess')
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <QrCode className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.qrGenerator.name')}</h1>
            <p className="text-muted-foreground">{t('tools.qrGenerator.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>QR Code Configuration</CardTitle>
          <CardDescription>
            Configure your QR code settings below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-text">{t('tools.qrGenerator.inputText')}</Label>
              <Input
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('tools.qrGenerator.inputPlaceholder')}
                className="font-mono"
              />
            </div>

            {/* Color Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="foreground-color">{t('tools.qrGenerator.foregroundColor')}</Label>
                <div className="flex space-x-2">
                  <Input
                    id="foreground-color"
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background-color">{t('tools.qrGenerator.backgroundColor')}</Label>
                <div className="flex space-x-2">
                  <Input
                    id="background-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Error Correction Level */}
            <div className="space-y-2">
              <Label>{t('tools.qrGenerator.errorCorrectionLevel')}</Label>
              <Select value={errorCorrectionLevel} onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setErrorCorrectionLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">{t('tools.qrGenerator.errorLevel.L')}</SelectItem>
                  <SelectItem value="M">{t('tools.qrGenerator.errorLevel.M')}</SelectItem>
                  <SelectItem value="Q">{t('tools.qrGenerator.errorLevel.Q')}</SelectItem>
                  <SelectItem value="H">{t('tools.qrGenerator.errorLevel.H')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <Button onClick={generateQRCode} className="w-full">
              <QrCode className="h-4 w-4 mr-2" />
              {t('tools.qrGenerator.generate')}
            </Button>
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center space-y-4">
            <canvas
              ref={canvasRef}
              className="border rounded-lg shadow-sm"
              style={{ display: qrCodeDataUrl ? 'block' : 'none' }}
            />
            
            {qrCodeDataUrl && (
              <Button onClick={downloadQRCode} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t('tools.qrGenerator.download')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <PrivacyNotice />
    </div>
  );
};