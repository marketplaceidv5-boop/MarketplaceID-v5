/* ==========================================
   MARKETPLACEID V4
   PostgreSQL Railway
   FINAL SCHEMA
========================================== */

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

/* ==========================================
   USERS
========================================== */

CREATE TABLE IF NOT EXISTS users (

    id BIGSERIAL PRIMARY KEY,

    username VARCHAR(50) UNIQUE NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password TEXT NOT NULL,

    fullname VARCHAR(100) DEFAULT '',

    bio TEXT DEFAULT '',

    avatar TEXT DEFAULT '/uploads/profiles/default-avatar.png',

    phone VARCHAR(25) DEFAULT '',

    city VARCHAR(100) DEFAULT '',

    latitude DOUBLE PRECISION DEFAULT 0,

    longitude DOUBLE PRECISION DEFAULT 0,

    role VARCHAR(20) DEFAULT 'user',

    verified BOOLEAN DEFAULT FALSE,

    blocked BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW(),

    last_active TIMESTAMP DEFAULT NOW()

);

/* ==========================================
   PRODUCTS
========================================== */

CREATE TABLE IF NOT EXISTS products (

    id BIGSERIAL PRIMARY KEY,

    seller_id BIGINT REFERENCES users(id) ON DELETE CASCADE,

    title TEXT NOT NULL,

    description TEXT DEFAULT '',

    category TEXT DEFAULT '',

    price BIGINT NOT NULL,

    old_price BIGINT DEFAULT 0,

    location TEXT DEFAULT '',

    latitude DOUBLE PRECISION DEFAULT 0,

    longitude DOUBLE PRECISION DEFAULT 0,

    images TEXT[] DEFAULT '{}',

    status VARCHAR(30) DEFAULT 'active',

    views INTEGER DEFAULT 0,

    favorites INTEGER DEFAULT 0,

    disable_reason TEXT,

    disabled_by BIGINT,

    disabled_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

);

/* ==========================================
   FAVORITES
========================================== */

CREATE TABLE IF NOT EXISTS favorites (

    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,

    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id,product_id)

);

/* ==========================================
   FOLLOWS
========================================== */

CREATE TABLE IF NOT EXISTS follows (

    id BIGSERIAL PRIMARY KEY,

    follower_id BIGINT REFERENCES users(id) ON DELETE CASCADE,

    seller_id BIGINT REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(follower_id,seller_id)

);

/* ==========================================
   CHATS
========================================== */

CREATE TABLE IF NOT EXISTS chats (

    id BIGSERIAL PRIMARY KEY,

    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,

    from_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,

    to_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,

    message TEXT DEFAULT '',

    image TEXT DEFAULT '',

    read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW()

);

/* ==========================================
   ORDERS
========================================== */

CREATE TABLE IF NOT EXISTS orders (

    id BIGSERIAL PRIMARY KEY,

    product_id BIGINT REFERENCES products(id),

    buyer_id BIGINT REFERENCES users(id),

    seller_id BIGINT REFERENCES users(id),

    meeting_point TEXT,

    meeting_date DATE,

    meeting_time TEXT,

    status VARCHAR(30) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT NOW()

);

/* ==========================================
   REVIEWS
========================================== */

CREATE TABLE IF NOT EXISTS reviews (

    id BIGSERIAL PRIMARY KEY,

    seller_id BIGINT REFERENCES users(id),

    buyer_id BIGINT REFERENCES users(id),

    rating INTEGER DEFAULT 5,

    comment TEXT DEFAULT '',

    created_at TIMESTAMP DEFAULT NOW()

);

/* ==========================================
   NOTIFICATIONS
========================================== */

CREATE TABLE IF NOT EXISTS notifications (

    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT REFERENCES users(id),

    from_user_id BIGINT,

    product_id BIGINT,

    type VARCHAR(50),

    title TEXT,

    message TEXT,

    read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW()

);

/* ==========================================
   REPORTS
========================================== */

CREATE TABLE IF NOT EXISTS reports (

    id BIGSERIAL PRIMARY KEY,

    reporter_id BIGINT REFERENCES users(id),

    product_id BIGINT REFERENCES products(id),

    reason TEXT,

    status VARCHAR(20) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT NOW()

);

/* ==========================================
   VERIFICATIONS
========================================== */

CREATE TABLE IF NOT EXISTS verifications (

    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT REFERENCES users(id),

    photo TEXT,

    ktp TEXT,

    selfie TEXT,

    status VARCHAR(20) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT NOW()

);

/* ==========================================
   OFFERS
========================================== */

CREATE TABLE IF NOT EXISTS offers (

    id BIGSERIAL PRIMARY KEY,

    product_id BIGINT REFERENCES products(id),

    buyer_id BIGINT REFERENCES users(id),

    seller_id BIGINT REFERENCES users(id),

    price BIGINT,

    status VARCHAR(20) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT NOW()

);

/* ==========================================
   APPEALS
========================================== */

CREATE TABLE IF NOT EXISTS appeals (

    id BIGSERIAL PRIMARY KEY,

    product_id BIGINT REFERENCES products(id),

    seller_id BIGINT REFERENCES users(id),

    reason TEXT,

    status VARCHAR(20) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT NOW()

);

/* ==========================================
   LOCATIONS
========================================== */

CREATE TABLE IF NOT EXISTS locations (

    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,

    latitude DOUBLE PRECISION,

    longitude DOUBLE PRECISION,

    address TEXT,

    updated_at TIMESTAMP DEFAULT NOW()

);
