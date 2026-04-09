import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/admin';

interface Like {
    id: string;
    type: string;
    createdAt: string;
    user?: any;
    likedUser?: any;
}

export default function Likes() {
    const [likes, setLikes] = useState<Like[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, today, super
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchLikes();
    }, [filter]);

    const fetchLikes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            let url = `${API_BASE_URL}/analytics/likes`;
            
            if (filter === 'today') {
                url += '?period=today';
            } else if (filter === 'super') {
                url += '?type=SUPER_LIKE';
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLikes(response.data.data || []);
        } catch (error) {
            console.error('Failed to load likes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and paginate
    const filteredLikes = likes.filter(like => 
        like.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        like.likedUser?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        like.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLikes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLikes = filteredLikes.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="page-content" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Likes Management</h2>
                <div className="btn-group">
                    <button 
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All Likes
                    </button>
                    <button 
                        className={`btn btn-sm ${filter === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('today')}
                    >
                        Today
                    </button>
                    <button 
                        className={`btn btn-sm ${filter === 'super' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('super')}
                    >
                        Super Likes
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
                            placeholder="Search likes by user email or type..."
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
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Type</th>
                                        <th>From User</th>
                                        <th>To User</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedLikes.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4">
                                                No likes found
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedLikes.map((like) => (
                                            <tr key={like.id}>
                                                <td><code>{like.id.substring(0, 8)}</code></td>
                                                <td>
                                                    <span className={`badge ${like.type === 'SUPER_LIKE' ? 'bg-warning' : 'bg-info'}`}>
                                                        {like.type === 'SUPER_LIKE' ? '⭐ Super Like' : '👍 Like'}
                                                    </span>
                                                </td>
                                                <td>{like.user?.email || 'N/A'}</td>
                                                <td>{like.likedUser?.email || 'N/A'}</td>
                                                <td>{new Date(like.createdAt).toLocaleString()}</td>
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
                                    Showing {startIndex + 1}-{Math.min(endIndex, filteredLikes.length)} of {filteredLikes.length} likes
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
            )}
            </div>
        </div>
    );
}
