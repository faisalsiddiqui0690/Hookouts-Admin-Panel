import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/admin';

interface User {
    id: string;
    email: string;
    username?: string;
    isOnline: boolean;
    lastSeenAt?: string;
    profile?: any;
}

export default function OnlineUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('online'); // online, all
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            let url = `${API_BASE_URL}/users`;
            
            if (filter === 'online') {
                url += '?status=online';
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and paginate
    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile?.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="page-content" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    {filter === 'online' ? '🟢 Online Users' : 'All Users'}
                </h2>
                <div className="btn-group">
                    <button 
                        className={`btn btn-sm ${filter === 'online' ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setFilter('online')}
                    >
                        Online Now
                    </button>
                    <button 
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All Users
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-search fs-5 text-muted"></i>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search users by email or username..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            style={{ maxWidth: '400px' }}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="alert alert-info mb-4">
                        <strong>Total:</strong> {users.length} users | 
                        <strong className="ms-3">Online:</strong> {users.filter(u => u.isOnline).length}
                    </div>
                    
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Email</th>
                                            <th>Username</th>
                                            <th>Last Seen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4">
                                                    No users found
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <span className={`badge ${user.isOnline ? 'bg-success' : 'bg-secondary'}`}>
                                                            {user.isOnline ? '● Online' : '○ Offline'}
                                                        </span>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>{user.username || user.profile?.nickname || 'N/A'}</td>
                                                    <td>
                                                        {user.lastSeenAt 
                                                            ? new Date(user.lastSeenAt).toLocaleString()
                                                            : 'Never'
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
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
                </>
            )}
            </div>
        </div>
    );
}
