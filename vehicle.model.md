Table Name: vehicles
​Columns: id (UUID), name (TEXT), registration_number (UNIQUE), allowed_passengers (INT), isAvailable (BOOL), driver_id (UUID), rate_per_km (NUMERIC), owner_id (UUID)
​Constraints: isAvailable defaults to true, registration_number is unique.
​Relationships: Owner \rightarrow Vehicles, Driver \rightarrow Vehicle.
