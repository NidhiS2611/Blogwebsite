import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [highlight, setHighlight] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 Fetch Blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blog/feedblog");
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Fetch Highlight
  const fetchHighlight = async () => {
    try {
      const res = await api.get("/blog/today-highlight");
      setHighlight(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchHighlight();
  }, []);

  // 🔎 Search + Category Filter
  const filteredBlogs = blogs.filter((blog) => {
    const matchSearch =
      blog.title?.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" || blog.category === category;

    return matchSearch && matchCategory;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + BLOGS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  return (
    <div className="min-h-screen bg-black text-white max-w-7xl mx-auto px-4 py-8">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* 🔥 HIGHLIGHT SECTION (Mobile Top, Desktop Right) */}
        <div className="order-1 lg:order-2 lg:col-span-1">
          {highlight && (
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-violet-500/20 shadow-xl p-5 rounded-2xl lg:sticky lg:top-8">

              <h2 className="text-lg font-semibold mb-4 text-violet-400">
                🔥 Highlight of the Day
              </h2>

              <h3 className="text-sm font-bold mb-2">
                {highlight.title}
              </h3>

              <p className="text-xs text-gray-400 mb-3">
                {highlight.content?.slice(0, 120)}...
              </p>

              <p className="text-xs text-gray-500 mb-3">
                By {highlight.authorName || "Unknown"}
              </p>

              <Link
                to={`/blog/${highlight._id}`}
                className="text-xs text-violet-500 hover:underline"
              >
                Read More →
              </Link>

            </div>
          )}
        </div>

        {/* 🧱 BLOG SECTION */}
        <div className="order-2 lg:order-1 lg:col-span-3">

          {/* 🔍 SEARCH + CATEGORY */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 text-sm rounded-xl bg-neutral-900 border border-neutral-800 placeholder-gray-400 outline-none focus:ring-1 focus:ring-violet-500"
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

          {/* 🧱 BLOG GRID */}
          {loading ? (
            <p className="text-center text-gray-400">Loading blogs...</p>
          ) : paginatedBlogs.length === 0 ? (
            <p className="text-center text-gray-400">No blogs found</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBlogs.map((blog) => (
                  <PostCard
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    excerpt={blog.excerpt}
                    category={blog.category}
                    image={blog.media}
                    authorId={blog.author?._id}
                    author={blog.author?.name || "Unknown"}
                    authorProfile={blog.author?.profilepicture}
                    
                    date={blog.date}
                    readTime={blog.readTime || "5 min"}
                    views={blog.views?.length || 0}   // ✅ PASS VIEWS COUNT
                  />
                ))}
              </div>

              {/* 📄 PAGINATION */}
              <div className="flex justify-center mt-10 gap-2 flex-wrap">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 text-xs rounded-lg border ${
                      currentPage === i + 1
                        ? "bg-violet-600 border-violet-600 text-white"
                        : "bg-neutral-900 border-neutral-800 text-gray-400 hover:bg-neutral-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}


