import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { ArrowLeft, Upload, Sparkles } from "lucide-react";
import api from "../services/Axiosinstance";

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

  const generateAI = async () => {
    

    try {
      setAiLoading(true);
      const res = await api.post("/blog/generate-ai-blog", {
        aiprompt: aiPrompt,
      });
      setAiText(res.data.content);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    try {
      setLoading(true);
      const res = await api.post("/blog/create", data, {
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
    <div className=" bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12">

        {/* Back */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-purple-400 font-semibold mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Create New Article
        </h1>
        <p className="text-gray-400 mb-8">
          Share your knowledge with the world.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE */}
          <input
            name="title"
            placeholder="Article Title"
            className="w-full bg-black border border-neutral-700 px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
            onChange={handleChange}
            value={formData.title}
            required
          />

          {/* EXCERPT */}
          <textarea
            name="excerpt"
            placeholder="Short summary..."
            className="w-full bg-black border border-neutral-700 px-4 py-3 rounded-xl h-28 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
            onChange={handleChange}
            value={formData.excerpt}
            required
          />

          {/* CATEGORY */}
          <select
            name="category"
            className="w-full bg-black border border-neutral-700 px-4 py-3 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
            onChange={handleChange}
            value={formData.category}
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-black">
                {c}
              </option>
            ))}
          </select>

          {/* IMAGE */}
          <label className="flex items-center gap-3 border border-neutral-700 px-4 py-3 rounded-xl cursor-pointer text-gray-300 hover:bg-neutral-900">
            <Upload size={18} /> Upload Media
            <input type="file" name="media" hidden onChange={handleChange} />
          </label>

          {preview && (
            <img
              src={preview}
              className="h-48 w-full object-cover rounded-xl border border-neutral-800"
            />
          )}

          {/* CONTENT + AI */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-semibold">Content</label>
              <button
                type="button"
                onClick={() => setShowAI(!showAI)}
                className="flex gap-2 text-sm bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full"
              >
                <Sparkles size={14} /> AI
              </button>
            </div>

            {showAI && (
              <div className="border border-neutral-700 bg-neutral-900 rounded-xl p-4 space-y-3">
                <input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="What should I write?"
                  className="w-full bg-black border border-neutral-700 px-3 py-2 rounded-lg text-white placeholder-gray-500"
                />

                <button
                  onClick={generateAI}
                  type="button"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  {aiLoading ? "Generating..." : "Generate"}
                </button>

                {aiText && (
                  <div className="bg-black border border-neutral-700 p-3 rounded-lg">
                    <textarea
                      value={aiText}
                      readOnly
                      className="w-full h-28 bg-black text-white text-sm"
                    />

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={acceptAI}
                        type="button"
                        className="bg-green-600 text-white px-4 py-1 rounded text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setShowAI(false)}
                        type="button"
                        className="border border-neutral-700 px-4 py-1 rounded text-sm"
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
              className="w-full bg-black border border-neutral-700 px-4 py-3 rounded-xl h-48 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Write your article..."
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </form>

        {message && (
          <div className="bg-green-600/20 border border-green-600 text-green-400 p-4 rounded-xl mt-4">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-400 p-4 rounded-xl mt-4">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
}







