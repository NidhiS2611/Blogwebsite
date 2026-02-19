import React, { memo, useCallback } from "react";
import { Share2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PostCard({
  id,
  title,
  image,
  author,
  authorProfile,
  date,
  views,   // ✅ ADD THIS
}) {
  const navigate = useNavigate();

  /* ================= OPEN BLOG ================= */
  const goToBlog = useCallback(() => {
    navigate(`/blog/${id}`);
  }, [navigate, id]);

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
        hover:border-neutral-700 transition
      "
    >
      {/* MOBILE LAYOUT */}
      <div className="flex gap-3 md:block">
        {/* IMAGE */}
        {image && (
          <img
            src={image}
            alt="blog"
            className="w-24 h-24 md:w-full md:h-auto object-cover rounded-lg border border-neutral-800"
          />
        )}

        {/* CONTENT */}
        <div className="flex-1">
          {/* AUTHOR */}
          <div className="flex gap-3 items-center">
            <img
              src={authorProfile}
              alt="author"
              className="w-8 h-8 rounded-full border border-neutral-700"
            />
            <div>
              <p className="text-sm font-semibold text-white">
                {author || "Unknown"}
              </p>
              <p className="text-xs text-gray-400">{date}</p>
            </div>
          </div>

          {/* TITLE */}
          <p className="mt-2 text-gray-200 text-sm line-clamp-2">
            {title}
          </p>

          {/* 👇 VIEWS ADDED HERE */}
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
            <Eye size={14} />
            <span>{views || 0} views</span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end mt-3 text-gray-400 text-sm">
        <button onClick={shareOnWhatsApp} className="hover:text-white flex gap-1">
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  );
}

export default memo(PostCard);















