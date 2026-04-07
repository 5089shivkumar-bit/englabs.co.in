"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Only load PDF.js if mounted
    const loadPdf = async () => {
      if (typeof window === "undefined") return;
      
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = async () => {
        const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        try {
          const loadingTask = pdfjsLib.getDocument('/brochure.pdf');
          const pdf = await loadingTask.promise;
          
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            canvas.style.display = 'block';
            canvas.style.marginBottom = '2px';
            
            if (containerRef.current) {
              containerRef.current.appendChild(canvas);
            }

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            if (pageNum === 1) setLoading(false);
          }
        } catch (error) {
          console.error("Error loading PDF:", error);
          setLoading(false);
        }
      };
      document.head.appendChild(script);
    };

    loadPdf();
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#1a1a1a]" />;

  return (
    <div className="min-h-screen bg-[#1a1a1a] overflow-x-hidden">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center text-white font-sans text-xs uppercase tracking-[0.3em] z-50 bg-[#1a1a1a]">
          Initializing Brochure...
        </div>
      )}
      <div ref={containerRef} className="w-full flex flex-col items-center" />
    </div>
  );
}
