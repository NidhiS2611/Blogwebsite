import { Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PostCard({
  id,
  title,
  excerpt,
  category,
  image,
  author,
  date,
  readTime,
}) {
  const navigate = useNavigate();
  console.log("PostCard ID:", id);
  
  

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer 
      flex flex-col h-[520px]" 
      onClick={() => navigate(`/blog/${id}`)}
    >
      {/* FIXED IMAGE HEIGHT */}
      <div className="relative w-full h-56 overflow-hidden bg-gray-200 flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
        />

        <div className="absolute top-3 right-3">
          <span className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white 
          px-3 py-1 rounded-full text-xs font-semibold shadow">
            {category}
          </span>
        </div>
      </div>

      {/* CONTENT FIXED HEIGHT */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Title (force 2 lines) */}
        <h3 className="font-bold text-lg text-gray-900 leading-snug 
        group-hover:text-purple-600 line-clamp-2 h-[48px]">
          {title}
        </h3>

        {/* Excerpt (force 2 lines) */}
        <p className="text-gray-600 text-sm line-clamp-2 mt-2 h-[40px]">
          {excerpt}
        </p>

        {/* FIXED DIVIDER POSITION */}
        <hr className="my-4 border-gray-200" />

        {/* META FIXED AREA */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" /> {author}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {readTime}
          </span>
        </div>

        <p className="text-gray-400 text-xs mt-1">{date}</p>

        {/* BUTTON ALWAYS AT BOTTOM */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/blog/${id}`);
          }}
          className="mt-auto w-full py-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-600 
          rounded-lg font-semibold hover:from-purple-100 hover:to-blue-100 transition"
        >
          Read More →
        </button>
      </div>
    </div>
  );
}







