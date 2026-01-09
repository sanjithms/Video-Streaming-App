import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orgId, setOrgId] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- Styles Object for Cyberpunk Theme ---
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a 40%, #020617)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      color: '#e2e8f0'
    },
    card: {
      position: 'relative',
      zIndex: 10,
      width: '100%',
      maxWidth: '450px',
      background: 'rgba(30, 41, 59, 0.4)',
      backdropFilter: 'blur(16px)',
      borderRadius: '24px',
      border: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
      margin: '1.5rem'
    },
    topGradient: {
      height: '4px',
      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
      width: '100%'
    },
    content: {
      padding: '3rem 2.5rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2.5rem'
    },
    logoBox: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
      height: '64px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      marginBottom: '1.5rem',
      boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '800',
      color: '#fff',
      marginBottom: '0.5rem',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      color: '#94a3b8',
      fontSize: '0.9rem'
    },
    formGroup: {
      position: 'relative',
      marginBottom: '1.5rem'
    },
    icon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b',
      pointerEvents: 'none',
      transition: 'color 0.2s'
    },
    input: {
      width: '100%',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '1rem 1rem 1rem 3rem', // Left padding for icon
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.2s',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '1rem',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
      color: 'white',
      fontWeight: '700',
      fontSize: '1rem',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
      transition: 'transform 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    footer: {
      textAlign: 'center',
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      color: '#94a3b8',
      fontSize: '0.9rem'
    },
    link: {
      color: '#c084fc',
      fontWeight: '600',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      marginLeft: '0.5rem',
      textDecoration: 'underline'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await axios.post('http://localhost:5000/api/auth/register', {
          username,
          password,
          organizationId: orgId || 'MyOrg'
        });
        alert('Registration successful! Please login.');
        setIsRegistering(false);
      } else {
        await login(username, password);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Authentication failed. Check credentials.');
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Background Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'rgba(139, 92, 246, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'rgba(59, 130, 246, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }}></div>

      <div style={styles.card}>
        <div style={styles.topGradient}></div>
        
        <div style={styles.content}>
          <div style={styles.header}>
            <div style={styles.logoBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </div>
            <h2 style={styles.title}>
              {isRegistering ? 'Join StreamHQ' : 'Welcome Back'}
            </h2>
            <p style={styles.subtitle}>
              {isRegistering ? 'Create your secure workspace identity.' : 'Enter your credentials to access the stream.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={styles.formGroup}>
              <div style={styles.icon}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <input 
                style={styles.input}
                placeholder="Username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.background = 'rgba(15, 23, 42, 0.8)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(15, 23, 42, 0.6)';
                }}
              />
            </div>

            {/* Password */}
            <div style={styles.formGroup}>
              <div style={styles.icon}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input 
                style={styles.input}
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.background = 'rgba(15, 23, 42, 0.8)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(15, 23, 42, 0.6)';
                }}
              />
            </div>

            {/* Organization (Animated Height) */}
            <div style={{ 
              overflow: 'hidden', 
              transition: 'all 0.3s ease', 
              maxHeight: isRegistering ? '100px' : '0',
              opacity: isRegistering ? 1 : 0,
              marginBottom: isRegistering ? '1.5rem' : '0'
            }}>
              <div style={{ position: 'relative' }}>
                <div style={styles.icon}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <input 
                  style={styles.input}
                  placeholder="Workspace ID (e.g. Netflix)" 
                  value={orgId} 
                  onChange={e => setOrgId(e.target.value)} 
                  required={isRegistering}
                  onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <button 
              style={styles.button}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </form>

          <div style={styles.footer}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button 
              style={styles.link}
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Log In' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer text */}
      <div style={{ position: 'absolute', bottom: '2rem', color: '#64748b', fontSize: '0.8rem' }}>
        &copy; 2024 StreamHQ. Secure Video Intelligence.
      </div>
    </div>
  );
};

export default Login;