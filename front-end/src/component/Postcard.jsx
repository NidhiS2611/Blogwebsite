import React, { memo, useCallback, useState, useEffect } from "react";
import { Share2, Eye, Bookmark } from "lucide-react"; // ✅ Bookmark import kiya
import { useNavigate } from "react-router-dom";
import api from "../services/Axiosinstance"; // ✅ API instance import kiya
import { useAuth } from "../context/Authcontext"; // ✅ User check karne ke liye

function PostCard({
  id,
  title,
  image,
  author,
  authorProfile,
  date,
  views,
}) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Auth context se user nikal lo
  const [isBookmarked, setIsBookmarked] = useState(false);

  /* ✅ Check if post is already bookmarked on load */
  useEffect(() => {
    if (user && user.bookmarks) {
      setIsBookmarked(user.bookmarks.includes(id));
    }
  }, [user, id]);

  /* ================= OPEN BLOG ================= */
  const goToBlog = useCallback(() => {
    navigate(`/blog/${id}`);
  }, [navigate, id]);

  /* ================= TOGGLE BOOKMARK ================= */
  const handleBookmark = async (e) => {
    e.stopPropagation(); // Card click event ko rokne ke liye
    if (!user) return alert("Please login to bookmark posts");

    try {
      // ✅ API CALL to user/bookmark/:id
      await api.post(`/user/bookmark/${id}`);
      setIsBookmarked(!isBookmarked); // UI update
    } catch (err) {
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

  return (
    <div
      onClick={goToBlog}
      className="
        group cursor-pointer p-4 rounded-xl 
        bg-neutral-900 border border-neutral-800 
        hover:border-neutral-700 transition relative
      "
    >
      {/* 🔖 BOOKMARK ICON (TOP RIGHT) */}
      <button 
        onClick={handleBookmark}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition"
      >
        <Bookmark 
          size={18} 
          className={isBookmarked ? "fill-violet-500 text-violet-500" : "text-gray-400"} 
        />
      </button>

      {/* MOBILE LAYOUT */}
      <div className="flex gap-3 md:block">
        {/* IMAGE */}
        {image && (
          <img
            src={image}
            alt="blog"
            className="w-24 h-24 md:w-full md:h-48 object-cover rounded-lg border border-neutral-800"
          />
        )}

        {/* CONTENT */}
        <div className="flex-1">
          {/* AUTHOR */}
          <div className="flex gap-3 items-center mt-2">
            <img
              src={authorProfile || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              className="w-8 h-8 rounded-full border border-neutral-700"
              alt="author"
            />
            <div>
              <p className="text-sm font-semibold text-white">
                {author || "Unknown"}
              </p>
              <p className="text-[10px] text-gray-500">{date}</p>
            </div>
          </div>

          {/* TITLE */}
          <p className="mt-2 text-gray-200 text-sm font-medium line-clamp-2">
            {title}
          </p>

          {/* VIEWS */}
          <div className="flex items-center gap-1 mt-2 text-[11px] text-gray-500">
            <Eye size={12} />
            <span>{views || 0} views</span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end mt-3 pt-3 border-t border-neutral-800 text-gray-400 text-xs">
        <button onClick={shareOnWhatsApp} className="hover:text-white flex items-center gap-1 transition">
          <Share2 size={14} />
          Share
        </button>
      </div>
    </div>
  );
}

export default memo(PostCard);















