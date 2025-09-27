import {type MouseEvent, useState } from "react";
import toast from "react-hot-toast";

interface DeleteModalProps {
  onConfirm: () => Promise<void>;
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function DeleteModal({
  onConfirm,
  open,
  setOpen,
  title = "Are you sure?",
  description = "This action cannot be undone. This will permanently delete the item.",
}: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
      toast.success("Deleted successfully");
      setOpen(false);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-xs lg:max-w-md p-6 relative"
      >
        {/* Close X */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-1 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-xl cursor-pointer"
        >
          ×
        </button>

        {/* Title + Description */}
        <h2 className="text-lg font-semibold text-red-600 mt-2">{title}</h2>
        <p className="text-sm text-gray-500 mt-2">{description}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
