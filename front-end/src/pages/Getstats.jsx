import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from "../services/Axiosinstance";

const Getstats = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                // Backend se comparison stats fetch kar rahe hain
                const res = await api.get('/blog/getstats', { withCredentials: true });
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Stats Fetch Error:", err);
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#050505]">
            <div className="text-gray-600 font-mono animate-pulse tracking-widest text-xs uppercase">Initialising Analytics...</div>
        </div>
    );

    const bestBlog = data[0];

    return (
        <div className="min-h-screen bg-[#050505] text-gray-400 p-4 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 bg-[#0d0d0d] border border-gray-900 p-8 rounded-xl shadow-2xl relative">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-4">Prime Content Performance</p>
                        <h2 className="text-3xl font-black text-white mb-8 tracking-tight italic">{bestBlog?.title || "No Content"}</h2>
                        <div className="flex gap-16">
                            <div>
                                <span className="text-[10px] block text-gray-600 uppercase font-bold mb-2">Engagements</span>
                                <span className="text-4xl font-mono font-bold text-white tracking-tighter">{bestBlog?.viewsCount || 0}</span>
                            </div>
                            <div className="w-[1px] bg-gray-900"></div>
                            <div>
                                <span className="text-[10px] block text-gray-600 uppercase font-bold mb-2">Reactions[cite: 1]</span>
                                <span className="text-4xl font-mono font-bold text-white tracking-tighter">{bestBlog?.likesCount || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0d0d0d] border border-gray-900 p-8 rounded-xl flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Inventory[cite: 1]</p>
                        <h3 className="text-6xl font-mono font-black text-white">{data.length}</h3>
                        <p className="text-[10px] text-gray-700 mt-2 font-medium">TOTAL ARTICLES[cite: 1]</p>
                    </div>
                </div>

                {/* All Blogs Comparison Chart[cite: 1] */}
                <div className="bg-[#0d0d0d] border border-gray-900 p-8 rounded-xl">
                    <div className="flex justify-between items-end mb-12">
                        <h3 className="text-white text-sm font-bold uppercase tracking-wider">Global Comparison[cite: 1]</h3>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-[#a855f7]"></div><span className="text-[10px] font-bold text-gray-500 uppercase">Views</span></div>
                            <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-[#ec4899]"></div><span className="text-[10px] font-bold text-gray-500 uppercase">Likes</span></div>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#151515" />
                                {/* CRITICAL FIX: dataKey title ko padding ke liye rakho par tick hide karo[cite: 1] */}
                                <XAxis dataKey="title" tick={false} axisLine={false} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#333', fontSize: 10}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '4px', fontSize: '11px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: '#222' }}
                                />
                                {/* Smooth Line across all data points[cite: 1] */}
                                <Line 
                                    type="monotone" 
                                    dataKey="viewsCount" 
                                    stroke="#a855f7" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#a855f7', strokeWidth: 0 }}
                                    activeDot={{ r: 6, stroke: '#000', strokeWidth: 2 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="likesCount" 
                                    stroke="#ec4899" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#ec4899', strokeWidth: 0 }}
                                    activeDot={{ r: 6, stroke: '#000', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Getstats;