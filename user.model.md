# User Model Documentation

### Table Name
- `users`

### Columns & Data Types
- `id`: UUID (Primary Key, Default: gen_random_uuid())
- `name`: TEXT (Not Null)
- `email`: TEXT (Unique, Not Null)
- `password`: TEXT (Raw password, Not Null)
- `role`: TEXT (Check: 'customer', 'owner', 'driver')
- `created_at`: TIMESTAMP (Default: now())

### Constraints
- `email`: Must be unique across the table.
- `role`: Must be one of: `customer`, `owner`, or `driver`.
- Each user can have only **one role**.

### Relationships
- **One-to-Many**: A user (owner) can have multiple vehicles.
- **One-to-Many**: A user (customer) can create multiple trips.

