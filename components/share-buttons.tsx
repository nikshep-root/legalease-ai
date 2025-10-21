'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link2, 
  Mail, 
  MessageCircle,
  Check 
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Share this post</h4>
            
            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
              >
                <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                <span className="text-sm">Twitter</span>
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
              >
                <Facebook className="w-4 h-4 text-[#4267B2]" />
                <span className="text-sm">Facebook</span>
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
              >
                <Linkedin className="w-4 h-4 text-[#0077B5]" />
                <span className="text-sm">LinkedIn</span>
              </a>

              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span className="text-sm">WhatsApp</span>
              </a>

              <a
                href={shareLinks.email}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
              >
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Email</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors text-left"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Copy URL Input */}
            <div className="pt-2 border-t">
              <label className="text-xs text-muted-foreground mb-1 block">
                Or copy link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-muted rounded-md"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="w-4 h-4" /> : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Native Share Button (for mobile) */}
      {typeof window !== 'undefined' && 'share' in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="md:hidden"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

/**
 * Compact version for cards
 */
export function ShareButtonCompact({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        // Fallback to copy
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <MessageCircle className="w-4 h-4" />
      )}
    </Button>
  );
}
