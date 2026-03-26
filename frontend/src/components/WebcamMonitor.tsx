"use client";
import { useEffect, useRef, useState } from 'react';
import { aiService } from '@/services/aiService';
import { AlertCircle } from 'lucide-react';

interface WebcamMonitorProps {
  onDetection: (faceCount: number, suspicionScore: number, level: string) => void;
  isActive: boolean;
}

export default function WebcamMonitor({ onDetection, isActive }: WebcamMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'initializing' | 'active' | 'error'>('initializing');
  const [lastDetection, setLastDetection] = useState<string>('Initializing...');
  
  useEffect(() => {
    let stream: MediaStream;
    let interval: NodeJS.Timeout;
    
    const initWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStatus('active');
        }
      } catch (error) {
        console.error('Webcam error:', error);
        setStatus('error');
      }
    };
    
    const captureFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !isActive) return;
      
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const result = await aiService.detectFaces(blob);
        onDetection(result.face_count, result.suspicion_score, result.level);
        
        if (result.face_count === 0) {
          setLastDetection('⚠️ No face detected');
        } else if (result.face_count > 1) {
          setLastDetection(`⚠️ ${result.face_count} faces detected`);
        } else {
          setLastDetection('✓ Face verified');
        }
      }, 'image/jpeg', 0.8);
    };
    
    initWebcam();
    
    if (isActive) {
      interval = setInterval(captureFrame, 4000); // Every 4 seconds
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, onDetection]);
  
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg relative">
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
        <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
        {status === 'active' ? 'LIVE PROCTORING' : status === 'error' ? 'CAMERA ERROR' : 'INITIALIZING'}
      </div>
      
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        className="w-full h-48 object-cover transform scale-x-[-1]"
      />
      
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {lastDetection}
      </div>
      
      {status === 'error' && (
        <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <AlertCircle size={32} className="mx-auto mb-2" />
            <p className="text-sm">Camera access denied</p>
          </div>
        </div>
      )}
    </div>
  );
}
