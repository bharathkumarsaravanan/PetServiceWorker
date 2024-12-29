import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );
}