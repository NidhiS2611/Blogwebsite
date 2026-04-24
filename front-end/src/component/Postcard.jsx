

import React, { memo, useCallback, useState, useEffect } from "react";
import { Share2, Eye, Bookmark } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import api from "../services/Axiosinstance"; 
import { useAuth } from "../context/Authcontext"; 

function PostCard({
  id,
  title,
  image,
  author,
  authorProfile,
  authorId,
  date,
  views,
}) {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [isBookmarked, setIsBookmarked] = useState(false);

  // ✅ Bookmark status check (Sirf tab chalega jab user ya id change ho)
  useEffect(() => {
    if (user?.bookmarks && id) {
      setIsBookmarked(user.bookmarks.includes(id));
    }
  }, [user?.bookmarks, id]);

  /* ================= OPEN BLOG ================= */
  const goToBlog = useCallback(() => {
    navigate(`/blog/${id}`);
  }, [navigate, id]);

  /* ================= TOGGLE BOOKMARK ================= */
  const handleBookmark = async (e) => {
    e.stopPropagation(); // 🔥 Card click ko rokne ke liye
    if (!user) return alert("Please login to bookmark posts");

    try {
      // Toggle UI immediately for better UX
      setIsBookmarked((prev) => !prev);
      
      await api.put(`/user/bookmark/${id}`);
    } catch (err) {
      // Reverse UI if API fails
      setIsBookmarked((prev) => !prev);
      console.log("Bookmark Error:", err);
    }
  };

  /* ================= SHARE ================= */
  const shareOnWhatsApp = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/blog/${id}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(title + "\n" + url)}`
    );
  };
  const goToProfile = (e) => {
  e.stopPropagation(); // 🔥 card click ko rokega
  navigate(`/profile/${authorId}`)// ya authorId agar hai
};

  return (
    <div
      onClick={goToBlog}
      className="
        group cursor-pointer p-4 rounded-xl 
        bg-neutral-900 border border-neutral-800 
        hover:border-neutral-700 transition relative
      "
    >
      {/* 🔖 BOOKMARK BUTTON (Top Right) */}
      <button 
        onClick={handleBookmark}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-all border border-transparent hover:border-neutral-700"
      >
        <Bookmark 
          size={18} 
          className={isBookmarked ? "fill-violet-500 text-violet-500" : "text-gray-400"} 
        />
      </button>

      {/* CARD CONTENT */}
      <div className="flex gap-3 md:flex-col">
        {/* IMAGE */}
        {image && (
      <div className="shrink-0 md:w-full  }">
            <img
              src={image}
              alt="blog"
              className="w-24 h-24 md:w-full md:h-44 object-cover rounded-lg border border-neutral-800 group-hover:opacity-80 transition"
              
            />
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* AUTHOR INFO */}
            <div className="flex gap-2 items-center mb-2">
              <img
                src={authorProfile || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="w-6 h-6 rounded-full border border-neutral-700"
                alt="author"
                onClick={goToProfile}
              />
              <span  onClick={goToProfile} className="text-[11px] font-medium text-gray-300 truncate max-w-[100px]  ">
                {author || "Unknown"}
              </span>
              <span className="text-[10px] text-gray-500">• {date}</span>
            </div>

            {/* TITLE */}
            <h3 className="text-gray-200 text-sm font-semibold line-clamp-2 leading-snug group-hover:text-violet-400 transition">
              {title}
            </h3>
          </div>

          {/* VIEWS */}
          <div className="flex items-center gap-1 mt-3 text-[10px] text-gray-500 uppercase tracking-wider font-bold">
            <Eye size={12} />
            <span>{views || 0} {views === 1 ? "view" : "views"}</span>
          </div>
        </div>
      </div>

      {/* SHARE ACTION */}
      <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-end">
        <button 
          onClick={shareOnWhatsApp} 
          className="text-xs text-gray-500 hover:text-white flex items-center gap-1.5 transition"
        >
          <Share2 size={14} />
          Share
        </button>
      </div>
    </div>
  );
}

export default memo(PostCard);












