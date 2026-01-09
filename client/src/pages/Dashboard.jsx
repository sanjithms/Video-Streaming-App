import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import UploadForm from '../components/UploadForm';
import { Link } from 'react-router-dom';

const socket = io('http://localhost:5000');

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);

  // --- Styles Object for guaranteed consistency ---
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a 40%, #020617)',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '3rem',
      flexWrap: 'wrap',
      gap: '1rem',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      paddingBottom: '1.5rem'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '900',
      margin: 0,
      background: 'linear-gradient(to right, #60a5fa, #c084fc, #f472b6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-1px'
    },
    workspaceBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'rgba(15, 23, 42, 0.6)',
      padding: '0.5rem 1rem',
      borderRadius: '999px',
      border: '1px solid rgba(255,255,255,0.1)',
      marginTop: '0.5rem',
      fontSize: '0.85rem',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '600'
    },
    signOutBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'rgba(30, 41, 59, 0.8)',
      color: '#cbd5e1',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '0.75rem 1.5rem',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '600',
      backdropFilter: 'blur(10px)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '2rem'
    },
    card: {
      background: 'rgba(30, 41, 59, 0.4)',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
    },
    thumbnail: {
      height: '180px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statusBadge: (status) => {
      let bg = 'rgba(148, 163, 184, 0.1)';
      let color = '#94a3b8';
      let border = 'rgba(148, 163, 184, 0.2)';

      if (status === 'completed' || status === 'safe') {
        bg = 'rgba(16, 185, 129, 0.15)';
        color = '#34d399';
        border = 'rgba(16, 185, 129, 0.3)';
      } else if (status === 'processing') {
        bg = 'rgba(59, 130, 246, 0.15)';
        color = '#60a5fa';
        border = 'rgba(59, 130, 246, 0.3)';
      } else if (status === 'flagged' || status === 'failed') {
        bg = 'rgba(244, 63, 94, 0.15)';
        color = '#fb7185';
        border = 'rgba(244, 63, 94, 0.3)';
      }

      return {
        padding: '0.25rem 0.75rem',
        borderRadius: '6px',
        fontSize: '0.7rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        background: bg,
        color: color,
        border: `1px solid ${border}`
      };
    },
    actionButton: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '12px',
      border: 'none',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1rem',
      transition: 'all 0.2s',
      textDecoration: 'none'
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/videos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideos();
    if (user && user.id) socket.emit('join_room', user.id);

    socket.on('video_update', (data) => {
      setVideos((prev) => prev.map((vid) =>
        vid._id === data.videoId
          ? { ...vid, processingStatus: data.status, progress: data.progress, sensitivityStatus: data.sensitivity || vid.sensitivityStatus }
          : vid
      ));
      if(data.progress === 0) fetchVideos();
    });

    return () => socket.off('video_update');
  }, [user]);

  return (
    <div style={styles.container}>
      
      {/* Dynamic Background Orbs (CSS Only) */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'rgba(139, 92, 246, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '40vw', height: '40vw', background: 'rgba(59, 130, 246, 0.15)', filter: 'blur(120px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>StreamHQ</h1>
            <div style={styles.workspaceBadge}>
              <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80' }}></div>
              {user?.organizationId || 'Workspace'}
            </div>
          </div>
          
          <button onClick={logout} style={styles.signOutBtn} onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.5)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sign Out
          </button>
        </header>

        <UploadForm onUploadStart={fetchVideos} />

        {/* Section Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '4rem', marginBottom: '2rem' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>Content Library</h2>
           <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }}></div>
           <span style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' }}>{videos.length} ASSETS</span>
        </div>

        {/* Video Grid */}
        <div style={styles.grid}>
          {videos.map((vid) => (
            <div key={vid._id} style={styles.card}>
              
              {/* Thumbnail Area */}
              <div style={styles.thumbnail}>
                {/* Glowing Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }}></div>
                
                {/* Center Icon */}
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                   🎬
                </div>

                {/* Processing Overlay */}
                {vid.processingStatus === 'processing' && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#1e293b' }}>
                    <div style={{ width: `${vid.progress}%`, height: '100%', background: '#60a5fa', transition: 'width 0.5s ease', boxShadow: '0 0 10px #60a5fa' }}></div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '700', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{vid.title}</h3>

                {/* Badges Container */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <span style={styles.statusBadge(vid.processingStatus)}>{vid.processingStatus}</span>
                  {vid.processingStatus === 'completed' && (
                    <span style={styles.statusBadge(vid.sensitivityStatus)}>{vid.sensitivityStatus}</span>
                  )}
                </div>

                {/* Actions */}
                {vid.processingStatus === 'completed' && (vid.sensitivityStatus === 'safe' || user.role === 'admin') ? (
                   <Link 
                     to={`/watch/${vid._id}`} 
                     style={{ ...styles.actionButton, background: 'linear-gradient(90deg, #2563eb, #7c3aed)', color: 'white', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)' }}
                     onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                     onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                   >
                     <span>Watch Stream</span>
                     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                   </Link>
                ) : (
                  <button disabled style={{ ...styles.actionButton, background: 'rgba(30, 41, 59, 0.5)', color: '#64748b', border: '1px solid rgba(255,255,255,0.05)', cursor: 'not-allowed' }}>
                    {vid.processingStatus === 'processing' ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2px solid #64748b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <span>Locked Content</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {videos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '24px', marginTop: '2rem', background: 'rgba(15, 23, 42, 0.3)' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <svg width="40" height="40" stroke="rgba(148, 163, 184, 0.5)" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>Library Empty</h3>
            <p style={{ color: '#94a3b8' }}>Upload a video above to start the processing engine.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;