import { ImagePlus } from 'lucide-react';

export function ConverterHeader() {
  return (
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-primary/5 rounded-xl">
        <ImagePlus className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">Image Format Converter</h1>
        <p className="text-muted-foreground">Convert and optimize your images with ease</p>
      </div>
    </div>
  );
}