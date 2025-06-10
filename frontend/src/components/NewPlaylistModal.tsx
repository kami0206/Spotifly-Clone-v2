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

interface NewPlaylistModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (
    title: string,
    description: string,
    imageFile?: File
  ) => Promise<void>;
}

const NewPlaylistModal: React.FC<NewPlaylistModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setImagePreview("");
      setImageFile(undefined);
    }
  }, [open]);

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

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Playlist title cannot be empty");
      return;
    }
    setIsSubmitting(true);
    try {
      await onCreate(title, description, imageFile);
      toast.success("Playlist created successfully");
      onClose();
    } catch {
      toast.error("Error creating playlist");
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
          <DialogTitle className="text-lg font-bold">
            Create New Playlist
          </DialogTitle>
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
            onClick={handleCreate}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewPlaylistModal;
