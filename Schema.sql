CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  allowed_passengers INTEGER NOT NULL,
  isAvailable BOOLEAN DEFAULT true,
  driver_id UUID REFERENCES users(id) DEFAULT NULL, -- Nullable initially
  rate_per_km NUMERIC NOT NULL,
  owner_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

