import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import api from "../services/Axiosinstance";

const Getstats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get('/blog/getstats', {
          withCredentials: true,
        });
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("API Error", err);
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-indigo-400">
        Loading Analytics...
      </div>
    );
  }

  const bestBlog = data[0];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-white">

      {/* 🔥 Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* ⭐ Best Blog */}
        <div className="md:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-xl transition hover:scale-[1.02]">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            ⭐ Top Performer
          </span>

          <h2 className="text-3xl font-bold mt-4">
            {bestBlog?.title || "No Blogs Yet"}
          </h2>

          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-indigo-100 text-sm">Total Views</p>
              <p className="text-2xl font-bold">
                {bestBlog?.viewsCount || 0}
              </p>
            </div>

            <div className="border-l border-white/20 pl-6">
              <p className="text-indigo-100 text-sm">Total Likes</p>
              <p className="text-2xl font-bold">
                {bestBlog?.likesCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* 📊 Total Blogs */}
        <div className="bg-[#111827] p-6 rounded-3xl border border-gray-800 shadow-md flex flex-col justify-center items-center text-center transition hover:scale-[1.02]">
          <p className="text-gray-400 font-medium">Total Blogs</p>
          <h3 className="text-5xl font-black text-indigo-400">
            {data.length}
          </h3>
        </div>

      </div>

      {/* 📈 Chart Section */}
      <div className="bg-[#111827] p-8 rounded-3xl shadow-md border border-gray-800">
        <h3 className="text-xl font-bold text-gray-200 mb-6">
          Blog Engagement Comparison
        </h3>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#1F2937"
              />

              <XAxis dataKey="title" hide />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />

              <Tooltip
                cursor={{ fill: '#1F2937' }}
                contentStyle={{
                  backgroundColor: '#111827',
                  borderRadius: '12px',
                  border: '1px solid #374151',
                  color: '#fff'
                }}
              />

              <Legend
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px', color: '#9CA3AF' }}
              />

              <Bar
                dataKey="viewsCount"
                name="Total Views"
                fill="#818CF8"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />

              <Bar
                dataKey="likesCount"
                name="Total Likes"
                fill="#FB7185"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />

            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4 italic">
          Hover on bars to see blog titles
        </p>
      </div>

    </div>
  );
};

export default Getstats;