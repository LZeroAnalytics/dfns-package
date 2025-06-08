CREATE TABLE IF NOT EXISTS transfers (
    id VARCHAR(255) PRIMARY KEY,
    wallet_id VARCHAR(255) NOT NULL,
    network VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    kind VARCHAR(50) NOT NULL,
    to_address VARCHAR(255) NOT NULL,
    amount VARCHAR(255),
    contract_address VARCHAR(255),
    token_id VARCHAR(255),
    tx_hash VARCHAR(255),
    date_requested TIMESTAMP NOT NULL,
    date_broadcasted TIMESTAMP,
    date_confirmed TIMESTAMP,
    external_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(255) PRIMARY KEY,
    wallet_id VARCHAR(255) NOT NULL,
    network VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    kind VARCHAR(50) NOT NULL,
    tx_hash VARCHAR(255),
    fee VARCHAR(255),
    date_requested TIMESTAMP NOT NULL,
    date_broadcasted TIMESTAMP,
    date_confirmed TIMESTAMP,
    external_id VARCHAR(255),
    request_body JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transfers_wallet_id ON transfers(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
