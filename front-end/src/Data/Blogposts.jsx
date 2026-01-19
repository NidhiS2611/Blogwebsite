import axios from "axios";

let blogs = [];

// API se top blogs fetch
export async function loadBlogs() {
  try {
    const res = await axios.get("http://localhost:3000/blog/blog");

    blogs = res.data.blogs || [];
    console.log("FETCHED BLOGS:", blogs);

    return blogs;
  } catch (err) {
    console.error("BLOG FETCH ERROR:", err);
    return [];
  }
}

export default blogs;




