import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  UserPlus,
  CheckCircle,
  MessageCircle,
  Navigation,
} from "lucide-react";
import { useAuth } from "../context/Authcontext";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        const res = await axios.get(
          `http://localhost:3000/blog/blog/${id}`,
          { withCredentials: true }
        );

        const data = res.data.data;
        setPost(data);
        setLikesCount(data.likes?.length || 0);

        if (currentUser) {
          setIsFollowing(
            currentUser.following?.includes(data.authorData._id)
          );
          setIsLiked(data.likes?.includes(currentUser._id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id, currentUser]);

  /* ================= FOLLOW ================= */
  const handleFollow = async () => {
    if (!currentUser) return navigate("/login");
    if (currentUser._id === post.authorData._id) return;

    setIsFollowing((prev) => !prev);
    try {
      await axios.post(
        `http://localhost:3000/user/follow/${post.authorData._id}`,
        {},
        { withCredentials: true }
      );
    } catch {
      setIsFollowing((prev) => !prev);
    }
  };

  /* ================= LIKE ================= */
  const handleLike = async () => {
    if (!currentUser) return navigate("/login");

    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await axios.post(
        `http://localhost:3000/blog/like/${post._id}`,
        {},
        { withCredentials: true }
      );
    } catch {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  /* ================= COMMENTS ================= */
  const fetchComments = async () => {
    const res = await axios.get(
      `http://localhost:3000/comment/fetch/${id}`,
      { withCredentials: true }
    );
    setComments(res.data.comments || []);
  };

  const handleComment = async () => {
    if (!currentUser || !comment.trim()) return;

    const temp = {
      _id: Date.now(),
      comment,
      user: { _id: currentUser._id, name: currentUser.name },
    };

    setComments((prev) => [temp, ...prev]);
    setComment("");

    try {
      const res = await axios.post(
        `http://localhost:3000/comment/comment/${id}`,
        { comment },
        { withCredentials: true }
      );

      setComments((prev) =>
        prev.map((c) => (c._id === temp._id ? res.data.comment : c))
      );
    } catch {
      setComments((prev) => prev.filter((c) => c._id !== temp._id));
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditText(c.comment);
  };

  const updateComment = async (commentId) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId ? { ...c, comment: editText } : c
      )
    );
    setEditingId(null);
    setEditText("");

    try {
      await axios.put(
        `http://localhost:3000/comment/edit/${commentId}`,
        { comment: editText },
        { withCredentials: true }
      );
    } catch {
      fetchComments();
    }
  };

  const deleteComment = async (commentId) => {
    const backup = comments;
    setComments((prev) => prev.filter((c) => c._id !== commentId));

    try {
      await axios.delete(
        `http://localhost:3000/comment/delete/${commentId}`,
        { withCredentials: true }
      );
    } catch {
      setComments(backup);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!post) return <div className="text-center mt-20">Not Found</div>;
   if(!currentUser) return navigate('/login')

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="h-56 sm:h-80 md:h-96">
        <img
          src={`http://localhost:3000/uploads/${post.media}`}
          className="w-full h-full object-cover"
        />
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
   
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-purple-600 mb-6 text-sm sm:text-base"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* TITLE + FOLLOW */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            {post.title}
          </h1>

          <button
            onClick={handleFollow}
            className={`w-fit sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base 
  font-semibold flex gap-2 items-center whitespace-nowrap ${isFollowing ? "bg-gray-200" : "bg-purple-600 text-white"
              }`}
          >

            {isFollowing ? <CheckCircle size={18} /> : <UserPlus size={18} />}
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        <p className="text-gray-500 text-sm sm:text-base mb-8">
          By <b>{post.authorData?.name}</b>
        </p>

        {/* CONTENT */}
  <div className="
    max-w-none
    prose
    prose-sm sm:prose-base lg:prose-lg

    prose-h1:text-2xl sm:prose-h1:text-3xl
    prose-h2:text-xl sm:prose-h2:text-2xl
    prose-h3:text-lg sm:prose-h3:text-xl

    prose-p:text-sm sm:prose-p:text-base
    prose-li:text-sm sm:prose-li:text-base

    prose-strong:text-gray-900
    prose-headings:font-bold
  ">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
   
  >
     {post.content.replace(/##/g, "\n\n## ")}
  </ReactMarkdown>
</div>


        {/* ACTIONS */}
        <div className="flex flex-wrap gap-6 mt-10 border-t pt-5 text-sm sm:text-base">
          <button onClick={handleLike} className="flex gap-2 items-center">
            <Heart className={isLiked ? "fill-red-500 text-red-500" : ""} />
            {likesCount}
          </button>

          <button className="flex gap-2 items-center">
            <Share2 /> Share
          </button>

          <button
            onClick={() => {
              setShowComments(!showComments);
              fetchComments();
            }}
            className="flex gap-2 items-center"
          >
            <MessageCircle /> {comments.length}
          </button>
        </div>

        {/* COMMENTS */}
        {showComments && (
          <div className="mt-6">
            <textarea
              rows={3}
              className="w-full border rounded p-2 text-sm"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              onClick={handleComment}
              className="mt-2 bg-purple-600 text-white px-4 py-1.5 rounded text-sm"
            >
              Post
            </button>

            <div className="mt-6 space-y-3">
              {comments.map((c) => (
                <div
                  key={c._id}
                  className="border rounded px-3 py-2 flex flex-col sm:flex-row sm:justify-between gap-2"
                >
                  <div className="flex flex-1 gap-2">
                    <span className="font-semibold text-sm whitespace-nowrap">
                      {c.user?.name}
                    </span>

                    {editingId === c._id ? (
                      <textarea
                        rows={2}
                        className="flex-1 border p-1 text-sm rounded"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-gray-700 break-words">
                        {c.comment}
                      </p>
                    )}
                  </div>

                  {currentUser?._id === c.user?._id && (
                    <div className="flex gap-4 text-xs">
                      {editingId === c._id ? (
                        <button
                          onClick={() => updateComment(c._id)}
                          className="text-green-600"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(c)}
                          className="text-blue-600"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => deleteComment(c._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </div>
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











/* FORMATTER — BUILDER.IO EXACT STYLE */




/* Simple in-file CommentsSection to avoid missing import runtime errors.
   Replace with your real component import if you have one elsewhere. */
