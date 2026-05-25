import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [logs, setLogs] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Mock data for charts
    // Real-time graph data state
    const [graphData, setGraphData] = useState([]);
    const [graphMaxY, setGraphMaxY] = useState(10); // Default max Y for scaling
    const [hoveredData, setHoveredData] = useState(null); // Tooltip state
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    // Process logs into graph data (Cumulative Active Threats)
    const processGraphData = (currentLogs) => {
        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60000);
        const buckets = [];

        // Initialize 30 buckets (1 minute each)
        for (let i = 0; i < 30; i++) {
            const time = new Date(thirtyMinutesAgo.getTime() + i * 60000);

            // Calculate Active Threats at this specific time point
            // A threat is active if:
            // 1. It was created BEFORE this time point (log.timestamp <= time)
            // 2. It is NOT resolved OR it was resolved AFTER this time point (omitted as we only have active logs passed here)
            // Note: fetchLogs filters out 'Resolved' status, so we assume all 'currentLogs' are currently active.
            // However, to be historically accurate for the graph:
            // We should count logs where log.timestamp <= bucket_time

            let highCount = 0;
            let lowCount = 0;

            currentLogs.forEach(log => {
                const logTime = new Date(log.timestamp);
                if (logTime <= time) {
                    if (log.severity === 'Critical' || log.severity === 'High') {
                        highCount++;
                    } else {
                        lowCount++;
                    }
                }
            });

            buckets.push({
                time: time,
                label: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                high: highCount, // Accumulative
                low: lowCount,   // Accumulative
                total: highCount + lowCount
            });
        }

        // Calculate Max Y for dynamic scaling
        let maxVal = 5; // Minimum scale
        buckets.forEach(b => {
            maxVal = Math.max(maxVal, b.high, b.low);
        });
        setGraphMaxY(maxVal + 2); // Add buffer

        setGraphData(buckets);
    };

    // Calculate severity distribution from real logs
    const getSeverityData = () => {
        const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        logs.forEach(log => {
            if (counts.hasOwnProperty(log.severity)) {
                counts[log.severity]++;
            }
        });
        const total = logs.length || 1;
        return {
            critical: counts.Critical / total,
            high: counts.High / total,
            medium: counts.Medium / total,
            low: counts.Low / total
        };
    };

    const severityData = getSeverityData();

    // Fetch logs from database with smart comparison (anti-flicker)
    const fetchLogs = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/logs');
            const data = await res.json();
            // Filter out resolved logs - only show Open and In Progress
            const activeLogs = data.filter(log => log.status !== 'Resolved');

            // Always update graph data with latest active logs
            // We do this every fetch to keep the time window moving even if logs don't change
            processGraphData(activeLogs);

            // Smart comparison: Only update if data actually changed
            setLogs(prevLogs => {
                // Compare by stringifying - only update if different
                if (JSON.stringify(prevLogs) !== JSON.stringify(activeLogs)) {
                    return activeLogs;
                }
                return prevLogs; // No change, keep existing state
            });
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        }
    };

    useEffect(() => {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
            window.location.href = '/';
            return;
        }

        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);

        // Initial fetch
        fetchLogs();

        // Auto-refresh every 2 seconds
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

    // Nuclear Option: Purge All Logs (Admin Only)
    const handlePurge = async () => {
        // Confirmation dialog
        const confirmed = window.confirm(
            '⚠️ WARNING: This will PERMANENTLY DELETE all attack logs and reset the database.\n\nThis action CANNOT be undone.\n\nAre you absolutely sure?'
        );

        if (!confirmed) return;

        try {
            const response = await fetch('http://localhost:5000/api/admin/purge', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify({ role: user.role })
            });

            if (response.ok) {
                alert('✅ System purged successfully. All logs have been deleted.');
                // Refresh logs immediately
                fetchLogs();
            } else if (response.status === 403) {
                alert('🚫 Access Denied: Only administrators can purge the system.');
            } else {
                alert('❌ Failed to purge system. Please try again.');
            }
        } catch (error) {
            console.error('Purge error:', error);
            alert('❌ Network error. Could not connect to server.');
        }
    };

    // Format timestamp
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
                    {/* Theme Toggle Button */}
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? (
                            <svg className="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg className="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                    <button
                        className="nav-link-btn"
                        onClick={() => navigate('/ingest')}
                    >
                        📊 View All Logs
                    </button>

                    <div className="user-menu-container">
                        <button
                            className="user-profile-btn"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
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
                <div className="dashboard-grid">
                    {/* Attack Trends Chart */}
                    <div className="dashboard-card attack-trends-card" style={{ position: 'relative' }}>
                        {hoveredData && (
                            <div
                                className="graph-tooltip"
                                style={{
                                    left: tooltipPos.x,
                                    top: tooltipPos.y
                                }}
                            >
                                <span className="tooltip-time">{hoveredData.label}</span>
                                <div className="tooltip-row">
                                    <span style={{ color: '#f97316' }}>Critical & High:</span>
                                    <span className="tooltip-value">{hoveredData.high}</span>
                                </div>
                                <div className="tooltip-row">
                                    <span style={{ color: '#60a5fa' }}>Medium & Low:</span>
                                    <span className="tooltip-value">{hoveredData.low}</span>
                                </div>
                                <div className="tooltip-row" style={{ marginTop: '8px', paddingTop: '4px', borderTop: '1px solid #f3f4f6' }}>
                                    <span>Total Active:</span>
                                    <span className="tooltip-value">{hoveredData.total}</span>
                                </div>
                            </div>
                        )}
                        <h3 className="card-title">Threat Activity (Last 30 Minutes)</h3>

                        {/* Legend for the Line Chart */}
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', marginTop: '-10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '10px', height: '10px', backgroundColor: '#f97316', borderRadius: '2px' }}></span>
                                <span style={{ fontSize: '11px', color: '#4b5563', fontWeight: '500' }}>Critical & High</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '10px', height: '10px', backgroundColor: '#60a5fa', borderRadius: '2px' }}></span>
                                <span style={{ fontSize: '11px', color: '#4b5563', fontWeight: '500' }}>Medium & Low</span>
                            </div>
                        </div>
                        <div className="chart-container">
                            <svg className="line-chart" viewBox="0 0 500 200" preserveAspectRatio="none">
                                {/* Grid lines */}
                                <line x1="0" y1="50" x2="500" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                                <line x1="0" y1="100" x2="500" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                                <line x1="0" y1="150" x2="500" y2="150" stroke="#e5e7eb" strokeWidth="1" />

                                {/* Y-axis labels - Dynamic */}
                                <text x="5" y="15" fontSize="10" fill="#6b7280">{Math.round(graphMaxY)}</text>
                                <text x="5" y="65" fontSize="10" fill="#6b7280">{Math.round(graphMaxY * 0.75)}</text>
                                <text x="5" y="115" fontSize="10" fill="#6b7280">{Math.round(graphMaxY * 0.5)}</text>
                                <text x="5" y="165" fontSize="10" fill="#6b7280">{Math.round(graphMaxY * 0.25)}</text>
                                <text x="5" y="200" fontSize="10" fill="#6b7280">0</text>

                                {/* Line 1 (Low/Medium - Blue) */}
                                <polyline
                                    points={graphData.map((d, i) => {
                                        const x = (i / 29) * 500;
                                        const y = 200 - (d.low / graphMaxY) * 200;
                                        return `${x},${y}`;
                                    }).join(' ')}
                                    fill="none"
                                    stroke="#60a5fa"
                                    strokeWidth="2"
                                />

                                {/* Line 2 (Critical/High - Orange) */}
                                <polyline
                                    points={graphData.map((d, i) => {
                                        const x = (i / 29) * 500;
                                        const y = 200 - (d.high / graphMaxY) * 200;
                                        return `${x},${y}`;
                                    }).join(' ')}
                                    fill="none"
                                    stroke="#f97316"
                                    strokeWidth="2"
                                />

                                {/* Interactive Overlay Rects for Tooltip */}
                                {graphData.map((d, i) => (
                                    <rect
                                        key={i}
                                        x={(i / 29) * 500 - (500 / 29 / 2)}
                                        y="0"
                                        width={500 / 29}
                                        height="200"
                                        className="chart-overlay-rect"
                                        onMouseEnter={(e) => {
                                            setTooltipPos({
                                                x: `${(i / 29) * 100}%`,
                                                y: '50%' // Center vertically or adjust as needed
                                            });
                                            setHoveredData(d);
                                        }}
                                        onMouseLeave={() => setHoveredData(null)}
                                    />
                                ))}
                            </svg>

                            {/* X-axis labels */}
                            <div className="chart-x-axis" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {graphData.filter((_, i) => i % 5 === 0).map((d, i) => (
                                    <span key={i} className="x-label" style={{ fontSize: '10px', color: '#9ca3af' }}>{d.label}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Severity Distribution Donut Chart */}
                    <div className="dashboard-card severity-card">
                        <h3 className="card-title">Threat Severity Distribution</h3>
                        <div className="donut-chart-container">
                            <svg className="donut-chart" viewBox="0 0 200 200">
                                {/* Donut segments */}
                                {(() => {
                                    const circumference = 2 * Math.PI * 70; // ~439.82
                                    const cOffset = 0;
                                    const hOffset = -(severityData.critical * circumference);
                                    const mOffset = -((severityData.critical + severityData.high) * circumference);
                                    const lOffset = -((severityData.critical + severityData.high + severityData.medium) * circumference);

                                    return (
                                        <>
                                            {/* Background circle to prevent tiny anti-aliasing gaps */}
                                            <circle cx="100" cy="100" r="70" fill="none" stroke="#f3f4f6" strokeWidth="40" />

                                            {severityData.critical > 0 && (
                                                <circle cx="100" cy="100" r="70" fill="none" stroke="#ef4444" strokeWidth="40"
                                                    strokeDasharray={`${severityData.critical * circumference} ${circumference}`}
                                                    strokeDashoffset={cOffset}
                                                    transform="rotate(-90 100 100)" />
                                            )}
                                            {severityData.high > 0 && (
                                                <circle cx="100" cy="100" r="70" fill="none" stroke="#f97316" strokeWidth="40"
                                                    strokeDasharray={`${severityData.high * circumference} ${circumference}`}
                                                    strokeDashoffset={hOffset}
                                                    transform="rotate(-90 100 100)" />
                                            )}
                                            {severityData.medium > 0 && (
                                                <circle cx="100" cy="100" r="70" fill="none" stroke="#fbbf24" strokeWidth="40"
                                                    strokeDasharray={`${severityData.medium * circumference} ${circumference}`}
                                                    strokeDashoffset={mOffset}
                                                    transform="rotate(-90 100 100)" />
                                            )}
                                            {severityData.low > 0 && (
                                                <circle cx="100" cy="100" r="70" fill="none" stroke="#9ca3af" strokeWidth="40"
                                                    strokeDasharray={`${severityData.low * circumference} ${circumference}`}
                                                    strokeDashoffset={lOffset}
                                                    transform="rotate(-90 100 100)" />
                                            )}
                                        </>
                                    );
                                })()}

                                {/* Center white circle */}
                                <circle cx="100" cy="100" r="50" fill="white" />
                            </svg>

                            <div className="severity-legend">
                                <div className="legend-item">
                                    <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
                                    <span className="legend-label">Critical</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color" style={{ backgroundColor: '#f97316' }}></span>
                                    <span className="legend-label">High</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color" style={{ backgroundColor: '#fbbf24' }}></span>
                                    <span className="legend-label">Medium</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color" style={{ backgroundColor: '#9ca3af' }}></span>
                                    <span className="legend-label">Low</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Security Event Feed */}
                <div className="dashboard-card events-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h3 className="card-title" style={{ margin: 0 }}>Recent Incidents (Top 5)</h3>
                            <span className="live-badge">
                                <span className="live-dot"></span>
                                LIVE
                            </span>
                        </div>

                        {/* Nuclear Option: Admin-Only Purge Button */}
                        {user?.role === 'admin' && (
                            <button
                                onClick={handlePurge}
                                style={{
                                    padding: '10px 20px',
                                    background: '#dc2626',
                                    color: 'white',
                                    border: '2px solid #dc2626',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#b91c1c';
                                    e.target.style.borderColor = '#b91c1c';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = '#dc2626';
                                    e.target.style.borderColor = '#dc2626';
                                }}
                            >
                                ⚠️ PURGE ALL LOGS
                            </button>
                        )}
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
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                            No logs yet. Start the Kaiju script to generate attack logs.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.slice(0, 5).map((log, index) => (
                                        <tr key={log.log_id} className="fade-in">
                                            <td>#{index + 1}</td>
                                            <td>{formatTimestamp(log.timestamp)}</td>
                                            <td>{log.source_ip}</td>
                                            <td>{log.attack_type}</td>
                                            <td>
                                                <span className={getSeverityClass(log.severity)}>
                                                    {log.severity}
                                                </span>
                                            </td>
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

export default Dashboard;