import { pgPool } from './connection';

export async function initializeDatabase() {
  try {
    // Create schemas
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        avatar_url VARCHAR(255),
        is_verified BOOLEAN DEFAULT false,
        preferences JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pois (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        country VARCHAR(100),
        city VARCHAR(100),
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        address VARCHAR(255),
        opening_hours JSONB,
        entrance_fee DECIMAL(10, 2),
        rating DECIMAL(3, 2),
        reviews_count INTEGER,
        images JSONB,
        historical_context JSONB,
        accessibility JSONB,
        nearby_pois UUID[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS trips (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        budget DECIMAL(10, 2),
        pois UUID[] DEFAULT '{}',
        itinerary JSONB,
        status VARCHAR(50) DEFAULT 'planning',
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cuisine_type VARCHAR(100),
        city VARCHAR(100),
        country VARCHAR(100),
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        price_range VARCHAR(10),
        rating DECIMAL(3, 2),
        michelin_stars INTEGER,
        images JSONB,
        menu_url VARCHAR(255),
        phone VARCHAR(20),
        website VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS hotels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        city VARCHAR(100),
        country VARCHAR(100),
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        price_per_night DECIMAL(10, 2),
        rating DECIMAL(3, 2),
        star_rating INTEGER,
        amenities JSONB,
        images JSONB,
        phone VARCHAR(20),
        website VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS recommendations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        poi_id UUID NOT NULL REFERENCES pois(id) ON DELETE CASCADE,
        reason TEXT,
        confidence DECIMAL(3, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_pois_location ON pois USING GIST(
        point(latitude, longitude)
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
      CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants USING GIST(
        point(latitude, longitude)
      );
      CREATE INDEX IF NOT EXISTS idx_hotels_location ON hotels USING GIST(
        point(latitude, longitude)
      );
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export async function closeDatabase() {
  await pgPool.end();
  console.log('Database connection closed');
}
