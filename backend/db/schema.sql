-- =======================================================================
-- CAR LISTINGS DATABASE SCHEMA (PostgreSQL)
-- Filename: backend/db/schema.sql
-- =======================================================================

-- Active Listings Table Structuring
CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    seller_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL CHECK (year >= 1886 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    price DECIMAL(12, 2) NOT NULL CHECK (price > 0),
    mileage INT NOT NULL CHECK (mileage >= 0),
    color VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Hybrid', 'Electric', 'Gas', 'Other')),
    transmission VARCHAR(50) NOT NULL CHECK (transmission IN ('Automatic', 'Manual', 'CVT', 'Semi-Automatic')),
    description TEXT,
    photos TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for rapid queries
CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_make ON listings(make);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);

-- Automated Timestamp Update Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CLOCK_TIMESTAMP();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_listings_modtime ON listings;

CREATE TRIGGER trg_update_listings_modtime
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =======================================================================
-- CAR INSPECTIONS TABLE
-- =======================================================================
CREATE TABLE IF NOT EXISTS inspections (
    id SERIAL PRIMARY KEY,
    listing_id INT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id VARCHAR(255) NOT NULL,
    inspector_id VARCHAR(255),
    status VARCHAR(55) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'approved', 'rejected')),
    report_notes TEXT,
    photos TEXT[] DEFAULT '{}',
    condition_score INT CHECK (condition_score >= 1 AND condition_score <= 10),
    defects TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for inspections query optimization
CREATE INDEX IF NOT EXISTS idx_inspections_listing ON inspections(listing_id);
CREATE INDEX IF NOT EXISTS idx_inspections_buyer ON inspections(buyer_id);
CREATE INDEX IF NOT EXISTS idx_inspections_inspector ON inspections(inspector_id);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(status);

DROP TRIGGER IF EXISTS trg_update_inspections_modtime ON inspections;

CREATE TRIGGER trg_update_inspections_modtime
    BEFORE UPDATE ON inspections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

