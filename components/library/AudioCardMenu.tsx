'use client';

import * as React from 'react';
import { Edit2, ExternalLink, HardDrive, Trash2, AlertTriangle } from 'lucide-react';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface AudioCardMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: () => void;
  audioUrl?: string | null;
  onDelete: () => Promise<void>;
}

export function AudioCardMenu({
  isOpen,
  onClose,
  onRename,
  audioUrl,
  onDelete,
}: AudioCardMenuProps) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const menuRef = useOutsideClick<HTMLDivElement>(() => {
    setConfirmDelete(false);
    onClose();
  }, isOpen);

  if (!isOpen) return null;

  const handleExportCapCut = () => {
    if (audioUrl) {
      window.open(`capcut://import?url=${encodeURIComponent(audioUrl)}`, '_blank');
      // If protocol fails, opens CapCut web
      setTimeout(() => {
        window.open('https://www.capcut.com', '_blank');
      }, 500);
    } else {
      window.open('https://www.capcut.com', '_blank');
    }
    onClose();
  };

  const handleExportDrive = () => {
    // Open Google Drive interface with instructions
    window.open('https://drive.google.com', '_blank');
    onClose();
  };

  const handleDeleteClick = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-2 top-10 z-40 w-48 rounded-[12px] bg-[#111827] border border-[#2D3F56] shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150 select-none text-left"
    >
      {confirmDelete ? (
        <div className="p-2 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#EF4444] font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Delete this audio?</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteClick}
              className="flex-1 h-7 rounded-md bg-[#EF4444] hover:bg-red-600 text-white text-[11px] font-semibold transition-colors cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Confirm'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="flex-1 h-7 rounded-md bg-[#1A2235] hover:bg-[#2D3F56] text-[#8899B4] text-[11px] font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              onRename();
              onClose();
            }}
            className="w-full h-[36px] px-2.5 rounded-[8px] text-xs text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#8899B4]" />
            <span>Rename</span>
          </button>

          <button
            type="button"
            onClick={handleExportCapCut}
            className="w-full h-[36px] px-2.5 rounded-[8px] text-xs text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export to CapCut</span>
          </button>

          <button
            type="button"
            onClick={handleExportDrive}
            className="w-full h-[36px] px-2.5 rounded-[8px] text-xs text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export to Drive</span>
          </button>

          <div className="my-1 h-px bg-[#1E293B]" />

          <button
            type="button"
            onClick={handleDeleteClick}
            className="w-full h-[36px] px-2.5 rounded-[8px] text-xs text-[#EF4444] hover:bg-red-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </>
      )}
    </div>
  );
}
