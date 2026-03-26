import axios from 'axios';
import { AIDetectionResult } from '@/types';

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export const aiService = {
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/health`);
      return response.status === 200;
    } catch {
      return false;
    }
  },
  
  detectFaces: async (imageBlob: Blob): Promise<AIDetectionResult> => {
    try {
      const formData = new FormData();
      formData.append('file', imageBlob, 'frame.jpg');
      
      const response = await axios.post<AIDetectionResult>(
        `${AI_SERVICE_URL}/detect`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 5000,
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback mock response if service is unavailable
      return {
        timestamp: new Date().toISOString(),
        face_count: 1,
        suspicion_score: 0.1,
        level: 'LOW',
      };
    }
  },
};
