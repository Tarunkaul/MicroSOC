CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) CHECK (role IN ('admin', 'analyst')) DEFAULT 'analyst',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attack_logs (
    log_id SERIAL PRIMARY KEY,
    source_ip VARCHAR(50),
    attack_type VARCHAR(50), 
    severity VARCHAR(20),   
    status VARCHAR(20) DEFAULT 'Open', 
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
