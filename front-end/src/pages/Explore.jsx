import { useEffect, useState } from "react";
import PostCard from "../component/Postcard";
import axios from "axios";

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
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 Fetch all blogs once
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/blog/allblog");
      setBlogs(res.data.blogs);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // 🔹 Search + Category Filter
  const filteredBlogs = blogs.filter((blog) => {
    const matchSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" || blog.category === category;

    return matchSearch && matchCategory;
  });

  // 🔹 Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + BLOGS_PER_PAGE
  );

  // 🔹 Reset page when search/category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* 🔍 SEARCH + CATEGORY */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 border rounded-xl bg-white"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 🧱 BLOG GRID */}
      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : paginatedBlogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedBlogs.map((blog) => (
              <PostCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                excerpt={blog.excerpt}
                category={blog.category}
                image={blog.media}
                author={blog.author?.name || "Unknown"}
                date={new Date(blog.createdAt).toDateString()}
                readTime={blog.readTime || "5 min"}
              />
            ))}
          </div>

          {/* 📄 PAGINATION */}
          <div className="flex justify-center mt-10 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg border
                  ${currentPage === i + 1
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-purple-100"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

