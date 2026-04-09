import { useState } from 'react';
import { useLucideIcons } from '../hooks/useLucideIcons';
import { users } from '../data/mockData';

export const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Initialize icons on component mount
  useLucideIcons();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* Page Title */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Contacts</h3>
              <button className="btn btn-primary">
                <i data-lucide="user-plus" className="me-2 fs-16"></i>
                Add Contact
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <i
                        data-lucide="search"
                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                      ></i>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="d-flex gap-2 justify-content-md-end">
                      <button className="btn btn-outline-secondary">
                        <i data-lucide="filter" className="me-1 fs-14"></i>
                        Filter
                      </button>
                      <button className="btn btn-outline-secondary">
                        <i data-lucide="download" className="me-1 fs-14"></i>
                        Export
                      </button>
                      <button className="btn btn-outline-danger">
                        <i data-lucide="trash-2" className="me-1 fs-14"></i>
                        Delete ({selectedUsers.length})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">All Contacts</h5>
                <span className="badge bg-primary">{filteredUsers.length} contacts</span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '50px' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleSelectUser(user.id)}
                            />
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="rounded-circle"
                                width="40"
                                height="40"
                              />
                              <span className="fw-medium">{user.name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <i data-lucide="map-pin" className="me-1 fs-14 text-muted"></i>
                            {user.location}
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <i data-lucide="star" className="fs-14 text-warning fill"></i>
                              <span className="fw-medium">{user.rating}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-soft-success">Active</span>
                          </td>
                          <td className="text-end">
                            <div className="dropdown">
                              <button
                                className="btn btn-link text-muted p-0"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i data-lucide="more-horizontal"></i>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <a className="dropdown-item" href="#view">
                                    <i data-lucide="eye" className="me-2 fs-14"></i>
                                    View
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="#edit">
                                    <i data-lucide="edit" className="me-2 fs-14"></i>
                                    Edit
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="#message">
                                    <i data-lucide="message-square" className="me-2 fs-14"></i>
                                    Message
                                  </a>
                                </li>
                                <li>
                                  <hr className="dropdown-divider" />
                                </li>
                                <li>
                                  <a className="dropdown-item text-danger" href="#delete">
                                    <i data-lucide="trash-2" className="me-2 fs-14"></i>
                                    Delete
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 text-muted">Showing {filteredUsers.length} of {users.length} contacts</p>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className="page-item disabled">
                        <a className="page-link" href="#prev">Previous</a>
                      </li>
                      <li className="page-item active">
                        <a className="page-link" href="#1">1</a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#2">2</a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#3">3</a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#next">Next</a>
                      </li>
                    </ul>
                  </nav>
                </div>
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
