"use client";
import { useEffect, useRef, useState } from 'react';
import { aiService } from '@/services/aiService';
import { AlertCircle } from 'lucide-react';
import { SafeAny } from '@/types';

interface WebcamMonitorProps {
  // ✅ FIX: Signature updated to accept the new backend format
  onDetection: (flags: string[], suspicionScore: number) => void;
  isActive: boolean;
}

export default function WebcamMonitor({ onDetection, isActive }: WebcamMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Audio Refs
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const [status, setStatus] = useState<'initializing' | 'active' | 'error'>('initializing');
  const [lastDetection, setLastDetection] = useState<string>('Initializing...');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const initWebcam = async () => {
      try {
        if (!streamRef.current) {
          // ✅ FIX: Added audio: true to capture microphone
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setStatus('active');
          }

          // ✅ FIX: Initialize Web Audio API to detect noise
          const audioContext = new (window.AudioContext || (window as SafeAny).webkitAudioContext)();
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          analyserRef.current = analyser;
          dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        }
      } catch (error) {
        console.error('Webcam/Mic error:', error);
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

      let isLoudNoise = false;
      if (analyserRef.current && dataArrayRef.current) {
        // Explicitly cast to satisfy the Web Audio API's strict typing
        analyserRef.current.getByteFrequencyData(dataArrayRef.current as Uint8Array<ArrayBuffer>);

        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }

        const averageVolume = sum / dataArrayRef.current.length;

        // Threshold: Adjust this number (0-255) based on mic sensitivity
        if (averageVolume > 35) {
          isLoudNoise = true;
        }
      }

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const result = await aiService.detectFaces(blob);

        // Extract the new backend data
        const flags: string[] = result.flags || [];
        let combinedScore: number = result.suspicion_score || 0;

        // Add Audio to the logic
        if (isLoudNoise) {
          flags.push("BACKGROUND_NOISE");
          combinedScore += 0.3; // Add penalty for noise
        }

        // Send to ExamPage
        onDetection(flags, combinedScore);

        // Update UI Badge
        if (flags.includes("NO_FACE_DETECTED")) setLastDetection('⚠️ No face detected');
        else if (flags.includes("MULTIPLE_FACES")) setLastDetection(`⚠️ Multiple faces`);
        else if (flags.includes("LOOKING_AWAY")) setLastDetection('⚠️ Looking away');
        else if (flags.includes("TALKING_DETECTED")) setLastDetection('⚠️ Talking detected');
        else if (flags.includes("BACKGROUND_NOISE")) setLastDetection('⚠️ Noise detected');
        else setLastDetection('✓ Face verified');

      }, 'image/jpeg', 0.8);
    };

    initWebcam();

    if (isActive) {
      interval = setInterval(captureFrame, 4000);
    }

    return () => {
      if (interval) clearInterval(interval);
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    };
  }, [isActive, onDetection]); // Included onDetection in dependency array safely

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg relative">
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
        <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
        {status === 'active' ? 'LIVE PROCTORING' : status === 'error' ? 'CAMERA/MIC ERROR' : 'INITIALIZING'}
      </div>
      <video ref={videoRef} autoPlay muted className="w-full h-48 object-cover transform scale-x-[-1]" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {lastDetection}
      </div>
      {status === 'error' && (
        <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <AlertCircle size={32} className="mx-auto mb-2" />
            <p className="text-sm">Camera/Mic access denied</p>
          </div>
        </div>
      )}
    </div>
  );
}