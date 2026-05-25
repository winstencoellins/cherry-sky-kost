# Cherry Sky Kost — Backend API

REST API for the Cherry Sky Kost property management system, built with [Elysia](https://elysiajs.com/) on the Bun runtime.

## Development

```bash
bun run dev              # start with hot-reload on port 8000
bunx prisma generate     # regenerate client after schema changes
bunx prisma db push      # apply schema to the database
```

Base URL (local): `http://localhost:8000`

All successful API responses use `{ "data": ... }` unless noted otherwise.

---

## Authentication

Authentication is powered by [Better Auth](https://www.better-auth.com/) and is mounted at `/auth`.

All routes marked **Auth required** need a valid session cookie. The cookie is set automatically by the browser after a successful sign-in. For non-browser clients, pass the `cookie` header manually.

### Sign Up

```
POST /auth/sign-up/email
```

**Request body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "supersecret"
}
```

**Response `200`**

```json
{
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant",
    "emailVerified": false,
    "createdAt": "2026-05-01T00:00:00.000Z",
    "updatedAt": "2026-05-01T00:00:00.000Z"
  },
  "session": { ... }
}
```

---

### Sign In

```
POST /auth/sign-in/email
```

**Request body**

```json
{
  "email": "john@example.com",
  "password": "supersecret"
}
```

**Response `200`** — same shape as sign-up. Sets a `better-auth.session_token` cookie.

---

### Sign Out

```
POST /auth/sign-out
```

No body required. Clears the session cookie.

---

### Get Current Session

```
GET /auth/get-session
```

Returns the currently authenticated user and session. Returns `null` when not authenticated.

---

## Error Format

All errors return a consistent JSON body:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Property not found"
  }
}
```

| Code | HTTP Status | Meaning |
|---|---|---|
| `BAD_REQUEST` | 400 | Malformed request |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Duplicate or constraint violation |
| `UNPROCESSABLE` | 422 | Validation failed |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

---

## Admin Routes

> All routes below require a valid session (`Auth required`).
> All admin routes are prefixed with `/admin`.

| Resource | Prefix |
|---|---|
| Properties | `/admin/properties` |
| Unit types | `/admin/unit-types` |
| Unit pricings | `/admin/unit-pricings` |
| Units | `/admin/units` |
| Leases | `/admin/leases` |
| Tenants (users) | `/admin/users` |
| Ledger entries | `/admin/ledger-entries` |

---

### Properties

Manage physical kost buildings.

#### `GET /admin/properties`

Returns a list of all properties.

**Auth required:** yes

**Response `200`**

```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Cherry Sky Kost A",
      "address": "Jl. Sudirman No. 12",
      "city": "Jakarta",
      "createdById": "usr...",
      "updatedById": "usr...",
      "createdAt": "2026-05-01T00:00:00.000Z",
      "updatedAt": "2026-05-01T00:00:00.000Z"
    }
  ]
}
```

---

#### `GET /admin/properties/:id`

Returns a single property by ID.

**Auth required:** yes

**Path params**

| Param | Type | Description |
|---|---|---|
| `id` | string | Property ID |

**Response `200`**

```json
{
  "data": {
    "id": "clx...",
    "name": "Cherry Sky Kost A",
    "address": "Jl. Sudirman No. 12",
    "city": "Jakarta",
    "createdById": "usr...",
    "updatedById": "usr...",
    "createdAt": "2026-05-01T00:00:00.000Z",
    "updatedAt": "2026-05-01T00:00:00.000Z"
  }
}
```

**Error `404`** — property not found.

---

#### `POST /admin/properties`

Creates a new property.

**Auth required:** yes

**Request body**

