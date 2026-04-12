import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, actionText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop (Andhera karne ke liye) */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="bg-rose-500/10 p-3 rounded-full mb-4">
            <AlertTriangle className="text-rose-500" size={32} />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400 text-sm mb-6">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition font-medium shadow-lg shadow-violet-500/20"
            >
              {actionText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;