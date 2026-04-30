import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from "../services/Axiosinstance"

const Getstats = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await api.get('/blog/getstats', {
                    withCredentials:true,
                });
                console.log("res",res)
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error("API Error", err);
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) return <div className="p-10 text-center font-bold text-indigo-600">Loading Analytics...</div>;

    const bestBlog = data[0];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Best Blog Highlight Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-3xl text-white shadow-xl">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">⭐ Top Performer</span>
                    <h2 className="text-3xl font-bold mt-4">{bestBlog?.title || "No Blogs Yet"}</h2>
                    <div className="flex gap-6 mt-4">
                        <div>
                            <p className="text-indigo-100 text-sm">Total Views</p>
                            <p className="text-2xl font-bold">{bestBlog?.viewsCount || 0}</p>
                        </div>
                        <div className="border-l border-white/20 pl-6">
                            <p className="text-indigo-100 text-sm">Total Likes</p>
                            <p className="text-2xl font-bold">{bestBlog?.likesCount || 0}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-gray-500 font-medium">Total Blogs</p>
                    <h3 className="text-5xl font-black text-indigo-600">{data.length}</h3>
                </div>
            </div>

            {/* Comparison Bar Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Blog Engagement Comparison</h3>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="title" hide={true} /> 
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip 
                                cursor={{fill: '#F9FAFB'}}
                                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="viewsCount" name="Total Views" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={40} />
                            <Bar dataKey="likesCount" name="Total Likes" fill="#F87171" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-center text-gray-400 text-sm mt-4 italic">Hover on bars to see blog titles</p>
            </div>
        </div>
    );
};

export default Getstats;