import React, { useState, useEffect } from "react";
import { Trash2, Power, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationModal from "../component/ConfirmationModal";

const DangerZone = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: "" });

  // 🔹 Ye effect screen ko physically lock kar dega jab user is page par hoga
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden"; // Body scroll lock
    document.documentElement.style.overflow = "hidden"; // HTML scroll lock
    
    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = originalStyle;
    };
  }, []);

  const openModal = (type) => setModalConfig({ isOpen: true, type });
  const closeModal = () => setModalConfig({ isOpen: false, type: "" });

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const url = modalConfig.type === "deactivate" ? "/user/deactivate" : "/user/delete-account";
      const method = modalConfig.type === "deactivate" ? "put" : "delete";
      const response = await axios[method](url, {}, { withCredentials: true });

      if (response.status === 200) {
        alert(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    /* inset-0 aur fixed se page hill nahi payega */
    <div className="fixed inset-0 w-full h-screen bg-black text-white overflow-hidden flex flex-col z-[999]">
      
      {/* 🔹 Ultimate Scrollbar Killer CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar { display: none !important; }
        * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        body, html { overflow: hidden !important; height: 100% !important; position: fixed !important; width: 100% !important; }
      `}} />

      <div className="max-w-3xl mx-auto w-full px-6 py-10 md:py-20 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center gap-4 mb-12 shrink-0">
          <Link to="/settings" className="p-2 hover:bg-neutral-900 rounded-full transition-all active:scale-90">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-rose-500 tracking-tight">Danger Zone</h1>
        </header>

        {/* Content - No Scrollbar area */}
        <main className="flex-1 flex flex-col space-y-6 overflow-hidden">
          
          {/* Deactivate Card */}
          <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-5 transition-all hover:bg-neutral-900/60">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold flex items-center justify-center sm:justify-start gap-2 text-neutral-200">
                <Power size={20} className="text-orange-500" /> Deactivate
              </h3>
              <p className="text-neutral-500 text-sm mt-1">Temporarily disable your account.</p>
            </div>
            <button 
              onClick={() => openModal("deactivate")}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl border border-neutral-700 hover:bg-white hover:text-black transition-all font-bold text-sm disabled:opacity-50"
            >
              {loading && modalConfig.type === 'deactivate' ? <Loader2 className="animate-spin" size={20}/> : "Deactivate"}
            </button>
          </div>

          {/* Delete Card */}
          <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-5 transition-all hover:bg-rose-500/10">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold flex items-center justify-center sm:justify-start gap-2 text-rose-500">
                <Trash2 size={20} /> Delete Account
              </h3>
              <p className="text-neutral-500 text-sm mt-1">Irreversible action. All data wiped.</p>
            </div>
            <button 
              onClick={() => openModal("delete")}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 transition-all font-bold text-sm shadow-xl shadow-rose-600/20 disabled:opacity-50"
            >
              {loading && modalConfig.type === 'delete' ? <Loader2 className="animate-spin" size={20}/> : "Delete Account"}
            </button>
          </div>

        </main>

        {/* Footer */}
        <footer className="mt-auto pt-10 shrink-0 text-center">
          <p className="text-neutral-700 text-[10px] uppercase tracking-[0.3em]">
            Secure Access Only
          </p>
        </footer>
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={modalConfig.type === "deactivate" ? "Deactivate Account?" : "Final Warning!"}
        message={modalConfig.type === "deactivate" ? "Your blogs will be hidden. Confirm logout?" : "This will delete everything forever. Proceed?"}
        actionText={modalConfig.type === "deactivate" ? "Yes, Deactivate" : "Yes, Delete Forever"}
      />
    </div>
  );
};

export default DangerZone;