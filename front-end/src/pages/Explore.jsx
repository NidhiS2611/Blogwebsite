
import { useEffect, useRef, useState } from "react";
import PostCard from "../component/Postcard";
import api from "../services/Axiosinstance";

const categories = [
  "All",
  "Study Tips",
  "Technology",
  "Career",
  "Life Hacks",
  "Research",
  "Creative",
];

const BLOGS_PER_PAGE = 10;

export default function Explore() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);

  // 🔹 Fetch blogs (pagination)
  const fetchBlogs = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/blog/allblog?page=${pageNo}&limit=${BLOGS_PER_PAGE}`
      );

      const newBlogs = (res.data.blogs || []).map((blog) => ({
        ...blog,
        likesCount: blog.likes?.length || 0,
      }));

      setBlogs((prev) =>
        pageNo === 1 ? newBlogs : [...prev, ...newBlogs]
      );

      setHasMore(res.data.hasMore);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 First load
  useEffect(() => {
    fetchBlogs(1);
  }, []);

  // 🔹 Infinite Scroll Observer (no visible loader)
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      {
        threshold: 0.1,      // thoda pehle trigger ho
        rootMargin: "200px" // bottom se 200px pe hi next page load
      }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  // 🔹 Fetch next page
  useEffect(() => {
    if (page > 1) fetchBlogs(page);
  }, [page]);

  // 🔹 Search + Category filter (frontend filter)
  const filteredBlogs = blogs.filter((blog) => {
    const matchSearch =
      blog.title?.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" || blog.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white max-w-7xl mx-auto px-4 py-8">
      {/* 🔍 SEARCH + CATEGORY */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:flex-1 px-4 py-3 text-sm rounded-xl bg-neutral-900 border border-neutral-800 placeholder-gray-400 outline-none"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 text-sm rounded-xl bg-neutral-900 border border-neutral-800 text-gray-300 outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} className="bg-neutral-900">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 🧱 FEED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <PostCard
            key={blog.id}
            id={blog.id}
            title={blog.title}
            image={blog.media}
            author={blog.author?.name || "Unknown"}
            authorProfile={blog.author?.profilepicture}
            date={blog.date}
            views={blog.views?.length || 0}   // ✅ PASS VIEWS COUNT
          />
        ))}
      </div>

      {/* 👇 Invisible Trigger (UI pe kuch nahi dikhega) */}
      {hasMore && (
        <div
          ref={loaderRef}
          className="h-10 w-full opacity-0"
        />
      )}
    </div>
  );
}
