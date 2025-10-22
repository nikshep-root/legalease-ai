'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function FloatingChatButton() {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    if (!session) {
      router.push('/signin');
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-20 right-0 mb-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
            <p className="text-sm font-medium">Ask any legal questions</p>
            <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-3 h-3 bg-gray-900"></div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Open AI Chat Assistant"
      >
        {/* Pulse animation */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
        
        {/* Icon */}
        <MessageCircle className="relative w-6 h-6" />
        
        {/* Badge for new feature */}
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 items-center justify-center">
            <span className="text-[10px] font-bold text-white">AI</span>
          </span>
        </span>
      </button>
    </div>
  );
}
