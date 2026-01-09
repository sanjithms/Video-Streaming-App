import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const VideoPlayer = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const videoUrl = `${import.meta.env.VITE_API_URL}/api/videos/stream/${id}?token=${token}`;

  // --- Styles Object for Cyberpunk Theme ---
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a 40%, #020617)',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    navBar: {
      position: 'relative',
      zIndex: 10,
      padding: '1.5rem 3rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(2, 6, 23, 0.5)',
      backdropFilter: 'blur(10px)'
    },
    backBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'rgba(30, 41, 59, 0.6)',
      color: '#cbd5e1',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '0.75rem 1.5rem',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '600',
      fontSize: '0.9rem'
    },
    badge: {
      fontFamily: 'monospace',
      fontSize: '0.8rem',
      letterSpacing: '2px',
      color: '#64748b',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      padding: '0.5rem 1rem',
      borderRadius: '8px'
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 10,
      padding: '2rem'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '900',
      marginBottom: '0.5rem',
      background: 'linear-gradient(to right, #60a5fa, #c084fc, #f472b6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textAlign: 'center',
      letterSpacing: '-1px'
    },
    subtitle: {
      color: '#94a3b8',
      marginBottom: '3rem',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    playerWrapper: {
      width: '100%',
      maxWidth: '1000px',
      position: 'relative',
      borderRadius: '24px',
      padding: '4px', // Space for gradient border
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    videoContainer: {
      position: 'relative',
      background: '#000',
      borderRadius: '20px',
      overflow: 'hidden',
      aspectRatio: '16/9',
      boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
    },
    glowEffect: {
      position: 'absolute',
      top: '-20px',
      left: '-20px',
      right: '-20px',
      bottom: '-20px',
      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
      filter: 'blur(60px)',
      opacity: 0.3,
      zIndex: -1,
      borderRadius: '40px'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Background Orbs */}
      <div style={{ position: 'fixed', top: '-10%', left: '20%', width: '500px', height: '500px', background: 'rgba(59, 130, 246, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'fixed', bottom: '-10%', right: '20%', width: '500px', height: '500px', background: 'rgba(168, 85, 247, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* Navigation Bar */}
      <div style={styles.navBar}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={styles.backBtn}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = '#c084fc';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Dashboard
        </button>

        <div style={styles.badge}>
          SECURE STREAM • {id.slice(-4).toUpperCase()}
        </div>
      </div>

      {/* Main Player Area */}
      <div style={styles.mainContent}>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={styles.title}>Now Playing</h2>
          <p style={styles.subtitle}>
            <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #22c55e' }}></span>
            Streaming via Secure Protocol (HTTP 206)
          </p>
        </div>

        <div style={styles.playerWrapper}>
          {/* Neon Glow Behind Player */}
          <div style={styles.glowEffect}></div>
          
          <div style={styles.videoContainer}>
            <video 
              controls 
              autoPlay 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              src={videoUrl}
              controlsList="nodownload" 
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoPlayer;