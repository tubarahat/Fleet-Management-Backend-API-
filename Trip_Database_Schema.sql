CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES users(id) NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  distance_km NUMERIC NOT NULL,
  passengers INTEGER NOT NULL,
  tripCost NUMERIC NOT NULL,
  isCompleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

