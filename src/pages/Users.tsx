import { Fragment, useEffect, useState } from 'react';
import { usersAPI, type User } from '../services/api';

export const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await usersAPI.getAll();
            setUsers(data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (user: User) => {
        setDeletingUser(user);
    };

    const handleConfirmDelete = async () => {
        if (!deletingUser) return;
        
        try {
            setIsSubmitting(true);
            await usersAPI.delete(deletingUser.id);
            await fetchUsers(); // Refresh list
            setDeletingUser(null);
            alert('User deleted successfully!');
        } catch (err: any) {
            console.error('Failed to delete user:', err);
            alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <Fragment>
            <div className="page-content" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                <div className="container-fluid">
                    {/* Page Title */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">All Users</h2>
                        <div>
                            <a href="#!" className="btn btn-primary" onClick={() => window.history.back()}>
                                <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
                            </a>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="row">
                        <div className="col-xl-4 col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <p className="text-uppercase fw-medium mb-0">Total Users</p>
                                            <h5 className="my-3">{users.length}</h5>
                                        </div>
                                        <div className="avatar-sm">
                                            <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                                                <i className="bi bi-people"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <p className="text-uppercase fw-medium mb-0">Active Users</p>
                                            <h5 className="my-3">{users.filter(u => u.isActive).length}</h5>
                                        </div>
                                        <div className="avatar-sm">
                                            <span className="avatar-title bg-soft-success text-success rounded-circle">
                                                <i className="bi bi-check-circle"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <p className="text-uppercase fw-medium mb-0">New This Month</p>
                                            <h5 className="my-3">
                                                {users.filter(u => {
                                                    const date = new Date(u.createdAt || '');
                                                    const now = new Date();
                                                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                                }).length}
                                            </h5>
                                        </div>
                                        <div className="avatar-sm">
                                            <span className="avatar-title bg-soft-info text-info rounded-circle">
                                                <i className="bi bi-calendar-event"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-search fs-5 text-muted"></i>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search users by name, email, or location..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ maxWidth: '400px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title mb-0">Users List</h4>
                                </div>
                                <div className="card-body p-0">
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-3 text-muted">Loading users...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="alert alert-danger m-3">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            {error}
                                        </div>
                                    ) : filteredUsers.length === 0 ? (
                                        <div className="text-center py-5">
                                            <i className="bi bi-inbox fs-1 text-muted"></i>
                                            <p className="text-muted mt-3">No users found</p>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover table-nowrap mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>User</th>
                                                        <th>Email</th>
                                                        <th>Location</th>
                                                        <th>Joined</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginatedUsers.map((user) => (
                                                        <tr key={user.id} onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer' }}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <img
                                                                        src={user.avatar || '/assets/images/users/avatar-1.jpg'}
                                                                        alt={user.name}
                                                                        className="avatar-sm rounded-circle me-2"
                                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                    />
                                                                    <span className="fw-medium">{user.name}</span>
                                                                </div>
                                                            </td>
                                                            <td>{user.email}</td>
                                                            <td>{user.location || 'N/A'}</td>
                                                            <td>
                                                                {new Date(user.createdAt || '').toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </td>
                                                            <td>
                                                                <span className={`badge badge-soft-${user.isActive ? 'success' : 'danger'}`}>
                                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        className="btn btn-sm btn-info"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedUser(user);
                                                                        }}
                                                                        title="View Details"
                                                                    >
                                                                        <i className="bi bi-eye"></i>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteClick(user);
                                                                        }}
                                                                        title="Delete User"
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                        <div className="text-muted">
                                            Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                                        </div>
                                        <nav>
                                            <ul className="pagination mb-0">
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button 
                                                        className="page-link" 
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Previous
                                                    </button>
                                                </li>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                        <button 
                                                            className="page-link" 
                                                            onClick={() => handlePageChange(page)}
                                                        >
                                                            {page}
                                                        </button>
                                                    </li>
                                                ))}
                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                    <button 
                                                        className="page-link" 
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        Next
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">User Details</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center mb-4">
                                    <img
                                        src={selectedUser.avatar || '/assets/images/users/avatar-1.jpg'}
                                        alt={selectedUser.name}
                                        className="rounded-circle mb-3"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    />
                                    <h4>{selectedUser.name}</h4>
                                    <p className="text-muted">{selectedUser.email}</p>
                                    <span className={`badge badge-soft-${selectedUser.isActive ? 'success' : 'danger'}`}>
                                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="text-muted small">Location</label>
                                        <p className="fw-medium">{selectedUser.location || 'Not provided'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-muted small">Joined Date</label>
                                        <p className="fw-medium">
                                            {new Date(selectedUser.createdAt || '').toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="text-muted small">User ID</label>
                                        <p className="fw-medium text-break">{selectedUser.id}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary">
                                    <i className="bi bi-envelope me-1"></i> Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingUser && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Confirm Delete
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setDeletingUser(null)} disabled={isSubmitting}></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-3">Are you sure you want to delete this user?</p>
                                <div className="alert alert-warning">
                                    <div className="d-flex align-items-center gap-3">
                                        <img
                                            src={deletingUser.avatar || '/assets/images/users/avatar-1.jpg'}
                                            alt={deletingUser.name}
                                            className="rounded-circle"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <h6 className="mb-1">{deletingUser.name}</h6>
                                            <p className="mb-0 text-muted small">{deletingUser.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-danger small mb-0">
                                    <strong>Warning:</strong> This action cannot be undone. All user data including messages, matches, and photos will be permanently deleted.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setDeletingUser(null)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger"
                                    onClick={handleConfirmDelete}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-trash me-1"></i> Delete User
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};
