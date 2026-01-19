import React, { useEffect, useState } from "react";
import Featuredcard from "../component/Featurecard.jsx";
import Categories from "../component/Categories.jsx";
import PostCard from "../component/Postcard.jsx";

import { loadBlogs } from "../Data/blogposts.jsx";

import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const categories = [
  { icon: "📚", title: "Study Tips", description: "Master effective learning techniques and ace your exams" },
  { icon: "💻", title: "Technology", description: "Latest tech trends, programming tips, and coding tutorials" },
  { icon: "💼", title: "Career", description: "Internships, job hunting, and career planning guidance" },
  { icon: "⚡", title: "Life Hacks", description: "Productivity tips, time management, and student wellness" },
  { icon: "🔬", title: "Research", description: "Academic insights and research methodologies explained" },
  { icon: "🎨", title: "Creative", description: "Portfolio building and creative project ideas" },
];

export default function Index() {
  const [blogList, setBlogList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const loaded = await loadBlogs();
      setBlogList(loaded);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 pt-8 pb-16 px-4">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Welcome to StudyHub</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Your ultimate resource for study tips, career guidance, and student lifestyle hacks
          </p>
        

          <div className="mt-12">
            <Featuredcard />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">Explore Our Categories</h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
            Find the content that matches your interests and helps you grow
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {categories.map((cat, i) => (
              <Categories key={i} icon={cat.icon} title={cat.title} description={cat.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Latest Articles</h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
            Stay updated with our latest insights, tips, and guides
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {blogList.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 text-lg">No articles yet.</p>
            ) : (
              blogList.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  icon={post.icon}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  image={post.media}
                  author={post.author}
                  date={post.date}
                  readTime={post.readTime}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="resources" className="py-16 px-4 bg-gradient-to-r from-purple-500 to-blue-600 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">Stay Updated</h2>

        <p className="text-white/90 mb-8">
          Subscribe to our newsletter and get the latest articles delivered to your inbox
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg border-0"
          />
          <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100">
            Subscribe
          </button>
        </div>

        <p className="text-white/80 text-sm mt-4">No spam, just great content delivered weekly.</p>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">

          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <span className="font-bold text-white text-lg">StudyHub</span>
            </div>

            <p className="text-sm text-gray-400">
              Your go-to resource for student success and growth.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#blog" className="hover:text-purple-400">Blog</a></li>
              <li><a href="#categories" className="hover:text-purple-400">Categories</a></li>
              <li><a href="#resources" className="hover:text-purple-400">Resources</a></li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 className="font-semibold text-white mb-4">Topics</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-purple-400">Study Tips</a></li>
              <li><a href="#" className="hover:text-purple-400">Career</a></li>
              <li><a href="#" className="hover:text-purple-400">Technology</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full hover:bg-purple-600">
                <Twitter className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full hover:bg-purple-600">
                <Linkedin className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full hover:bg-purple-600">
                <Github className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-full hover:bg-purple-600">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          &copy; 2024 StudyHub. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

 



