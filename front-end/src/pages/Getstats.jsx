import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
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

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
            <div className="animate-pulse text-xl font-bold text-gray-400 tracking-widest">LOADING ANALYTICS...</div>
        </div>
    );

    const bestBlog = data[0];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header Cards - Black with Gray Borders */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-[#121212] p-8 rounded-2xl border border-gray-800 shadow-2xl">
                        <div className="inline-flex items-center gap-2 bg-purple-900/30 text-purple-400 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-purple-500/20 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            Top Performer
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-6">
                            {bestBlog?.title || "No Blogs Yet"}
                        </h2>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-semibold tracking-wider mb-1">Total Views</p>
                                <p className="text-3xl font-mono font-bold text-white">{bestBlog?.viewsCount || 0}</p>
                            </div>
                            <div className="border-l border-gray-800 pl-8">
                                <p className="text-gray-500 text-xs uppercase font-semibold tracking-wider mb-1">Total Likes</p>
                                <p className="text-3xl font-mono font-bold text-white">{bestBlog?.likesCount || 0}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-[#121212] p-8 rounded-2xl border border-gray-800 flex flex-col justify-center items-center text-center">
                        <p className="text-gray-500 font-semibold uppercase text-xs tracking-widest mb-2">Total Blogs</p>
                        <h3 className="text-6xl font-mono font-black text-white">
                            {data.length}
                        </h3>
                    </div>
                </div>

                {/* Line Chart Section - Dark Mode UI */}
                <div className="bg-[#121212] p-8 rounded-2xl border border-gray-800">
                    <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
                        <div className="h-1 w-6 bg-purple-500 rounded-full"></div>
                        Blog Engagement Trend
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f1f" />
                                <XAxis 
                                    dataKey="title" 
                                    hide={true} 
                                /> 
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#4b5563', fontSize: 12}} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1a1a1a', 
                                        border: '1px solid #333', 
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Legend verticalAlign="top" align="right" height={36} iconType="circle"/>
                                {/* Line for Views */}
                                <Line 
                                    type="monotone" 
                                    dataKey="viewsCount" 
                                    name="Views" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2 }} 
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                {/* Line for Likes */}
                                <Line 
                                    type="monotone" 
                                    dataKey="likesCount" 
                                    name="Likes" 
                                    stroke="#ec4899" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#ec4899', strokeWidth: 2 }} 
                                    activeDot={{ r: 6, strokeWidth: 0 }}
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