import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import './Dashboard.css';

const Ingest = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [logs, setLogs] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const fetchLogs = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/logs');
            const data = await res.json();
            const activeLogs = data.filter(log => log.status !== 'Resolved');

            setLogs(prevLogs => {
                if (JSON.stringify(prevLogs) !== JSON.stringify(activeLogs)) {
                    return activeLogs;
                }
                return prevLogs;
            });
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        }
    };

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            window.location.href = '/';
            return;
        }

        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);

        fetchLogs();
        const interval = setInterval(fetchLogs, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const getSeverityClass = (severity) => {
        return `severity-badge severity-${severity.toLowerCase()}`;
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    // BAN IP Logic
    const handleBan = async (ip) => {
        if (!window.confirm(`Are you sure you want to BAN IP: ${ip}? This will block all future logs from this source.`)) return;

        try {
            const res = await fetch('http://localhost:5000/api/admin/ban', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify({ ip_address: ip })
            });

            const data = await res.json();

            if (res.ok) {
                alert(`✅ ${data.message}`);
            } else {
                alert(`❌ Failed to ban: ${data.message}`);
            }
        } catch (err) {
            console.error("Ban request failed:", err);
            alert("❌ Network error while banning IP");
        }
    };


    const updateLogStatus = async (logId, newStatus) => {
        try {
            const token = authService.getToken();
            const res = await fetch(`http://localhost:5000/api/logs/${logId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();

            if (data.success) {
                setLogs(logs.map(log =>
                    log.log_id === logId ? { ...log, status: newStatus } : log
                ));
            } else {
                console.error('Failed to update status:', data.message);
                alert('Failed to update status: ' + data.message);
            }
        } catch (err) {
            console.error("Failed to update status:", err);
            alert('Failed to update status. Please try again.');
        }
    };

    const getStatusClass = (status) => {
        const statusMap = {
            'Open': 'status-open',
            'In Progress': 'status-progress',
            'Resolved': 'status-resolved'
        };
        return statusMap[status] || 'status-open';
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-brand">
                    <div className="brand-logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <span className="brand-name">MicroSOC</span>

                    {/* Role Badge - Visual Indicator */}
                    {user?.role === 'admin' ? (
                        <div className="role-badge role-badge-admin">
                            <span className="role-text">COMMANDER ACCESS</span>
                        </div>
                    ) : (
                        <div className="role-badge role-badge-analyst">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="role-icon">
                                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                                <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span className="role-text">ANALYST</span>
                        </div>
                    )}
                </div>

                <div className="header-actions">
                    {/* Theme Toggle Button */}
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        <div className="theme-toggle-slider">
                            {theme === 'light' ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                                    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </div>
                    </button>

                    <button className="nav-link-btn" onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>

                    <div className="user-menu-container">
                        <button className="user-profile-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                                <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span className="user-name">{user?.name || 'User'}</span>
                        </button>

                        {showUserMenu && (
                            <div className="user-dropdown">
                                <div className="user-info">
                                    <div className="user-info-name">{user?.name}</div>
                                    <div className="user-info-email">{user?.email}</div>
                                    <div className="user-info-role">{user?.role === 'admin' ? 'Grid Admin' : 'Security Analyst'}</div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button className="logout-btn" onClick={handleLogout}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" />
                                        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" />
                                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="dashboard-card events-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <h3 className="card-title" style={{ margin: 0 }}>All Attack Logs ({logs.length} total)</h3>
                        <span className="live-badge">
                            <span className="live-dot"></span>
                            LIVE
                        </span>
                    </div>
                    <div className="events-table-container">
                        <table className="events-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Timestamp</th>
                                    <th>Source IP</th>
                                    <th>Attack Type</th>
                                    <th>Severity</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                    {user?.role === 'admin' && <th>Countermeasures</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                            No logs yet. Start the Kaiju script to generate attack logs.
                                        </td>
                                    </tr>
                                ) : (
                                    [...logs]
                                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                        .map((log, index) => (
                                            <tr key={log.log_id}>
                                                <td>#{logs.length - index}</td>
                                                <td>{formatTimestamp(log.timestamp)}</td>
                                                <td>{log.source_ip}</td>
                                                <td>{log.attack_type}</td>
                                                <td>
                                                    <span className={getSeverityClass(log.severity)}>
                                                        {log.severity}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${getStatusClass(log.status)}`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        className="status-select"
                                                        value={log.status}
                                                        onChange={(e) => updateLogStatus(log.log_id, e.target.value)}
                                                    >
                                                        <option value="Open">Open</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Resolved">Resolved</option>
                                                    </select>
                                                </td>
                                                {user?.role === 'admin' && (
                                                    <td>
                                                        <button
                                                            onClick={() => handleBan(log.source_ip)}
                                                            className="ban-btn"
                                                            style={{
                                                                background: '#fee2e2',
                                                                color: '#dc2626',
                                                                border: '1px solid #dc2626',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            BAN IP
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Ingest;
