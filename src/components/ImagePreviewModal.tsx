import React from 'react';
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export function ImagePreviewModal({ isOpen, onClose, imageUrl }: ImagePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white/95 border-none">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 p-2 rounded-full bg-white/90 backdrop-blur-sm 
                     hover:bg-white/100 transition-all duration-200 shadow-lg 
                     group hover:scale-110 hover:rotate-90 transform"
          >
            <X className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </button>
          <div className="p-4">
            <div className="relative rounded-lg overflow-hidden max-h-[70vh]">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 