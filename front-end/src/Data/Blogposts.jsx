import axios from "axios";
import api from "../services/Axiosinstance";
let blogs = [];

// API se top blogs fetch
export async function loadBlogs() {
  try {
    const res = await api.get("/blog/blog");

    blogs = res.data.blogs || [];
    console.log("FETCHED BLOGS:", blogs);

    return blogs;
  } catch (err) {
    console.error("BLOG FETCH ERROR:", err);
    return [];
  }
}

export default blogs;




