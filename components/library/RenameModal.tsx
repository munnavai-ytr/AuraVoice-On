'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface RenameModalProps {
  isOpen: boolean;
  initialTitle: string;
  onClose: () => void;
  onSave: (newTitle: string) => Promise<void>;
}

export function RenameModal({
  isOpen,
  initialTitle,
  onClose,
  onSave,
}: RenameModalProps) {
  const [title, setTitle] = React.useState(initialTitle);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTitle(initialTitle);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialTitle]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setIsSubmitting(true);
      await onSave(title.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm p-6 rounded-2xl bg-[#0D1117] border border-[#1E293B] shadow-2xl">
        <h4 className="text-base font-bold text-[#F0F4FF] mb-4">Rename Audio</h4>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Audio title..."
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
              Save Title
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
