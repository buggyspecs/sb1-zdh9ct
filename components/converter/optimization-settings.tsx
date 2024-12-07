'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OptimizationSettingsProps {
  onTargetSizeChange: (size: number) => void;
  disabled?: boolean;
}

export function OptimizationSettings({ onTargetSizeChange, disabled }: OptimizationSettingsProps) {
  const [targetSize, setTargetSize] = useState<string>('100');

  const handleChange = (value: string) => {
    setTargetSize(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onTargetSizeChange(numValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="target-size" className="text-sm text-muted-foreground">
        Target Size (KB)
      </Label>
      <Input
        id="target-size"
        type="number"
        min="1"
        value={targetSize}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        className="w-[180px] transition-colors"
        placeholder="Enter target size..."
      />
    </div>
  );
}