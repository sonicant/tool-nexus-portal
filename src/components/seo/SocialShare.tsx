import React from 'react';
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SocialShareProps {
  title: string;
  description: string;
  url?: string;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  title,
  description,
  url = window.location.href,
  className = ''
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareData = {
    title,
    text: description,
    url
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled share or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: 'Link copied!',
        description: 'The link has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 ${className}`}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => openShareWindow(shareUrls.twitter)}>
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareWindow(shareUrls.facebook)}>
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareWindow(shareUrls.linkedin)}>
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <Check className="h-4 w-4 mr-2 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy Link'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;