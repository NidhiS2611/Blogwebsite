import React, { useState } from "react";
import { Trash2, Power, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationModal from "../component/ConfirmationModal";

const DangerZone = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: "" });

  const openModal = (type) => setModalConfig({ isOpen: true, type });
  const closeModal = () => setModalConfig({ isOpen: false, type: "" });

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const url = modalConfig.type === "deactivate" 
        ? "/user/deactivate" 
        : "/user/delete-account";

      // Method select karo
      const method = modalConfig.type === "deactivate" ? "put" : "delete";

      // Request bhej rahe hain (Cookies apne aap jayengi)
      const response = await axios[method](url);

      if (response.status === 200) {
        alert(response.data.message);
        // Logout user from frontend state
        navigate("/login");
      }
    } catch (error) {
      console.error("Action Failed ❌:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden flex flex-col">
      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-10 shrink-0">
          <Link to="/settings" className="p-2 hover:bg-neutral-900 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-rose-500">Danger Zone</h1>
        </div>

        <div className="flex-1 flex flex-col justify-start space-y-6">
          {/* Deactivate Card */}
          <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-neutral-700">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-neutral-200">
                <Power size={18} className="text-orange-500" /> Deactivate Account
              </h3>
              <p className="text-gray-500 text-sm">Temporarily disable your account.</p>
            </div>
            <button 
              onClick={() => openModal("deactivate")}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {loading && modalConfig.type === 'deactivate' ? <Loader2 className="animate-spin" size={18}/> : "Deactivate"}
            </button>
          </div>

          {/* Delete Card */}
          <div className="bg-neutral-900/40 border border-rose-900/10 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-rose-500">
                <Trash2 size={18} /> Delete Account
              </h3>
              <p className="text-gray-500 text-sm">Action is irreversible. Data will be wiped.</p>
            </div>
            <button 
              onClick={() => openModal("delete")}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 transition-all text-sm font-medium disabled:opacity-50"
            >
              {loading && modalConfig.type === 'delete' ? <Loader2 className="animate-spin" size={18}/> : "Delete Account"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={modalConfig.type === "deactivate" ? "Deactivate Account?" : "Delete Permanently?"}
        message={modalConfig.type === "deactivate" ? "Are you sure? Log out to return later." : "Confirming will wipe data forever."}
        actionText={modalConfig.type === "deactivate" ? "Yes, Deactivate" : "Yes, Delete"}
      />
    </div>
  );
};

export default DangerZone;