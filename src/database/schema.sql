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
    date_policy_resolved TIMESTAMP,
    approval_id VARCHAR(255),
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
    date_policy_resolved TIMESTAMP,
    approval_id VARCHAR(255),
    external_id VARCHAR(255),
    request_body JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS policies (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    activity_kind VARCHAR(100) NOT NULL,
    rule JSONB NOT NULL,
    action JSONB NOT NULL,
    filters JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS policy_approvals (
    id VARCHAR(255) PRIMARY KEY,
    policy_id VARCHAR(255) NOT NULL,
    activity_kind VARCHAR(100) NOT NULL,
    activity_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    trigger_status VARCHAR(50) NOT NULL DEFAULT 'Triggered',
    initiator_user_id VARCHAR(255) NOT NULL,
    initiator_app_id VARCHAR(255) NOT NULL,
    activity_body JSONB NOT NULL,
    approval_groups JSONB NOT NULL,
    request_context JSONB,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_resolved TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS policy_approval_decisions (
    id VARCHAR(255) PRIMARY KEY,
    approval_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    value VARCHAR(50) NOT NULL,
    reason TEXT,
    date_decided TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transfers_wallet_id ON transfers(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status);
CREATE INDEX IF NOT EXISTS idx_transfers_approval_id ON transfers(approval_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_approval_id ON transactions(approval_id);
CREATE INDEX IF NOT EXISTS idx_policies_activity_kind ON policies(activity_kind);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policy_approvals_policy_id ON policy_approvals(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_approvals_status ON policy_approvals(status);
CREATE INDEX IF NOT EXISTS idx_policy_approvals_activity_id ON policy_approvals(activity_id);
CREATE INDEX IF NOT EXISTS idx_policy_approval_decisions_approval_id ON policy_approval_decisions(approval_id);
CREATE INDEX IF NOT EXISTS idx_policy_approval_decisions_user_id ON policy_approval_decisions(user_id);

CREATE TABLE IF NOT EXISTS fee_sponsors (
    id VARCHAR(255) PRIMARY KEY,
    wallet_id VARCHAR(255) NOT NULL,
    network VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    template_address VARCHAR(255) NOT NULL DEFAULT '0xbd77a32e628e69d8b168d3813f019e51d787b569',
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_activated TIMESTAMP,
    date_deactivated TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fee_sponsors_wallet_id ON fee_sponsors(wallet_id);
CREATE INDEX IF NOT EXISTS idx_fee_sponsors_status ON fee_sponsors(status);
CREATE INDEX IF NOT EXISTS idx_fee_sponsors_network ON fee_sponsors(network);
