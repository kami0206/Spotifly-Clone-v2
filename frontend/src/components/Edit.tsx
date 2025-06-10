import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface EditPlaylistModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    description: string,
    imageFile?: File
  ) => Promise<void>;
  initialTitle: string;
  initialDescription: string;
  initialImageUrl: string;
}

const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
  open,
  onClose,
  onSave,
  initialTitle,
  initialDescription,
  initialImageUrl,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [imagePreview, setImagePreview] = useState(initialImageUrl);
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setImagePreview(initialImageUrl);
      setImageFile(undefined);
    }
  }, [open, initialTitle, initialDescription, initialImageUrl]);

  const handleImageClick = () => {
    if (!isSubmitting) fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Playlist title cannot be empty");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave(title, description, imageFile);
      toast.success("Playlist updated successfully");
      onClose();
    } catch {
      toast.error("Error updating playlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="bg-zinc-900 text-white max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit Playlist</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          <div
            className="w-24 h-24 bg-zinc-800 rounded overflow-hidden cursor-pointer flex items-center justify-center"
            onClick={handleImageClick}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Playlist"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400 text-sm">Choose image</span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Playlist title"
              className="bg-zinc-800 text-white border-gray-600"
              disabled={isSubmitting}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className="bg-zinc-800 text-white border-gray-600 resize-none"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlaylistModal;
