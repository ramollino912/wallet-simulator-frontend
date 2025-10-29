'use client';

import { HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Empty space for layout balance */}
        <div className="flex-1"></div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Help */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/ayuda')}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Profile */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/perfil')}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
