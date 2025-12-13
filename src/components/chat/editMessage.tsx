"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface EditMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string, images: string[]) => void;
  initialText: string;
  initialImages: string[];
}

export function EditMessageModal({
  isOpen,
  onClose,
  onSave,
  initialText,
  initialImages,
}: EditMessageModalProps) {
  const [text, setText] = useState(initialText);
  const [images, setImages] = useState<string[]>(initialImages);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setImages(initialImages);
    }
  }, [isOpen, initialText, initialImages]);

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(text, images);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>
            Make changes to your message. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[100px]"
          />

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.trim()}
                    alt={`Image ${index + 1}`}
                    className="rounded-lg w-full h-24 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}