```json
{
  "name": "Cherry Sky Kost A",
  "address": "Jl. Sudirman No. 12",
  "city": "Jakarta"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | yes | min 1 char |
| `address` | string | yes | min 1 char |
| `city` | string | yes | min 1 char |

**Response `200`** — returns the created property object.

**Error `422`** — validation failed.

---

#### `PUT /admin/properties/:id`

Updates a property. All fields are optional — send only what you want to change.

**Auth required:** yes

**Request body**

```json
{
  "name": "Cherry Sky Kost B",
  "city": "Bandung"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | no | min 1 char |
| `address` | string | no | min 1 char |
| `city` | string | no | min 1 char |

**Response `200`** — returns the updated property object.

**Error `404`** — property not found.

---

#### `DELETE /admin/properties/:id`

Deletes a property and all its associated units (cascade).

**Auth required:** yes

**Response `200`** — returns the deleted property object.

**Error `404`** — property not found.

---

### Unit Types

Categories of units within a property (e.g. Studio, 1 Bedroom). Pricing packages are defined per unit type.

#### `GET /admin/unit-types`

**Query params**

| Param | Type | Required | Description |
|---|---|---|---|
| `propertyId` | string | no | Filter by property |

**Response `200`** — list with `property` and `_count` (`units`, `pricings`).

---

#### `GET /admin/unit-types/:id`

**Response `200`** — unit type with `property`, `pricings`, and unit count.

**Error `404`** — not found.

---

#### `POST /admin/unit-types`

```json
{
  "name": "Studio",
  "propertyId": "clx...",
  "description": "Compact single room",
  "totalFloor": 2,
  "size": 18
}
```

| Field | Type | Required |
|---|---|---|
| `name` | string | yes |
| `propertyId` | string | yes |
| `description` | string | no |
| `totalFloor` | integer | no |
| `size` | integer (m²) | no |

**Errors:** `404` property not found · `409` duplicate name in property · `422` validation failed

---

#### `PUT /admin/unit-types/:id`

All fields optional. Same fields as create (except `propertyId` cannot be changed via this endpoint).

**Errors:** `404` · `409` · `422`

---

#### `DELETE /admin/unit-types/:id`

**Error `409`** — type still has units assigned.

---

### Unit Pricings

Price packages per unit type and rental duration (e.g. 30 days at Rp 1.500.000).

#### `GET /admin/unit-pricings`

**Query params**

| Param | Type | Required | Description |
|---|---|---|---|
| `unitTypeId` | string | no | Filter by unit type |
| `propertyId` | string | no | Filter by property |

**Response `200`** — ordered by `durationDays`, includes `unitType` and `property`.

---

#### `GET /admin/unit-pricings/:id`

Includes linked `leases` (id and status only).

---

#### `POST /admin/unit-pricings`

```json
{
  "unitTypeId": "clx...",
  "durationDays": 30,
  "price": 1500000
}
```

`propertyId` is set automatically from the unit type.

**Errors:** `404` unit type not found · `409` duplicate duration for same type · `422` validation failed

---

#### `PUT /admin/unit-pricings/:id`

Optional: `durationDays`, `price`.

**Errors:** `404` · `409` · `422`

---

#### `DELETE /admin/unit-pricings/:id`

**Error `409`** — one or more leases reference this pricing.

---

### Units

Physical rentable rooms. Each unit belongs to a **unit type**; `propertyId` is derived from that type.

#### `GET /admin/units`

**Query params:** `propertyId` (optional)

Each item includes `property`, `unitType`, and `activeLease` (lease overlapping today, or `null`).

---

#### `GET /admin/units/vacant`

Units with **no** lease overlapping the requested date range.

**Query params**

| Param | Type | Required |
|---|---|---|
| `startDate` | string (ISO date) | yes |
| `endDate` | string (ISO date) | yes |
| `propertyId` | string | no |

`startDate` must be before `endDate`.

---

#### `GET /admin/units/:id`

Full unit with `property`, `unitType`, and lease history.

---

#### `POST /admin/units`

```json
{
  "name": "Room 101",
  "unitTypeId": "clx...",
  "floor": 2
}
```

New units default to `status: "vacant"`.

**Errors:** `404` unit type not found · `409` duplicate name in property · `422` validation failed

---

#### `PUT /admin/units/:id`

Optional: `name`, `floor`, `status` (`vacant` \| `occupied`).

**Errors:** `404` · `409` duplicate name · `422`

---

#### `DELETE /admin/units/:id`

**Error `409`** — unit status is `occupied`.

---

### Users (Tenants)

Read-only access to users with `role: tenant` (for lease assignment).

#### `GET /admin/users`

**Query params**

| Param | Type | Required | Description |
|---|---|---|---|
| `search` | string | no | Case-insensitive match on name or email |

**Response `200`**

```json
{
  "data": [
    {
      "id": "usr...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "tenant",
      "emailVerified": false,
      "image": null,
      "createdAt": "2026-05-01T00:00:00.000Z",
      "updatedAt": "2026-05-01T00:00:00.000Z"
    }
  ]
}
```

---

#### `GET /admin/users/:id`

**Response `200`** — same shape as a single list item.

**Error `404`** — user not found or not a tenant.

---

### Leases

Rental agreements. `endDate` is **always computed** as `startDate + unitPricing.durationDays`.

- Creating a lease does **not** auto-occupy the unit.
- Setting `status` to `paid` sets the unit to `occupied`.
- Deleting a lease sets the unit to `vacant`.

#### `GET /admin/leases`

**Query params:** `unitId`, `userId`, `propertyId` (all optional)

**Response `200`** — includes `unit` (with `property`, `unitType`), `user`, `unitPricing`, `createdBy`, `updatedBy`.

---

#### `GET /admin/leases/:id`

**Error `404`** — lease not found.

---

#### `POST /admin/leases`

```json
{
  "unitId": "clx...",
  "userId": "usr...",
  "startDate": "2026-05-01",
  "unitPricingId": "clx..."
}
```

| Field | Type | Required |
|---|---|---|
| `unitId` | string | yes |
| `userId` | string | yes |
| `startDate` | string (ISO date) | yes |
| `unitPricingId` | string | yes |

`unitPricing` must belong to the unit's `unitTypeId`.

**Errors:** `404` unit or pricing not found · `409` date overlap on same unit · `422` validation failed

---

#### `PUT /admin/leases/:id`

```json
{
  "status": "paid"
}
```

| Field | Type | Required |
|---|---|---|
| `startDate` | string (ISO date) | no |
| `unitPricingId` | string | no |
| `status` | `unpaid` \| `waiting_for_review` \| `paid` | no |

`endDate` is recalculated when `startDate` or `unitPricingId` changes (cannot be sent in the body).

**Errors:** `404` · `409` overlap · `422`

---

#### `DELETE /admin/leases/:id`

Resets the unit to `vacant`.

---

### Ledger Entries

Manual **income** and **expense** records for bookkeeping (separate from leases).

#### `GET /admin/ledger-entries`

**Query params**

| Param | Type | Required | Description |
|---|---|---|---|
| `propertyId` | string | no | Filter by property |
| `type` | string | no | `income` or `expense` |

**Response `200`** — ordered by `date` descending; includes `property` (if set) and `createdBy`.

---

#### `GET /admin/ledger-entries/:id`

**Error `404`** — not found.

---

#### `POST /admin/ledger-entries`

```json
{
  "type": "income",
  "amount": 1500000,
  "description": "Monthly rent - Room 101",
  "date": "2026-05-01",
  "propertyId": "clx..."
}
```

| Field | Type | Required |
|---|---|---|
| `type` | `income` \| `expense` | yes |
| `amount` | integer | yes — smallest currency unit (e.g. Rupiah) |
| `description` | string | yes |
| `date` | string (ISO date) | yes |
| `propertyId` | string \| null | no |

**Errors:** `404` property not found · `422` validation failed

---

#### `PUT /admin/ledger-entries/:id`

All fields optional (same as create).

**Errors:** `404` · `422`

---

#### `DELETE /admin/ledger-entries/:id`

**Error `404`** — not found.

---

## Tenant Routes

> Auth required. Not under `/admin`.

### Leases

Tenants can view their own leases only.

#### `GET /leases`

Returns all leases for the authenticated user.

**Response `200`** — includes `unit` (with `property`, `unitType`) and `unitPricing`.

---

#### `GET /leases/:id`

**Error `404`** — lease not found or does not belong to the current user.

---

## Data Models Reference

### `Property`

| Field | Type | Description |
|---|---|---|
| `id` | string (cuid) | Unique identifier |
| `name` | string | Display name |
| `address` | string | Street address |
| `city` | string | City |
| `createdById` | string | User who created this record |
| `updatedById` | string | User who last updated this record |
| `createdAt` | datetime | |
| `updatedAt` | datetime | |

### `UnitType`

| Field | Type | Description |
|---|---|---|
| `id` | string (cuid) | Unique identifier |
| `name` | string | Type name (unique per property) |
| `description` | string \| null | Optional notes |
| `totalFloor` | integer \| null | Optional floor count |
| `size` | integer \| null | Floor area in m² |
| `propertyId` | string | Parent property |

### `UnitPricing`

| Field | Type | Description |
|---|---|---|
| `id` | string (cuid) | Unique identifier |
| `unitTypeId` | string | Parent unit type |
| `propertyId` | string | Denormalized from unit type |
| `durationDays` | integer | Rental period in days |
| `price` | integer | Total price in smallest currency unit |

### `Unit`

| Field | Type | Description |
|---|---|---|
| `id` | string (cuid) | Unique identifier |
| `name` | string | Room identifier (unique per property) |
| `floor` | integer \| null | Floor number |
| `status` | `vacant` \| `occupied` | Occupancy status |
| `unitTypeId` | string | Unit category |
| `propertyId` | string | Parent property |

### `Lease`

| Field | Type | Description |
|---|---|---|
| `id` | string (cuid) | Unique identifier |
| `unitId` | string | Leased unit |
| `propertyId` | string | Denormalized from unit |
| `userId` | string | Tenant |
| `unitPricingId` | string | Pricing package used |
| `startDate` | datetime | Lease start |
| `endDate` | datetime | Lease end (computed) |
| `status` | `unpaid` \| `waiting_for_review` \| `paid` | Payment status |
| `createdById` | string | Admin who created this lease |
| `updatedById` | string | Admin who last updated this lease |

### `User` (tenant, admin read)

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `email` | string | Email address |
| `role` | `tenant` | Always `tenant` on `/admin/users` |
| `emailVerified` | boolean | Email verified flag |
| `image` | string \| null | Profile image URL |
| `createdAt` | datetime | |
| `updatedAt` | datetime | |

### `LedgerEntry`

| Field | Type | Description |
|---|---|---|
| `id` | string (cuid) | Unique identifier |
| `type` | `income` \| `expense` | Entry type |
| `amount` | integer | Amount in smallest currency unit |
| `description` | string | What the entry is for |
| `date` | datetime | Entry date |
| `propertyId` | string \| null | Optional property link |
| `createdById` | string | User who recorded the entry |
| `createdAt` | datetime | |
| `updatedAt` | datetime | |
