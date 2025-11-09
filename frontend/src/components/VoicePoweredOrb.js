import React, { useEffect, useRef, useState } from 'react';
import './VoicePoweredOrb.css';

export const VoicePoweredOrb = ({ 
  enableVoiceControl = false, 
  className = '', 
  onVoiceDetected = () => {},
  size = 200 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const streamRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (enableVoiceControl && !isInitialized) {
      initializeAudio();
    } else if (!enableVoiceControl && isInitialized) {
      cleanup();
    }

    return () => cleanup();
  }, [enableVoiceControl, isInitialized]);

  const initializeAudio = async () => {
    try {
      // Clean up any existing audio context first
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        await audioContextRef.current.close();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      
      setIsInitialized(true);
      startAnimation();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsInitialized(false);
    }
  };

  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    dataArrayRef.current = null;
    setIsInitialized(false);
  };

  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animate = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      // Calculate average volume
      const average = dataArrayRef.current.reduce((sum, value) => sum + value, 0) / dataArrayRef.current.length;
      const normalizedVolume = average / 255;
      
      // Notify parent of voice detection
      onVoiceDetected(normalizedVolume > 0.1);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
      gradient.addColorStop(0, `rgba(108, 99, 255, ${0.1 + normalizedVolume * 0.3})`);
      gradient.addColorStop(0.5, `rgba(159, 122, 234, ${0.05 + normalizedVolume * 0.2})`);
      gradient.addColorStop(1, 'rgba(108, 99, 255, 0.02)');

      // Draw background circle
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw multiple orb layers
      const time = Date.now() * 0.001;
      const layers = 5;

      for (let i = 0; i < layers; i++) {
        const layerRadius = (size / 2) * (0.3 + (i / layers) * 0.7);
        const opacity = (0.8 - i * 0.15) * (0.3 + normalizedVolume * 0.7);
        
        // Create pulsing effect based on voice
        const pulseRadius = layerRadius + Math.sin(time * 2 + i) * 10 * normalizedVolume;
        
        // Color variations for each layer
        const hue = 250 + i * 10 + normalizedVolume * 30;
        const saturation = 70 + normalizedVolume * 30;
        const lightness = 60 + i * 5;

        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw frequency visualization
      if (normalizedVolume > 0.05) {
        const barCount = 32;
        const angleStep = (Math.PI * 2) / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const frequency = dataArrayRef.current[i] || 0;
          const normalizedFreq = frequency / 255;
          
          const angle = i * angleStep;
          const innerRadius = size / 3;
          const barHeight = normalizedFreq * 40;
          
          const startX = centerX + Math.cos(angle) * innerRadius;
          const startY = centerY + Math.sin(angle) * innerRadius;
          const endX = centerX + Math.cos(angle) * (innerRadius + barHeight);
          const endY = centerY + Math.sin(angle) * (innerRadius + barHeight);
          
          ctx.strokeStyle = `hsla(${250 + normalizedFreq * 60}, 80%, 70%, ${normalizedFreq * 0.8})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }

      // Draw central core
      const coreRadius = 20 + normalizedVolume * 15;
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius);
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 + normalizedVolume * 0.2})`);
      coreGradient.addColorStop(0.7, `rgba(108, 99, 255, ${0.6 + normalizedVolume * 0.4})`);
      coreGradient.addColorStop(1, 'rgba(108, 99, 255, 0.2)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Static orb when not recording
  useEffect(() => {
    if (!enableVoiceControl) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw static orb
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
      gradient.addColorStop(0, 'rgba(108, 99, 255, 0.3)');
      gradient.addColorStop(0.5, 'rgba(159, 122, 234, 0.2)');
      gradient.addColorStop(1, 'rgba(108, 99, 255, 0.1)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Static core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      coreGradient.addColorStop(1, 'rgba(108, 99, 255, 0.4)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [enableVoiceControl, size]);

  return (
    <div className={`voice-orb-container ${className}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="voice-orb-canvas"
      />
      {enableVoiceControl && (
        <div className="orb-status">
          <div className="pulse-indicator" />
          <span>Listening...</span>
        </div>
      )}
    </div>
  );
};
