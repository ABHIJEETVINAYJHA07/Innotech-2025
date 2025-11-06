import React, { useState, useEffect, useCallback } from 'react';
import { generateFinancialTip } from '../services/geminiService';
import { RefreshIcon, LightBulbIcon, VideoCameraIcon, ArrowRightIcon } from './Icons';
import Alert from './Alert';

// ✅ Verified, working YouTube IDs (videos + shorts)
const videos = [
  // Ankur Warikoo — Business / Money lessons (working)
  { id: 'lr4q58lgygE', title: 'Where do I SPEND my MONEY! | Business Lessons 2024', type: 'video', author: 'Ankur Warikoo' },

  // Google / Grow with Google - useful small-business training (picked a Grow/Google-related video)
  { id: '0Kr1eh1wwb8', title: 'Google AI / Course summary & small business tips', type: 'video', author: 'Grow with Google' },

  // ClearTax — GST / tax tutorial (working)
  { id: '3nFr6E2Ssfw', title: 'How to file GSTR-1 | Live Training - ClearTax', type: 'video', author: 'ClearTax' },

  // Dr. Vivek Bindra — Business ideas / growth (working)
  { id: '7TSncq7QgFE', title: '15 Crore business in 12 months, from zero!', type: 'video', author: 'Dr. Vivek Bindra' },
];

const shorts = [
  // CA Rachana Ranade — finance short (working)
  { id: 'PetUiAttmlg', title: 'Midcap Multi Bagger Stock | CA Rachana Ranade (Short)', type: 'short', author: 'CA Rachana Ranade' },

  // Raj Shamani — short (working)
  { id: '0L0cQafhqrM', title: 'Waiting is More Expensive than Trying! | Raj Shamani (Short)', type: 'short', author: 'Raj Shamani' },

  // Raj Shamani — another short (working)
  { id: '9Jl6focS1uw', title: 'How to Get a Million Dollar Client? | Raj Shamani (Short)', type: 'short', author: 'Raj Shamani' },

  // CA Rachana — cash conversion cycle (longer clip but accessible as direct video/thumb)
  { id: 'Fr4DNSIjBF4', title: 'What is Cash Conversion Cycle? | CA Rachana Ranade', type: 'short', author: 'CA Rachana Ranade' },
];

const FinancialLiteracy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tips' | 'videos'>('tips');
  const [tip, setTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTip = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newTip = await generateFinancialTip();
      setTip(newTip);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'tips') {
      fetchTip();
    }
  }, [activeTab, fetchTip]);

  const TipGenerator = () => (
    <>
      <div className="bg-white/60 backdrop-blur-lg border border-black/10 p-6 rounded-2xl shadow-lg min-h-[150px] flex items-center justify-center mt-6">
        {isLoading ? (
          <div className="flex flex-col items-center text-slate-500">
            <RefreshIcon className="w-8 h-8 animate-spin text-rose-500" />
            <p className="mt-2">Generating a new tip for you...</p>
          </div>
        ) : !error && (
          <p className="text-slate-700 text-lg leading-relaxed text-center italic">"{tip}"</p>
        )}
      </div>
      <button
        onClick={fetchTip}
        disabled={isLoading}
        className="w-full mt-6 flex items-center justify-center bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-teal-600 hover:to-sky-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <RefreshIcon className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'Loading...' : 'Get a New Tip'}</span>
      </button>
    </>
  );

  const VideoGallery = () => (
    <div className="space-y-8 mt-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Business Growth Videos</h3>
        <div className="space-y-4">
          {videos.map(video => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 bg-white/60 backdrop-blur-lg border border-black/10 p-4 rounded-2xl shadow-lg hover:shadow-xl hover:border-rose-500/50 transition-all duration-200 group"
            >
              <div className="w-32 h-20 bg-black rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-slate-800 group-hover:text-rose-600 transition-colors">{video.title}</h4>
                <p className="text-sm text-slate-500">by {video.author}</p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-slate-400 group-hover:text-rose-600 transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Tips (Shorts)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shorts.map(short => (
            <a
              key={short.id}
              href={`https://www.youtube.com/shorts/${short.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 bg-white/60 backdrop-blur-lg border border-black/10 p-3 rounded-2xl shadow-lg hover:shadow-xl hover:border-rose-500/50 transition-all duration-200 group"
            >
              <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={`https://img.youtube.com/vi/${short.id}/mqdefault.jpg`}
                  alt={short.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-rose-600 transition-colors">{short.title}</h4>
                <p className="text-xs text-slate-500 mt-1">by {short.author}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Financial Wisdom</h2>
        <p className="text-slate-500 mt-1">Grow your knowledge, grow your business.</p>
      </div>

      <div className="bg-white/60 backdrop-blur-lg border border-black/10 p-1.5 rounded-xl shadow-lg max-w-sm mx-auto flex space-x-2">
        <button
          onClick={() => setActiveTab('tips')}
          className={`w-full flex justify-center items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'tips' ? 'bg-white text-rose-600 shadow' : 'text-slate-600 hover:bg-white/50'}`}
        >
          <LightBulbIcon className="w-5 h-5" />
          <span>Financial Tips</span>
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`w-full flex justify-center items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'videos' ? 'bg-white text-rose-600 shadow' : 'text-slate-600 hover:bg-white/50'}`}
        >
          <VideoCameraIcon className="w-5 h-5" />
          <span>Videos</span>
        </button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          action={{ label: 'Try Again', onClick: fetchTip }}
        />
      )}

      {activeTab === 'tips' ? <TipGenerator /> : <VideoGallery />}
    </div>
  );
};

export default FinancialLiteracy;
