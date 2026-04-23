"use client";

import Button from "@/components/ui/Button";

interface DeleteConfirmModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
