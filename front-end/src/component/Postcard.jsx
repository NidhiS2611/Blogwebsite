import { Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PostCard({ posts }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.length === 0 ? (
        <p className="col-span-full text-center text-gray-500 text-lg">
          No blog posts available.
        </p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="group bg-white rounded-xl overflow-hidden card-glow cursor-pointer"
            onClick={() => navigate(`/blog/${post.id}`)}
          >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
              />
              <div className="absolute top-4 right-4">
                <span className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Icon and Title */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{post.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 smooth-transition line-clamp-2">
                    {post.title}
                  </h3>
                </div>
              </div>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              {/* Divider */}
              <div className="border-t border-gray-100 my-4" />

              {/* Meta Information */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Date */}
              <p className="text-gray-400 text-xs mt-2">{post.date}</p>

              {/* Read More Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/blog/${post.id}`);
                }}
                className="mt-4 w-full py-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-600 rounded-lg font-semibold hover:from-purple-100 hover:to-blue-100 smooth-transition"
              >
                Read More →
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}


