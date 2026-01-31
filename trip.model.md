# Trip Model Documentation

### Table Name
- `trips`

### Columns & Data Types
- `id`: UUID (Primary Key)
- `customer_id`: UUID (Foreign Key)
- `vehicle_id`: UUID (Foreign Key)
- `start_date`: TIMESTAMP
- `end_date`: TIMESTAMP
- `location`: TEXT
- `distance_km`: NUMERIC
- `passengers`: INTEGER
- `tripCost`: NUMERIC (Default: 0)
- `isCompleted`: BOOLEAN (Default: false)
- `created_at`: TIMESTAMP

### Constraints
- `passengers`: Must not exceed the `allowed_passengers` of the selected vehicle.
- `vehicle_id`: The selected vehicle must have `isAvailable = true` at the time of creation.

### Relationships
- **Belongs To**: `customer_id` references `users.id`.
- **Belongs To**: `vehicle_id` references `vehicles.id`.

