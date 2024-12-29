import React from 'react';
import { Database, Wifi } from 'lucide-react';

interface DataSourceIndicatorProps {
  isFromCache: boolean;
}

export function DataSourceIndicator({ isFromCache }: DataSourceIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      {isFromCache ? (
        <Database className="text-green-500" size={20} />
      ) : (
        <Wifi className="text-blue-500" size={20} />
      )}
      <span className="text-sm text-gray-600">
        {isFromCache ? 'Loaded from cache' : 'Fresh from network'}
      </span>
    </div>
  );
}