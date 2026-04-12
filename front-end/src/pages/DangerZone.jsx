import React, { useState } from "react";
import { Trash2, Power, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../component/ConfirmationModal"; // Modal import karein

const DangerZone = () => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "", // 'deactivate' or 'delete'
  });

  const openModal = (type) => {
    setModalConfig({ isOpen: true, type });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: "" });
  };

  const handleConfirm = () => {
    if (modalConfig.type === "deactivate") {
      console.log("Account Deactivated!");
    } else {
      console.log("Account Deleted Permanently!");
    }
    closeModal();
    // Yahan apni API call lagao
  };

  return (
    <div className="min-h-screen bg-black py-10 text-white">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/settings" className="p-2 hover:bg-neutral-900 rounded-full transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-rose-500">Danger Zone</h1>
        </div>

        <div className="space-y-6">
          {/* Deactivate Card */}
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Power size={18} className="text-orange-500" />
                Deactivate Account
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Temporarily disable your account. You can log back in anytime.
              </p>
            </div>
            <button 
              onClick={() => openModal("deactivate")}
              className="px-5 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition text-sm font-medium"
            >
              Deactivate
            </button>
          </div>

          {/* Delete Card */}
          <div className="bg-neutral-900/50 border border-rose-900/20 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 text-rose-500">
                <Trash2 size={18} />
                Delete Account
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Permanently remove all your data. This action is irreversible.
              </p>
            </div>
            <button 
              onClick={() => openModal("delete")}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 transition text-sm font-medium shadow-lg shadow-rose-500/10"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Logic */}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={modalConfig.type === "deactivate" ? "Deactivate Account?" : "Delete Permanently?"}
        message={
          modalConfig.type === "deactivate"
            ? "Are you sure? You will be logged out, but you can return anytime."
            : "This will wipe all your blogs and profile data forever. Proceed with caution."
        }
        actionText={modalConfig.type === "deactivate" ? "Yes, Deactivate" : "Yes, Delete"}
      />
    </div>
  );
};

export default DangerZone;