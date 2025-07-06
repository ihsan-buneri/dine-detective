
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface ImageThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageThumbnail = ({ src, alt, className = "" }: ImageThumbnailProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`cursor-pointer rounded-lg overflow-hidden border border-gray-600/50 hover:border-cyan-500/50 transition-colors ${className}`}
        >
          <img 
            src={src} 
            alt={alt}
            className="w-full h-32 object-cover"
          />
        </motion.div>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-2 bg-black/90 border-gray-700">
        <DialogTitle className="sr-only">Visualização da imagem</DialogTitle>
        <div className="flex items-center justify-center h-full">
          <img 
            src={src} 
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
