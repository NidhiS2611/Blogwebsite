import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Authcontext";
import { ArrowLeft, Upload, Sparkles } from "lucide-react";

const CATEGORIES = [
  "Study Tips",
  "Technology",
  "Career",
  "Life Hacks",
  "Research",
  "Creative",
];

export default function CreateBlog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUser = user;

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    media: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // AI
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media") {
      setFormData({ ...formData, media: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // AI generate
  const generateAI = async () => {
    if (!aiPrompt) return alert("Enter prompt");

    try {
      setAiLoading(true);
      const res = await axios.post("http://localhost:3000/blog/generate-ai-blog", {
        prompt: aiPrompt,
      });
      setAiText(res.data.text);
    } catch {
      alert("AI failed");
    } finally {
      setAiLoading(false);
    }
  };

  const acceptAI = () => {
    setFormData({ ...formData, content: aiText });
    setShowAI(false);
    setAiPrompt("");
    setAiText("");
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("excerpt", formData.excerpt);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append("media", formData.media);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/blog/create", data, {
        withCredentials: true,
      });

      setMessage(res.data.message || "Blog created successfully");

      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        media: null,
      });
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || "Blog create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-purple-600 font-semibold mb-6 sm:mb-8 text-sm sm:text-base"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
          Create New Article
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-10">
          Share your knowledge with the world.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

          <input
            name="title"
            placeholder="Article Title"
            className="w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base"
            onChange={handleChange}
            value={formData.title}
            required
          />

          <textarea
            name="excerpt"
            placeholder="Short summary..."
            className="w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-xl h-24 sm:h-32 text-sm sm:text-base"
            onChange={handleChange}
            value={formData.excerpt}
            required
          />

          <select
            name="category"
            className="w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base"
            onChange={handleChange}
            value={formData.category}
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Image */}
          <label className="flex items-center gap-2 sm:gap-3 border px-3 sm:px-4 py-2 sm:py-3 rounded-xl cursor-pointer text-sm sm:text-base">
            <Upload size={18} /> Upload Media
            <input type="file" name="media" hidden onChange={handleChange} />
          </label>

          {preview && (
            <img
              src={preview}
              className="h-40 sm:h-48 w-full object-cover rounded-xl"
            />
          )}

          {/* Content + AI */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-sm sm:text-base">
                Content
              </label>
              <button
                type="button"
                onClick={() => setShowAI(!showAI)}
                className="flex gap-1 sm:gap-2 text-xs sm:text-sm bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full"
              >
                <Sparkles size={14} /> AI
              </button>
            </div>

            {showAI && (
              <div className="border bg-purple-50 rounded-xl p-3 sm:p-4 space-y-3">
                <input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="What should I write?"
                  className="w-full border px-3 py-2 rounded-lg text-sm"
                />

                <button
                  onClick={generateAI}
                  type="button"
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  {aiLoading ? "Generating..." : "Generate"}
                </button>

                {aiText && (
                  <div className="bg-white p-3 rounded-lg">
                    <textarea
                      value={aiText}
                      readOnly
                      className="w-full h-28 text-sm"
                    />

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={acceptAI}
                        type="button"
                        className="bg-green-500 text-white px-4 py-1 rounded text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setShowAI(false)}
                        type="button"
                        className="border px-4 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-xl h-40 sm:h-48 text-sm sm:text-base"
              placeholder="Write your article..."
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </form>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-800 p-3 sm:p-4 rounded-xl mt-4 text-sm sm:text-base">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-800 p-3 sm:p-4 rounded-xl mt-4 text-sm sm:text-base">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
}






