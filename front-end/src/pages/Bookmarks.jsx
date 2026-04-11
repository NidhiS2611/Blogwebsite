import { useEffect, useState } from "react";
import PostCard from "../component/Postcard";
import api from "../services/Axiosinstance";

export default function Bookmarks() {
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ API Call to your saved blogs route
      const res = await api.get("/user/saved-blogs");
      
      if (res.data.success) {
        setSavedBlogs(res.data.blogs || []);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load saved blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedBlogs();
  }, []);

  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-violet-500 animate-pulse font-medium">
          Loading...
        </div>
      </div>
    );
  }

  // 2. ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Saved Blogs</h1>
      </div>

      {/* 3. EMPTY STATE */}
      {savedBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <p>No bookmarks found.</p>
        </div>
      ) : (
        /* 4. GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedBlogs.map((blog) => (
            <PostCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              excerpt={blog.excerpt}
              category={blog.category}
              image={blog.media}
              author={blog.author?.name || "Unknown"}
              authorProfile={blog.author?.profilepicture}
              date={blog.date}
              views={blog.views || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}