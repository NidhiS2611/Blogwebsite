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
  const { user: currentUser } = useAuth();

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

  /* ================= 🔥 HIT VIEW (ONLY ONCE PER USER) ================= */
 useEffect(() => {
   const hitView = async () => {
      try {
        if (!id) return;
        await api.put(`/blog/view/${id}`); // 🔥 backend me jo route banaya tha
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

    // 🔥 updated logged in user lao
    const res = await api.get("/user/me");

    // 🔥 AuthContext me update karo
    setUser(res.data.user);

    // 🔥 UI update karo
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

  /* ================= COMMENTS ================= */
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
      user: {
        _id: currentUser._id,
        name: currentUser.name,
      },
    };

    setComments((p) => [temp, ...p]);
    setComment("");

    try {
      const res = await api.post(`/comment/comment/${id}`, { comment });

      const safe = {
        ...res.data.comment,
        user:
          typeof res.data.comment.user === "object"
            ? res.data.comment.user
            : temp.user,
      };

      setComments((p) =>
        p.map((c) => (c._id === temp._id ? safe : c))
      );
    } catch {
      setComments((p) => p.filter((c) => c._id !== temp._id));
    }
  };

  const updateComment = async (commentId) => {
    try {
      const res = await api.put(`/comment/edit/${commentId}`, {
        comment: editText,
      });

      const safe = {
        ...res.data.comment,
        user:
          typeof res.data.comment.user === "object"
            ? res.data.comment.user
            : null,
      };

      setComments((p) =>
        p.map((c) => (c._id === commentId ? safe : c))
      );
    } catch (e) {
      console.error("Update failed", e);
    } finally {
      setEditingId(null);
      setEditText("");
    }
  };

  const deleteComment = async (commentId) => {
    const old = comments;
    setComments((p) => p.filter((c) => c._id !== commentId));

    try {
      await api.delete(`/comment/delete/${commentId}`);
    } catch {
      setComments(old);
    }
  };

  /* ================= SHARE ================= */
  const shareOnWhatsApp = () => {
    if (!post) return;
    const blogUrl = `${window.location.origin}/blog/${post._id}`;
    const message = `📘 ${post.title}\n\nBy ${post.authorData?.name || "Author"}\n\n${blogUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-400">Loading...</div>;

  if (!post)
    return <div className="text-center mt-20 text-gray-400">Not Found</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="h-40 sm:h-64 md:h-96">
        <img
          src={post.media}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </section>

      <article className="max-w-3xl mx-auto px-3 sm:px-4 py-5">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-purple-400 text-sm mb-3"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex gap-3 items-center mb-4">
            <span className="px-3 py-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full text-sm font-semibold">
              {post.category}
            </span>
          </div>

        <h1 className="text-xl sm:text-2xl font-bold">{post.title}</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
          <p className="text-gray-400 text-sm">
            By {post.authorData?.name || "Unknown"}
          </p>

          {currentUser && currentUser._id !== post.authorData?._id && (
            <button
              onClick={handleFollow}
              className={`px-4 py-1 rounded text-sm ${
                isFollowing ? "bg-neutral-800" : "bg-purple-600"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
        <div className="text-gray-400 text-xs sm:text-sm md:text-base mt-1">{post.excerpt}</div>

     <div className="prose prose-invert max-w-none mt-4 text-sm sm:text-base md:text-md leading-relaxed">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {post.content?.replace(/\n/g, "\n\n")}
  </ReactMarkdown>
</div>


        <div className="flex gap-6 mt-6 border-t border-neutral-800 pt-4 text-sm">
          <button onClick={handleLike} className="flex gap-2">
            <Heart
              size={18}
              className={isLiked ? "fill-red-500 text-red-500" : ""}
            />
            {likesCount}
          </button>

          <button onClick={shareOnWhatsApp} className="flex gap-2">
            <Share2 size={18} /> Share
          </button>

          <button
            onClick={() => {
              setShowComments((p) => !p);
              fetchComments();
            }}
            className="flex gap-2"
          >
            <MessageCircle size={18} /> {comments.length}
          </button>
        </div>

        {showComments && (
          <div className="mt-6 space-y-3">
            <textarea
              rows={3}
              className="w-full bg-black border border-neutral-700 p-2 rounded text-sm"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              onClick={handleComment}
              className="bg-purple-600 px-4 py-1 rounded text-sm"
            >
              Post
            </button>

            <div className="space-y-3 mt-4">
              {comments.map((c) => (
                <div key={c._id} className="border border-neutral-800 rounded p-3">
                  <p className="text-xs text-gray-400">
                    {c.user?.name || "Unknown user"}
                  </p>

                  {editingId === c._id ? (
                    <>
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-black border border-neutral-700 p-2 mt-2 rounded text-sm"
                      />
                      <div className="flex gap-3 mt-2 text-xs">
                        <button
                          onClick={() => updateComment(c._id)}
                          className="text-green-400"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm mt-1">{c.comment}</p>

                      {currentUser?._id &&
                        c.user?._id &&
                        currentUser._id === c.user._id && (
                          <div className="flex gap-3 mt-2 text-xs">
                            <button
                              onClick={() => {
                                setEditingId(c._id);
                                setEditText(c.comment);
                              }}
                              className="text-blue-400"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteComment(c._id)}
                              className="text-red-400"
                            >
                              Delete
                            </button>
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






