import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // If user is already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        
        // Redirect to intended destination or dashboard
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5">
            <div className="card auth-card">
              <div className="card-body">
                <div className="p-3">
                  <div className="mx-auto mb-5 auth-logo text-center">
                    <a href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
                      <div style={{ 
                        fontSize: '2.2rem', 
                        fontWeight: '800', 
                        letterSpacing: '-0.5px',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                      className="text-dark-mode-aware"
                      >
                        <span style={{ color: '#22b956' }}>Hook</span><span className="logo-text-color">outs</span>
                      </div>
                      <div style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        letterSpacing: '1px',
                        opacity: 0.7,
                        marginTop: '0.25rem',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                      className="text-dark-mode-aware"
                      >
                        ADMIN
                      </div>
                    </a>
                  </div>

                  <div className="text-center">
                    <h3 className="fw-bold text-dark fs-20">Hi, Welcome Back 👋</h3>
                    <p className="text-muted mt-1 mb-4">Enter your credentials to access your admin account.</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="p-3">
                    <form onSubmit={handleSubmit} className="authentication-form">
                      <div className="mb-4">
                        <label className="form-label" htmlFor="UserEmail">Email</label>
                        <div className="position-relative w-100">
                          <input
                            type="email"
                            className="form-control form-control-lg rounded"
                            id="UserEmail"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <p className="text-muted p-0 position-absolute end-0 top-50 border-0 fs-4 translate-middle-y me-2 mb-0">
                            <i className="mdi mdi-email-outline fs-20 mt-1 text-muted"></i>
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label" htmlFor="UserPass">Password</label>
                        <div className="position-relative w-100">
                          <input
                            type="password"
                            className="form-control form-control-lg rounded"
                            id="UserPass"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="btn text-muted p-0 position-absolute end-0 top-50 border-0 fs-4 translate-middle-y me-2"
                          >
                            <i className="mdi mdi-eye-outline fs-20 mt-1 text-muted"></i>
                          </button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="checkbox-signin" />
                          <label className="form-check-label" htmlFor="checkbox-signin">Remember me</label>
                        </div>
                      </div>

                      <div className="text-center d-grid">
                        <button
                          className="btn btn-primary d-flex align-items-center justify-content-center gap-1 fw-medium"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Signing In...
                            </>
                          ) : (
                            <>
                              <i className="mdi mdi-login-variant fs-18"></i> Sign In
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
