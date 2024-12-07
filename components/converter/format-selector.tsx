'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConversionFormat } from "@/lib/imageConverter";

interface FormatSelectorProps {
  value: ConversionFormat;
  onChange: (value: ConversionFormat) => void;
  disabled?: boolean;
}

export function FormatSelector({ value, onChange, disabled }: FormatSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value as ConversionFormat)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select format" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="webp-to-png">WebP to PNG</SelectItem>
        <SelectItem value="png-to-webp">PNG to WebP</SelectItem>
        <SelectItem value="png-optimize">PNG Optimizer</SelectItem>
        <SelectItem value="jpeg-optimize">JPEG Optimizer</SelectItem>
      </SelectContent>
    </Select>
  );
}