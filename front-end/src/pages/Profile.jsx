import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/Authcontext";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // profile edit
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  // blog edit
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editBlogTitle, setEditBlogTitle] = useState("");
  const [editBlogContent, setEditBlogContent] = useState("");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/user/profile/${userId}`,
          { withCredentials: true }
        );
        setProfile(res.data.profile);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  /* ================= WHATSAPP SHARE HELPER ================= */
  const shareOnWhatsApp = (text, url) => {
    const message = `${text}\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    // auto copy
    navigator.clipboard.writeText(url);

    // open whatsapp
    window.open(whatsappUrl, "_blank");
  };

  /* ================= PROFILE SHARE ================= */
  const shareProfile = () => {
    
  const url = `https://statueless-carey-nonpestilently.ngrok-free.dev/profile/${profile._id}`;
    shareOnWhatsApp(
      `Check out this profile: ${profile.name}`,
      url
    );
  };

  /* ================= BLOG SHARE ================= */
  const shareBlog = (blog) => {
    const url = `${window.location.origin}/blog/${blog._id}`;
    shareOnWhatsApp(
      `Read this article: ${blog.title}`,
      url
    );
  };

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      const res = await axios.put(
        "http://localhost:3000/user/edit-profile",
        { name: editName, bio: editBio },
        { withCredentials: true }
      );
      setProfile(res.data.user);
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SAVE BLOG ================= */
  const saveBlog = async (blogId) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/blog/${blogId}`,
        { title: editBlogTitle, content: editBlogContent },
        { withCredentials: true }
      );

      setProfile((prev) => ({
        ...prev,
        articles: prev.articles.map((b) =>
          b._id === blogId ? res.data.blog : b
        ),
      }));
      setEditingBlogId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!profile) return <div className="text-center mt-20">User not found</div>;

  const isOwnProfile = currentUser?._id === profile._id;

  return (
    <div className="min-h-screen bg-white">
      {/* BACK */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-purple-600 font-semibold"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* HEADER */}
      <section className="bg-gradient-to-r from-purple-500 to-blue-600 px-4 py-8">
        <div className="max-w-4xl mx-auto text-white text-center sm:text-left">
          <img
            src={
              profile.image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="w-24 h-24 rounded-full border-4 border-white mx-auto sm:mx-0 mb-3"
          />

          {!isEditingProfile ? (
            <>
              <h1 className="text-2xl sm:text-4xl font-bold">
                {profile.name}
              </h1>
              <p className="opacity-90">
                {profile.bio || "No bio yet"}
              </p>
            </>
          ) : (
            <div className="bg-white text-black p-4 rounded-lg max-w-md mt-4">
              <label className="text-sm font-semibold">Name</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
              />

              <label className="text-sm font-semibold">Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="border p-2 w-full mb-3 rounded"
              />

              <div className="flex gap-3">
                <button
                  onClick={saveProfile}
                  className="bg-purple-600 text-white px-4 py-2 rounded w-full"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="border px-4 py-2 rounded w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={shareProfile}
              className="flex items-center gap-1 bg-white/20 px-4 py-2 rounded"
            >
              <Share2 size={16} /> Share
            </button>

            {isOwnProfile && !isEditingProfile && (
              <button
                onClick={() => {
                  setIsEditingProfile(true);
                  setEditName(profile.name);
                  setEditBio(profile.bio || "");
                }}
                className="bg-white text-purple-600 px-4 py-2 rounded"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </div>
      </section>

      {/* BLOGS */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Articles
        </h2>

        {profile.articles.map((blog) => {
          const isOwner =
            currentUser?._id === blog.author ||
            currentUser?._id === blog.author?._id;

          return (
            <div key={blog._id} className="border rounded-lg p-4 mb-4">
              {editingBlogId === blog._id ? (
                <>
                  <label className="text-sm font-semibold">Title</label>
                  <input
                    value={editBlogTitle}
                    onChange={(e) => setEditBlogTitle(e.target.value)}
                    className="border p-2 w-full mb-2 rounded"
                  />

                  <label className="text-sm font-semibold">Content</label>
                  <textarea
                    value={editBlogContent}
                    onChange={(e) => setEditBlogContent(e.target.value)}
                    className="border p-2 w-full mb-3 rounded"
                    rows={4}
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => saveBlog(blog._id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded w-full"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingBlogId(null)}
                      className="border px-4 py-2 rounded w-full"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">{blog.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {blog.content}
                  </p>

                  <div className="flex gap-4 mt-3 flex-wrap">
                    <button
                      onClick={() => shareBlog(blog)}
                      className="flex items-center gap-1 text-blue-600"
                    >
                      <Share2 size={16} /> Share
                    </button>

                    {isOwner && (
                      <button
                        onClick={() => {
                          setEditingBlogId(blog._id);
                          setEditBlogTitle(blog.title);
                          setEditBlogContent(blog.content);
                        }}
                        className="text-purple-600"
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}






