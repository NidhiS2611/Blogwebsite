import React, { useState } from "react";
import { Trash2, Power, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationModal from "../component/ConfirmationModal";
import api from "../services/Axiosinstance"

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
        ? "api/user/deactivate" 
        : "api/user/delete-account";

      const method = modalConfig.type === "deactivate" ? "put" : "delete";
      const response = await axios[method](url);

      if (response.status === 200) {
        alert(response.data.message);
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
    /* 1. h-[100dvh] use kiya hai taaki mobile browser ke address bar se panga na ho.
      2. overflow-hidden se scroll band ho jayega.
      3. className 'scrollbar-hide' custom CSS ke liye hai.
    */
    <div className=" w-full bg-black text-white overflow-hidden flex flex-col scrollbar-hide">
      
      {/* Scrollbar hide karne ke liye style tag (inline) */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-3xl mx-auto w-full px-4 py-8 md:py-16 flex flex-col h-full">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10 shrink-0">
          <Link to="/settings" className="p-2 hover:bg-neutral-900 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-rose-500 tracking-tight">
            Danger Zone
          </h1>
        </div>

        {/* Content Area - Isko justify-start rakha hai taaki upar dikhe */}
        <div className="flex-1 flex flex-col space-y-6">
          
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
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition-colors disabled:opacity-50 font-medium"
            >
              {loading && modalConfig.type === 'deactivate' ? <Loader2 className="animate-spin" size={18}/> : "Deactivate"}
            </button>
          </div>

          {/* Delete Card */}
          <div className="bg-neutral-900/40 border border-rose-900/10 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-rose-900/20">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold flex items-center justify-center sm:justify-start gap-2 text-rose-500">
                <Trash2 size={18} /> Delete Account
              </h3>
              <p className="text-gray-500 text-sm">Action is irreversible. Data will be wiped.</p>
            </div>
            <button 
              onClick={() => openModal("delete")}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 transition-all text-sm font-medium disabled:opacity-50 shadow-lg shadow-rose-600/10"
            >
              {loading && modalConfig.type === 'delete' ? <Loader2 className="animate-spin" size={18}/> : "Delete Account"}
            </button>
          </div>

        </div>

        {/* Bottom micro-copy taaki screen bhari lage */}
        <p className="text-center text-neutral-700 text-[10px] uppercase tracking-widest mt-auto pb-4">
          Secure Action Required
        </p>
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