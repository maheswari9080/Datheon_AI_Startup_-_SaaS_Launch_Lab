-- ============================================================================
-- DealForge AI — Enterprise Relational Schema (PostgreSQL / Supabase Compatible)
-- ============================================================================

-- Extensions for UUID & Cryptography
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    agency_name VARCHAR(255),
    tier VARCHAR(32) NOT NULL DEFAULT 'free', -- 'free' | 'pro' | 'lifetime'
    stripe_customer_id VARCHAR(128),
    proposals_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Proposals Table
CREATE TABLE IF NOT EXISTS proposals (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    project_value NUMERIC(12, 2) NOT NULL,
    deposit_percentage INTEGER DEFAULT 30,
    deposit_amount NUMERIC(12, 2) NOT NULL,
    timeline_weeks INTEGER NOT NULL,
    scope_notes TEXT NOT NULL,
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
    risk_score INTEGER NOT NULL,
    risk_level VARCHAR(32) NOT NULL,
    risk_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
    contingency_buffer_pct INTEGER NOT NULL DEFAULT 15,
    protective_clauses JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(32) NOT NULL DEFAULT 'draft',
    client_access_token VARCHAR(128) UNIQUE NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE,
    signer_name VARCHAR(255),
    paid_at TIMESTAMP WITH TIME ZONE,
    stripe_session_id VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    proposal_id VARCHAR(64) REFERENCES proposals(id),
    type VARCHAR(64) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(16) NOT NULL DEFAULT 'usd',
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    stripe_session_id VARCHAR(128) UNIQUE NOT NULL,
    stripe_payment_intent_id VARCHAR(128),
    customer_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Processed Webhooks Table (Idempotency Audit)
CREATE TABLE IF NOT EXISTS webhook_events (
    event_id VARCHAR(128) PRIMARY KEY,
    event_type VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id VARCHAR(64) PRIMARY KEY,
    event_name VARCHAR(128) NOT NULL,
    utm_source VARCHAR(128),
    utm_medium VARCHAR(128),
    utm_campaign VARCHAR(128),
    variant VARCHAR(64),
    metadata JSONB DEFAULT '{}'::jsonb,
    ip VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row-Level Security Policies (Supabase Reference)
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_proposals_isolation ON proposals
    FOR ALL
    USING (auth.uid() = user_id);
