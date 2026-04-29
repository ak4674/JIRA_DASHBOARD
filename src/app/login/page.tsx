'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('jira_dash_user');
    if (user) router.replace('/');
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = JSON.parse(localStorage.getItem('jira_dash_users') || '{}');

    if (isLogin) {
      const u = users[email];
      if (!u || u.password !== password) {
        setError('Invalid email or password');
        return;
      }
      localStorage.setItem('jira_dash_user', JSON.stringify({ email, name: u.name }));
      router.push('/');
    } else {
      if (!name.trim()) { setError('Name is required'); return; }
      if (users[email]) { setError('Account already exists. Please login.'); return; }
      users[email] = { name, password };
      localStorage.setItem('jira_dash_users', JSON.stringify(users));
      localStorage.setItem('jira_dash_user', JSON.stringify({ email, name }));
      router.push('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top left, #e0ecff 0%, #f4f5f7 60%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, sans-serif", padding: '1rem',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
        borderRadius: '1.5rem', padding: '2.5rem', maxWidth: '420px', width: '100%',
        boxShadow: '0 8px 40px rgba(31,38,135,0.08)', border: '1px solid rgba(255,255,255,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 48, height: 48, background: 'linear-gradient(135deg,#0052cc,#00b8d9)',
            borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 20, marginBottom: 12,
          }}>JI</div>
          <h1 style={{
            fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem',
            background: 'linear-gradient(135deg,#0052cc,#00b8d9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Jira Intelligence</h1>
          <p style={{ color: '#5e6c84', fontSize: '0.875rem', margin: 0 }}>
            Enterprise Agile Delivery Dashboard
          </p>
        </div>

        <div style={{
          display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 12,
          padding: 4, marginBottom: '1.5rem',
        }}>
          {['Login', 'Sign Up'].map((t, i) => (
            <button key={t} onClick={() => { setIsLogin(i === 0); setError(''); }}
              style={{
                flex: 1, padding: '0.5rem', border: 'none', borderRadius: 10, cursor: 'pointer',
                fontWeight: (isLogin === (i === 0)) ? 700 : 500, fontSize: '0.875rem',
                background: (isLogin === (i === 0)) ? 'white' : 'transparent',
                color: (isLogin === (i === 0)) ? '#2563eb' : '#64748b',
                boxShadow: (isLogin === (i === 0)) ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}>{t}</button>
          ))}
        </div>

        {error && (
          <div style={{
            background: '#ffebe6', color: '#bf2600', padding: '0.5rem 0.75rem',
            borderRadius: 8, fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1rem',
            border: '1px solid #ffbdad',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required
                style={{
                  width: '100%', padding: '0.625rem 0.75rem', borderRadius: 10, border: '1px solid #e2e8f0',
                  fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                }} placeholder="John Doe" />
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{
                width: '100%', padding: '0.625rem 0.75rem', borderRadius: 10, border: '1px solid #e2e8f0',
                fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
              }} placeholder="you@company.com" />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={4}
              style={{
                width: '100%', padding: '0.625rem 0.75rem', borderRadius: 10, border: '1px solid #e2e8f0',
                fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
              }} placeholder="••••••••" />
          </div>
          <button type="submit" style={{
            width: '100%', padding: '0.75rem', background: '#2563eb', color: 'white',
            border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.9375rem',
            cursor: 'pointer', transition: 'background 0.2s',
          }}>{isLogin ? 'Sign In' : 'Create Account'}</button>
        </form>
      </div>
    </div>
  );
}
