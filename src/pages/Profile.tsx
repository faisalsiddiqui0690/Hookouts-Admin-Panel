import { useLucideIcons } from '../hooks/useLucideIcons';

export const Profile = () => {
  // Initialize icons on component mount
  useLucideIcons();
  
  return (
    <div className="page-content" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <div className="container-fluid">
        {/* Profile Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="position-relative">
                  <div className="profile-cover" style={{ height: '200px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                  <div className="position-absolute bottom-0 start-0 translate-middle-y ms-4 mb-4">
                    <img
                      src="/assets/images/users/avatar-1.jpg"
                      alt="Profile"
                      className="rounded-circle border border-4 border-white"
                      width="120"
                      height="120"
                    />
                  </div>
                </div>
                <div className="pt-5 px-4 pb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="fw-bold mb-1">Rose Walls</h3>
                      <p className="text-muted mb-0">Senior Developer</p>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary">
                        <i data-lucide="user-plus" className="me-1 fs-14"></i>
                        Follow
                      </button>
                      <button className="btn btn-primary">
                        <i data-lucide="message-square" className="me-1 fs-14"></i>
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="row">
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">About Me</h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-0">
                  Passionate full-stack developer with 5+ years of experience building web applications.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Activity</h5>
              </div>
              <div className="card-body">
                <p className="text-muted">Recent activity will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                © 2026 Hookouts Admin. Crafted with ❤️
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
