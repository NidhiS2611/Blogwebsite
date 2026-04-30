import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import api from "../services/Axiosinstance";

const Getstats = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                // Fetching your author stats
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
                
                {/* Header Section with Gray Borders */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 bg-[#0d0d0d] border border-gray-900 p-8 rounded-xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                        </div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-4">Prime Content Performance</p>
                        <h2 className="text-3xl font-black text-white mb-8 tracking-tight">{bestBlog?.title || "Drafting Content..."}</h2>
                        
                        <div className="flex gap-16">
                            <div>
                                <span className="text-[10px] block text-gray-600 uppercase font-bold mb-2">Engagements</span>
                                <span className="text-4xl font-mono font-bold text-white tracking-tighter">{bestBlog?.viewsCount || 0} <span className="text-xs text-gray-700 font-normal ml-1">VIEWS</span></span>
                            </div>
                            <div className="w-[1px] bg-gray-900"></div>
                            <div>
                                <span className="text-[10px] block text-gray-600 uppercase font-bold mb-2">Reactions</span>
                                <span className="text-4xl font-mono font-bold text-white tracking-tighter">{bestBlog?.likesCount || 0} <span className="text-xs text-gray-700 font-normal ml-1">LIKES</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0d0d0d] border border-gray-900 p-8 rounded-xl flex flex-col justify-center text-left">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Inventory</p>
                        <h3 className="text-6xl font-mono font-black text-white">{data.length}</h3>
                        <p className="text-[10px] text-gray-700 mt-2 font-medium">TOTAL ARTICLES[cite: 1]</p>
                    </div>
                </div>

                {/* All Blogs Comparison Chart[cite: 1] */}
                <div className="bg-[#0d0d0d] border border-gray-900 p-8 rounded-xl">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-1">Global Comparison</h3>
                            <p className="text-[10px] text-gray-600 uppercase">Tracking metrics across all published nodes[cite: 1]</p>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div><span className="text-[10px] font-bold text-gray-500 uppercase">Views</span></div>
                            <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-pink-500"></div><span className="text-[10px] font-bold text-gray-500 uppercase">Likes</span></div>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#151515" />
                                <XAxis dataKey="title" hide={true} />
                                <YAxis hide={true} domain={['dataMin', 'dataMax + 2']} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '4px', fontSize: '12px' }}
                                    itemStyle={{ padding: '0px' }}
                                    cursor={{ stroke: '#222' }}
                                />
                                {/* Smooth Line for Views[cite: 1] */}
                                <Line 
                                    type="monotone" 
                                    dataKey="viewsCount" 
                                    stroke="#a855f7" 
                                    strokeWidth={3} 
                                    dot={false}
                                    activeDot={{ r: 4, stroke: '#000', strokeWidth: 2 }}
                                />
                                {/* Smooth Line for Likes[cite: 1] */}
                                <Line 
                                    type="monotone" 
                                    dataKey="likesCount" 
                                    stroke="#ec4899" 
                                    strokeWidth={3} 
                                    dot={false}
                                    activeDot={{ r: 4, stroke: '#000', strokeWidth: 2 }}
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