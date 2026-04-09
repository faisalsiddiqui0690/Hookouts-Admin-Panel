import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/admin';

interface Message {
    id: string;
    content: string;
    createdAt: string;
    sender?: any;
    receiver?: any;
}

export default function Messages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('today'); // today, all
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            let url = `${API_BASE_URL}/analytics/messages`;
            
            if (filter === 'today') {
                url += '?period=today';
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data.data || []);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and paginate
    const filteredMessages = messages.filter(msg => 
        msg.sender?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.receiver?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="page-content" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Messages Management</h2>
                <div className="btn-group">
                    <button 
                        className={`btn btn-sm ${filter === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('today')}
                    >
                        Today
                    </button>
                    <button 
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All Messages
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
                            placeholder="Search messages by user or content..."
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
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Message</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedMessages.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4">
                                                No messages found
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedMessages.map((msg) => (
                                            <tr key={msg.id}>
                                                <td><code>{msg.id.substring(0, 8)}</code></td>
                                                <td>{msg.sender?.email || 'N/A'}</td>
                                                <td>{msg.receiver?.email || 'N/A'}</td>
                                                <td>
                                                    <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {msg.content}
                                                    </div>
                                                </td>
                                                <td>{new Date(msg.createdAt).toLocaleString()}</td>
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
                                    Showing {startIndex + 1}-{Math.min(endIndex, filteredMessages.length)} of {filteredMessages.length} messages
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
