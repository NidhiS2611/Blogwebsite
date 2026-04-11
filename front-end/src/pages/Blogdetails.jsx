import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MessageCircle } from "lucide-react";
import { useAuth } from "../context/Authcontext";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../services/Axiosinstance";

export default function Blogdetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, setUser } = useAuth(); // setUser add kiya follow update ke liye

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    const loadBlog = async () => {
      try {
        const res = await api.get(`/blog/blog/${id}`);
        const data = res.data.data;

        setPost(data);
        setLikesCount(data.likes?.length || 0);

        if (currentUser && data?.authorData?._id) {
          setIsFollowing(currentUser.following?.includes(data.authorData._id));
          setIsLiked(
            data.likes?.some(id => id.toString() === currentUser._id.toString())
          );
        }
      } catch (err) {
        console.error("Blog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id, currentUser]);

  /* ================= 🔥 HIT VIEW ================= */
  useEffect(() => {
    const hitView = async () => {
      try {
        if (!id) return;
        await api.put(`/blog/view/${id}`);
      } catch (err) {
        console.log("View hit error:", err);
      }
    };
    hitView();
  }, [id]);

  /* ================= FOLLOW ================= */
  const handleFollow = async () => {
    if (!currentUser) return navigate("/login");
    if (!post?.authorData?._id) return;
    if (currentUser._id === post.authorData._id) return;

    try {
      await api.post(`/user/follow/${post.authorData._id}`);
      const res = await api.get("/user/me");
      setUser(res.data.user);
      setIsFollowing(res.data.user.following.includes(post.authorData._id));
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= LIKE ================= */
  const handleLike = async () => {
    if (!currentUser) return navigate("/login");
    if (!post?._id) return;

    setIsLiked((p) => !p);
    setLikesCount((p) => (isLiked ? p - 1 : p + 1));

    try {
      await api.post(`/blog/like/${post._id}`);
    } catch {
      setIsLiked((p) => !p);
      setLikesCount((p) => (isLiked ? p + 1 : p - 1));
    }
  };

  /* ================= COMMENTS LOGIC ================= */
  const fetchComments = async () => {
    try {
      const res = await api.get(`/comment/fetch/${id}`);
      const safeComments = (res.data.comments || []).map((c) => ({
        ...c,
        user: typeof c.user === "object" ? c.user : null,
      }));
      setComments(safeComments);
    } catch (err) {
      console.error("Comment fetch error:", err);
    }
  };

  const handleComment = async () => {
    if (!currentUser || !comment.trim()) return;
    const temp = {
      _id: Date.now(),
      comment,
      user: { _id: currentUser._id, name: currentUser.name },
    };
    setComments((p) => [temp, ...p]);
    setComment("");
    try {
      const res = await api.post(`/comment/comment/${id}`, { comment });
      const safe = {
        ...res.data.comment,
        user: typeof res.data.comment.user === "object" ? res.data.comment.user : temp.user,
      };
      setComments((p) => p.map((c) => (c._id === temp._id ? safe : c)));
    } catch {
      setComments((p) => p.filter((c) => c._id !== temp._id));
    }
  };

  const updateComment = async (commentId) => {
    try {
      const res = await api.put(`/comment/edit/${commentId}`, { comment: editText });
      setComments((p) => p.map((c) => (c._id === commentId ? { ...c, comment: res.data.comment.comment } : c)));
    } catch (e) { console.error(e); } finally { setEditingId(null); }
  };

  const deleteComment = async (commentId) => {
    const old = comments;
    setComments((p) => p.filter((c) => c._id !== commentId));
    try { await api.delete(`/comment/delete/${commentId}`); } catch { setComments(old); }
  };

  const shareOnWhatsApp = () => {
    const blogUrl = `${window.location.origin}/blog/${post._id}`;
    const message = `📘 ${post.title}\n\n${blogUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) return <div className="text-center mt-20 text-gray-400">Loading...</div>;
  if (!post) return <div className="text-center mt-20 text-gray-400">Not Found</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO IMAGE */}
      <section className="h-48 sm:h-72 md:h-96 w-full relative">
        <img src={post.media} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-6">
        {/* BACK BUTTON */}
        <button onClick={() => navigate("/home")} className="flex items-center gap-2 text-purple-400 text-sm mb-6">
          <ArrowLeft size={16} /> Back
        </button>

        {/* 🏷️ CATEGORY */}
        {post.category && (
          <span className="text-purple-500 font-bold text-xs uppercase tracking-widest mb-2 block">
            {post.category}
          </span>
        )}

        {/* 📝 TITLE */}
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>

        {/* 📋 EXCERPT */}
        {post.excerpt && (
          <p className="text-gray-400 text-lg italic mb-6 border-l-4 border-purple-600 pl-4">
            {post.excerpt}
          </p>
        )}

        {/* AUTHOR & EXPERTISE */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-purple-500 font-bold">
              {post.authorData?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-200">{post.authorData?.name || "Unknown"}</p>
              {post.authorData?.expertise && (
                <p className="text-purple-400 text-[10px]">Expert in: {post.authorData.expertise}</p>
              )}
            </div>
          </div>

          {currentUser && currentUser._id !== post.authorData?._id && (
            <button
              onClick={handleFollow}
              className={`px-4 py-1 rounded-full text-xs ${isFollowing ? "bg-neutral-800 border border-neutral-700 text-gray-400" : "bg-purple-600 text-white"}`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* 📖 MAIN CONTENT */}
        <div className="prose prose-invert max-w-none mt-4 text-gray-300 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content?.replace(/\n/g, "\n\n")}
          </ReactMarkdown>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-8 mt-10 border-t border-neutral-800 pt-6">
          <button onClick={handleLike} className="flex gap-2 items-center">
            <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} />
            <span className={isLiked ? "text-red-500" : "text-gray-400"}>{likesCount}</span>
          </button>

          <button onClick={shareOnWhatsApp} className="flex gap-2 items-center text-gray-400">
            <Share2 size={20} /> Share
          </button>

          <button
            onClick={() => { setShowComments((p) => !p); fetchComments(); }}
            className="flex gap-2 items-center text-gray-400"
          >
            <MessageCircle size={20} /> {comments.length}
          </button>
        </div>

        {/* COMMENTS SECTION */}
        {showComments && (
          <div className="mt-8 space-y-4">
            <textarea
              rows={3}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-lg text-sm outline-none focus:border-purple-600"
              placeholder="Join the discussion..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleComment} className="bg-purple-600 px-6 py-2 rounded-lg text-sm font-bold">Post Comment</button>

            <div className="space-y-4 mt-6">
              {comments.map((c) => (
                <div key={c._id} className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
                  <p className="text-xs text-purple-400 font-medium mb-1">{c.user?.name || "User"}</p>
                  {editingId === c._id ? (
                    <div className="mt-2">
                      <input value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-black border border-neutral-700 p-2 rounded text-sm" />
                      <div className="flex gap-3 mt-2 text-xs">
                        <button onClick={() => updateComment(c._id)} className="text-green-400">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-200">{c.comment}</p>
                      {currentUser?._id === c.user?._id && (
                        <div className="flex gap-4 mt-3 text-[10px] font-bold uppercase tracking-wider">
                          <button onClick={() => { setEditingId(c._id); setEditText(c.comment); }} className="text-blue-400">Edit</button>
                          <button onClick={() => deleteComment(c._id)} className="text-red-500">Delete</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}






