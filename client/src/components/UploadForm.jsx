import { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UploadForm = ({ onUploadStart }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { token } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  // --- Styles Object for Perfect Layout ---
  const styles = {
    card: {
      background: 'rgba(30, 41, 59, 0.4)',
      borderRadius: '20px',
      border: '1px solid rgba(255,255,255,0.05)',
      overflow: 'hidden',
      position: 'relative',
      marginBottom: '3rem',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
    },
    topLine: {
      height: '4px',
      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
      width: '100%'
    },
    content: {
      padding: '2.5rem'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
      color: '#fff',
      fontSize: '1.5rem',
      fontWeight: '700'
    },
    iconBox: {
      background: 'rgba(51, 65, 85, 0.5)',
      padding: '0.75rem',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    formGroup: {
      marginBottom: '2rem'
    },
    label: {
      display: 'block',
      color: '#94a3b8',
      fontSize: '0.9rem',
      fontWeight: '600',
      marginBottom: '0.75rem',
      letterSpacing: '0.5px'
    },
    input: {
      width: '100%',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box' // Critical for alignment
    },
    dropZone: {
      border: `2px dashed ${isDragOver ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`,
      background: isDragOver ? 'rgba(139, 92, 246, 0.1)' : 'rgba(15, 23, 42, 0.3)',
      borderRadius: '16px',
      padding: '3rem 2rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '2rem'
    },
    uploadIconCircle: {
      background: 'rgba(30, 41, 59, 0.8)',
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0.5rem',
      border: '1px solid rgba(255,255,255,0.05)'
    },
    fileInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(15, 23, 42, 0.8)',
      padding: '1rem',
      borderRadius: '12px',
      width: '100%',
      border: '1px solid rgba(16, 185, 129, 0.3)'
    },
    submitButton: {
      background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
      color: 'white',
      border: 'none',
      padding: '1rem 2.5rem',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: loading || !file ? 'not-allowed' : 'pointer',
      opacity: loading || !file ? 0.5 : 1,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginLeft: 'auto', // Pushes button to the right
      transition: 'transform 0.2s',
      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    try {
      await axios.post('http://localhost:5000/api/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      setFile(null);
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUploadStart) onUploadStart();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) setFile(droppedFile);
      else alert('Please upload a video file.');
    }
  };
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  return (
    <div style={styles.card}>
      {/* Decorative Top Gradient */}
      <div style={styles.topLine}></div>

      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.iconBox}>
            <svg width="24" height="24" stroke="#c084fc" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          </div>
          <span>Upload Content</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title Input Section */}
          <div style={styles.formGroup}>
            <label style={styles.label}>VIDEO TITLE</label>
            <input 
              type="text" 
              placeholder="e.g. My Amazing Trip to Japan" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              required
            />
          </div>

          {/* Drag & Drop Section */}
          <div 
            style={styles.dropZone}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input type="file" accept="video/*" onChange={handleFileSelect} style={{ display: 'none' }} ref={fileInputRef} />

            {!file ? (
              <>
                <div style={styles.uploadIconCircle}>
                  <svg width="32" height="32" stroke="#94a3b8" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <div style={{ color: '#e2e8f0', fontWeight: '500' }}>
                  <span style={{ color: '#8b5cf6', textDecoration: 'underline' }}>Click to upload</span> or drag and drop
                </div>
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>MP4, WebM or Ogg (Max 100MB)</div>
              </>
            ) : (
              <div style={styles.fileInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                    <svg width="24" height="24" stroke="#34d399" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>{file.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{formatSize(file.size)}</div>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                >
                  <svg width="20" height="20" stroke="#ef4444" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={loading || !file}
              style={styles.submitButton}
              onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? (
                <>
                  <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>Start Upload</span>
                  <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;