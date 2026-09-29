import React, { useState } from 'react';
import { ComplaintMedia } from '../types';
import { Image, Video, Eye, X, ZoomIn } from 'lucide-react';

interface ComplaintMediaViewerProps {
  media: ComplaintMedia[];
}

export const ComplaintMediaViewer: React.FC<ComplaintMediaViewerProps> = ({ media }) => {
  const [activeMedia, setActiveMedia] = useState<ComplaintMedia | null>(null);

  if (!media || media.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-500">
        No photographic or video evidence attached to this grievance report.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {media.map((item, idx) => {
          const isVideo = item.type === 'video' || item.url.includes('.mp4') || item.url.includes('video');
          return (
            <div
              key={idx}
              onClick={() => setActiveMedia(item)}
              className="group relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-200 cursor-pointer shadow-xs hover:ring-2 hover:ring-blue-600 transition-all"
            >
              {isVideo ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white p-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600/80 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] text-slate-300 truncate max-w-full font-mono">{item.name || 'Video Evidence'}</span>
                  <span className="text-[9px] uppercase tracking-wider text-blue-300 font-bold mt-0.5">Click to play</span>
                </div>
              ) : (
                <>
                  <img
                    src={item.url}
                    alt={item.name || 'Grievance Evidence'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="w-6 h-6 text-white drop-shadow-md" />
                  </div>
                </>
              )}

              <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
                {isVideo ? <Video className="w-2.5 h-2.5 text-blue-400" /> : <Image className="w-2.5 h-2.5 text-emerald-400" />}
                <span className="capitalize">{isVideo ? 'Video' : 'Photo'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Video Player Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-800 text-white text-xs">
              <span className="font-semibold truncate max-w-md">{activeMedia.name || 'Attached Evidence'}</span>
              <button
                onClick={() => setActiveMedia(null)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Content */}
            <div className="p-4 flex items-center justify-center max-h-[75vh] bg-black">
              {activeMedia.type === 'video' || activeMedia.url.includes('.mp4') ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] max-w-full rounded"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.name || 'Proof inspection'}
                  className="max-h-[70vh] max-w-full object-contain rounded"
                />
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-950 text-slate-400 text-[11px] flex justify-between items-center px-4">
              <span>Timestamp verified at citizen capture point</span>
              <a
                href={activeMedia.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
