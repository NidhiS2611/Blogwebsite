import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { useAuth } from "../context/Authcontext";
import api from "../services/Axiosinstance";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editImage, setEditImage] = useState(null);

  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editBlogTitle, setEditBlogTitle] = useState("");
  const [editBlogContent, setEditBlogContent] = useState("");
  const [editBlogExcerpt, setEditBlogExcerpt] = useState("");
  const [editBlogCategory, setEditBlogCategory] = useState("");
  const [editBlogImage, setEditBlogImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/user/profile/${userId}`, {
          withCredentials: true,
        });
        setProfile(res.data.profile);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const shareProfile = () => {
    const url = `${window.location.origin}/profile/${profile._id}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Check out this profile: ${profile.name}\n${url}`
      )}`,
      "_blank"
    );
  };

  const shareBlog = (blog) => {
    const url = `${window.location.origin}/blog/${blog._id}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Check out this blog: ${blog.title}\n${url}`
      )}`,
      "_blank"
    );
  };

  const saveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("bio", editBio);
      if (editImage) formData.append("profilepicture", editImage);

      const res = await api.put("/user/updateprofile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile((prev) => ({
        ...prev,
        name: res.data.user.name,
        bio: res.data.user.bio,
        profilepicture: res.data.user.profilepicture,
      }));

      setIsEditingProfile(false);
    } catch {
      alert("Profile update failed");
    }
  };

  const saveBlog = async (blogId) => {
    try {
      const formData = new FormData();
      formData.append("title", editBlogTitle);
      formData.append("content", editBlogContent);
      formData.append("excerpt", editBlogExcerpt);
      formData.append("category", editBlogCategory);
      if (editBlogImage) formData.append("media", editBlogImage);

      const res = await api.put(`/blog/updateblog/${blogId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile((prev) => ({
        ...prev,
        articles: prev.articles.map((b) =>
          b._id === blogId ? res.data.blog : b
        ),
      }));

      setEditingBlogId(null);
    } catch {
      alert("Blog update failed");
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await api.delete(`/blog/deleteblog/${blogId}`, {
        withCredentials: true,
      });

      setProfile((prev) => ({
        ...prev,
        articles: prev.articles.filter((b) => b._id !== blogId),
      }));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-400">Loading...</div>;
  if (!profile)
    return <div className="text-center mt-20 text-gray-400">User not found</div>;

  const isOwnProfile = currentUser?._id === profile?._id;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* BACK */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-violet-400 font-semibold text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* HEADER */}
      <section className="bg-neutral-900 px-4 py-6 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto text-center sm:text-left">

          <img
            src={
              profile.profilepicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="w-24 h-24 rounded-full border mx-auto sm:mx-0 mb-3"
          />

          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-400">{profile.bio || "No bio yet"}</p>

          <div className="flex flex-wrap gap-6 mt-3 justify-center sm:justify-start text-sm">
            <span><b>{profile.articles?.length || 0}</b> Posts</span>
            <span><b>{profile.followers?.length || 0}</b> Followers</span>
            <span><b>{profile.following?.length || 0}</b> Following</span>
          </div>

          {/* 🔥 BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">

            <button
              onClick={shareProfile}
              className="flex items-center justify-center gap-2 bg-neutral-800 px-3 py-2 rounded text-sm"
            >
              <Share2 size={16} /> Share Profile
            </button>

            {!isOwnProfile && (
              <button
                onClick={() => navigate(`/chat?userId=${profile._id}`)}
                className="bg-purple-600 px-3 py-2 rounded text-sm"
              >
                💬 Message
              </button>
            )}

            {isOwnProfile && (
              <button
                onClick={() => {
                  setIsEditingProfile(true);
                  setEditName(profile.name);
                  setEditBio(profile.bio || "");
                }}
                className="bg-violet-600 px-3 py-2 rounded text-sm"
              >
                ✏️ Edit Profile
              </button>
            )}

          </div>
        </div>
      </section>

      {/* BLOGS */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Articles</h2>

        {profile.articles?.map((blog) => (
          <div key={blog._id} className="border rounded-lg p-4 mb-4 bg-neutral-900">
            <h3 className="font-semibold text-lg">{blog.title}</h3>

            <div className="flex gap-4 mt-3 text-sm">
              <button
                onClick={() => shareBlog(blog)}
                className="text-green-400"
              >
                <Share2 size={14} /> share
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}















