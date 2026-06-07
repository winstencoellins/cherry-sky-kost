# Cherry Sky Kost — Backend API

REST API for the Cherry Sky Kost property management system, built with [Elysia](https://elysiajs.com/) on the Bun runtime.

## Development

```bash
bun run dev              # start with hot-reload on port 8000
bunx prisma generate     # regenerate client after schema changes
bunx prisma db push      # apply schema to the database
bun run db:seed          # seed SKYKOST, CHERRY KOST, tenants, and sample units
```

Base URL (local): `http://localhost:8000`

### Background jobs

Scheduled tasks run inside the same Elysia process via `@elysia/cron` (daily at **00:00:00**).

| Job | Schedule | What it does |
|---|---|---|
| `expire-leases` | `0 0 0 * * *` | Sets `occupied` units to `vacant` when their paid lease has ended and no other active paid lease covers the unit |
| `confirm-lease-renewals` | `0 0 0 * * *` | Sets `leaseRenewal.isConfirmed` to `true` when the confirmation deadline has passed and it is still `false` |

Renewal confirmation deadline = lease `endDate` minus **5 days** (stored on `leaseRenewal.leaseEndDate`).

Jobs only run while the server process is running.

All successful API responses use `{ "data": ... }` unless noted otherwise.

### DigitalOcean Spaces (S3)

Set these in `.env` to use `lib/storage.ts`:

| Variable | Example |
|---|---|
| `DO_SPACES_KEY` | Spaces access key |
| `DO_SPACES_SECRET` | Spaces secret key |
| `DO_SPACES_BUCKET` | `my-bucket` |
| `DO_SPACES_REGION` | `sgp1` |
| `DO_SPACES_ENDPOINT` | `https://sgp1.digitaloceanspaces.com` |
| `DO_SPACES_CDN_URL` | Optional CDN base URL for public links |

```ts
import { storage } from "../lib/storage";

const { key, url } = await storage.upload({
  key: "leases/abc/receipt.jpg",
  body: fileBuffer,
  contentType: "image/jpeg",
});

await storage.delete(key);
```

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
| Attachments | `/admin/attachments` |
| Meta (relationship map) | `/admin/meta` |

#### `GET /admin/meta/relationships`

Returns the admin entity relationship map: which models link to each other, nested fields returned by each list/detail endpoint, and the property hierarchy tree. Use this to wire the admin frontend without guessing includes.

**Auth required:** yes

**Response `200`** — `{ data: { entities, endpoints, hierarchy } }`

Admin list/detail responses also embed related data directly (see each resource below). Key nesting:

| Resource | Nested on GET |
|---|---|
| Property (list) | `propertyAttachments`, `unitTypes` (+ pricings, attachments, counts), `_count` |
| Property (detail) | above + `unitTypes.units`, flat `units.unitType.pricings`, `unitPricings` |
| Unit type | `property`, `pricings`, `units`, `unitTypeAttachments`, `_count` |
| Unit pricing | `property`, `unitType` (+ property, attachments); detail adds `leases` |
| Unit | `property`, `unitType` (+ pricings, attachments), `activeLease` or `leases` |
| Lease | `property`, `unit`, `user`, `unitPricing`, `leaseRenewal` (+ `updatedBy`), `createdBy`, `updatedBy` |
| Tenant (detail) | profile fields + `leases` (full lease graph) |
| Ledger entry | `property`, `createdBy` |

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
  "size": 18
}
```

| Field | Type | Required |
|---|---|---|
| `name` | string | yes |
| `propertyId` | string | yes |
| `description` | string | yes |
| `size` | integer (m²) \| null | no |

**Errors:** `404` property not found · `409` duplicate name in property · `422` validation failed

---

#### `PUT /admin/unit-types/:id`

All fields optional. Same fields as create (except `propertyId` cannot be changed via this endpoint). Send `null` for `size` to clear.

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
  "maxOccupancy": 2
}
```

| Field | Type | Required |
|---|---|---|
| `name` | string | yes |
| `unitTypeId` | string | yes |
| `maxOccupancy` | integer \| null | no |

New units default to `status: "vacant"`.

**Errors:** `404` unit type not found · `409` duplicate name in property · `422` validation failed

---

#### `PUT /admin/units/:id`

Optional: `name`, `maxOccupancy`, `status` (`vacant` \| `occupied`). Send `null` for `maxOccupancy` to clear.

**Errors:** `404` · `409` duplicate name · `422`

---

#### `DELETE /admin/units/:id`

**Error `409`** — unit status is `occupied`.

---

### Users (Tenants)

Manage users with `role: tenant` (for lease assignment).

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

#### `POST /admin/users`

Create a new tenant account.

**Request body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "supersecret"
}
```

**Response `200`** — same shape as a single list item.

**Errors:** `409` email already in use · `422` validation failed

---

#### `GET /admin/users/:id`

**Response `200`** — same shape as a single list item.

**Error `404`** — user not found or not a tenant.

---

#### `POST /admin/users/:id/reset-password`

Reset a tenant's password when they forgot it. Generates a random 8-character alphanumeric temporary password and invalidates their active sessions.

**Response `200`**

```json
{
  "data": {
    "user": {
      "id": "usr...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "tenant",
      "emailVerified": false,
      "image": null,
      "createdAt": "2026-05-01T00:00:00.000Z",
      "updatedAt": "2026-05-01T00:00:00.000Z"
    },
    "temporaryPassword": "aB3xY9k2"
  }
}
```

Share `temporaryPassword` with the tenant securely. They should sign in and change it via `PUT /profile/password`.

**Errors:** `404` tenant not found · `400` tenant has no email/password account

---

### Leases

Rental agreements. `endDate` is **always computed** as `startDate + unitPricing.durationDays`.

- Creating a lease does **not** auto-occupy the unit.
- Creating a lease **also creates** a linked `leaseRenewal` (1:1) with `isRenewLease: false`, `isConfirmed: false`, `markAsCompleted: false`, and `leaseEndDate` set to 5 days before the lease `endDate`.
- When creating a lease to fulfill a tenant renewal, pass `leaseRenewalId` (the existing renewal record's `id`) — the API sets that renewal's `markAsCompleted` to `true` in the same transaction.
- Renewal flow: tenant requests via `PUT /leases/:id/renewal` (`isRenewLease`) → admin confirms via `PUT /admin/leases/:id/renewal` (`isConfirmed`, or auto-confirmed by cron) → admin creates follow-up lease via `POST /admin/leases` with `leaseRenewalId` (`markAsCompleted`).
- Setting `status` to `paid` sets the unit to `occupied`.
- Deleting a lease sets the unit to `vacant` (cascades to `leaseRenewal`).
- When `startDate` or `unitPricingId` changes on update, `leaseRenewal.leaseEndDate` is recalculated from the new `endDate`.
- After lease `endDate`, the `expire-leases` cron sets the unit back to `vacant` if no other active paid lease exists.

#### `GET /admin/leases`

**Query params:** `unitId`, `userId`, `propertyId` (all optional)

**Response `200`** — includes `unit` (with `property`, `unitType`), `user`, `unitPricing`, `leaseRenewal` (or `null`), `createdBy`, `updatedBy`.

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
  "unitPricingId": "clx...",
  "leaseRenewalId": "clx..."
}
```

| Field | Type | Required |
|---|---|---|
| `unitId` | string | yes |
| `userId` | string | yes |
| `startDate` | string (ISO date) | yes |
| `unitPricingId` | string | yes |
| `leaseRenewalId` | string | no |

`unitPricing` must belong to the unit's `unitTypeId`.

When `leaseRenewalId` is provided, the API marks that renewal's `markAsCompleted` as `true` after the new lease is created. The `userId` must match the tenant on the renewal's parent lease. Use the renewal record's `id` (from the tenant's existing lease), not the lease `id`.

**Response `200`** — includes the new lease and its `leaseRenewal`.

**Errors:** `404` unit, pricing, or lease renewal not found · `409` date overlap on same unit · `422` validation failed (including renewal already completed or tenant mismatch)

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

#### `PUT /admin/leases/:id/renewal`

Update renewal confirmation for a lease.

```json
{
  "isConfirmed": true
}
```

| Field | Type | Required |
|---|---|---|
| `isConfirmed` | boolean | yes |

**Response `200`** — updated `leaseRenewal` (with `updatedBy`).

**Errors:** `404` lease or renewal not found · `422` validation failed

**Note:** If `isConfirmed` is still `false` when the confirmation deadline (`leaseEndDate`) is reached, the `confirm-lease-renewals` cron auto-sets it to `true` at the next midnight run.

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

### Attachments

Upload files to DigitalOcean Spaces and persist metadata in attachment tables.

#### `GET /admin/attachments/checkup`

Runs a storage health check by uploading and deleting a small probe file in DigitalOcean Spaces.

**Response `200`**

```json
{
  "data": {
    "ok": true,
    "bucket": "your-space-bucket-name",
    "endpoint": "https://sgp1.digitaloceanspaces.com",
    "region": "sgp1"
  }
}
```

**Errors:** `422` storage credentials/config/signing issue

---

#### `POST /admin/attachments/property`

`multipart/form-data` body:

| Field | Type | Required |
|---|---|---|
| `propertyId` | string | yes |
| `file` | file | yes |

**Errors:** `404` property not found · `422` invalid data

---

#### `POST /admin/attachments/unit-type`

`multipart/form-data` body:

| Field | Type | Required |
|---|---|---|
| `unitTypeId` | string | yes |
| `file` | file | yes |

**Errors:** `404` unit type not found · `422` invalid data

---

#### `DELETE /admin/attachments/property/:id`

Deletes a property attachment by ID. Removes the object from DigitalOcean Spaces, then deletes the database record.

**Path params**

| Param | Type | Description |
|---|---|---|
| `id` | string | `PropertyAttachment` ID |

**Response `200`** — deleted attachment record.

**Errors:** `404` attachment not found · `422` storage delete failed

---

#### `DELETE /admin/attachments/unit-type/:id`

Deletes a unit type attachment by ID. Removes the object from DigitalOcean Spaces, then deletes the database record.

**Path params**

| Param | Type | Description |
|---|---|---|
| `id` | string | `UnitTypeAttachment` ID |

**Response `200`** — deleted attachment record.

**Errors:** `404` attachment not found · `422` storage delete failed

---

## Public Routes

> No authentication required. Intended for the public-facing frontend (landing page, search kosts, property listings).
> All public routes are prefixed with `/public`.

| Resource | Prefix |
|---|---|
| Properties | `/public/properties` |
| Search rooms | `/public/search` |

### Properties (Public)

Read-only property catalogue with nested unit types, units, and all pricing packages.

#### `GET /public/properties`

Returns all properties with their unit types, units, pricing options, and attachment images.

**Images on each property / unit type**

| Field | Description |
|---|---|
| `propertyAttachments` | Array of property images; each item has a resolved `url` (from DB or built from `objectKey` + CDN/Spaces) |
| `primaryImageUrl` | First image attachment URL for the property (convenience for cards) |
| `unitTypes[].unitTypeAttachments` | Images for that unit type |
| `unitTypes[].primaryImageUrl` | First image URL for that unit type |

**Auth required:** no

**Response `200`**

```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Cherry Sky Kost A",
      "address": "Jl. Sudirman No. 12",
      "city": "Jakarta",
      "unitTypes": [
        {
          "id": "clx...",
          "name": "Studio",
          "description": "Compact single room",
          "size": 18,
          "pricings": [
            { "id": "clx...", "durationDays": 7, "price": 450000 },
            { "id": "clx...", "durationDays": 30, "price": 1500000 }
          ],
          "units": [
            { "id": "clx...", "name": "Room 101", "maxOccupancy": 2, "status": "vacant" },
            { "id": "clx...", "name": "Room 102", "maxOccupancy": 2, "status": "occupied" }
          ]
        }
      ]
    }
  ]
}
```

---

#### `GET /public/properties/:id`

Returns a single property with full unit and pricing detail.

**Auth required:** no

**Path params**

| Param | Type | Description |
|---|---|---|
| `id` | string | Property ID |

**Response `200`** — same shape as a single item from the list above.

**Error `404`** — property not found.

---

### Search rooms (Public)

Search rentable units across all properties. Intended for the public **search kosts** page (e.g. `/en/search-kosts` on the frontend).

#### `GET /public/search`

Returns a flat list of matching units with property, unit type, pricing packages, and attachment images. Each `property` and `unitType` includes `propertyAttachments` / `unitTypeAttachments` (with resolved `url`) and `primaryImageUrl` for display. No authentication required.

**Auth required:** no

**Query params**

| Param | Type | Required | Description |
|---|---|---|---|
| `q` | string | no | Free-text search (unit name, property name/address/city, unit type name) |
| `city` | string | no | Filter by property city (case-insensitive partial match) |
| `propertyId` | string | no | Limit to a single property |
| `unitTypeId` | string | no | Limit to a single unit type |
| `status` | `vacant` \| `occupied` | no | Filter by unit status |
| `startDate` | string (ISO date) | no* | Availability window start |
| `endDate` | string (ISO date) | no* | Availability window end |
| `minPrice` | integer | no | Minimum price (smallest currency unit, e.g. Rupiah) |
| `maxPrice` | integer | no | Maximum price |
| `durationDays` | integer | no | Require a pricing row with this exact duration (see below) |

\* `startDate` and `endDate` must be provided together. Units with a lease overlapping that range are excluded.

**How price filters work**

`minPrice` / `maxPrice` apply to a single `unit_pricing` row on the unit’s type:

- **Without `durationDays`** — any package whose price falls in range counts (e.g. a 7-day package at Rp 450.000 matches `minPrice=500000` only if you lower the min, or if another package is in range).
- **With `durationDays`** — only that duration’s package is checked. Example: `durationDays=30` + price range requires a **30-day** row in range. If the DB only has `durationDays: 7`, the unit is **excluded** even when a 7-day price would match the slider.

That is why `GET /public/search?status=vacant&minPrice=500000&maxPrice=2500000&durationDays=30` can return **0** while the same query **without** `durationDays` returns results: the frontend was sending `durationDays=30` on every load while data only had 7-day (or other) packages.

**Recommended default (search-kosts page load)**

Do **not** send `durationDays` until the user picks 7, 12, or 30 in the UI:

```
GET /public/search?status=vacant&minPrice=500000&maxPrice=2500000
```

**Example requests**

```
# Default page load (vacant + price slider only)
GET /public/search?status=vacant&minPrice=500000&maxPrice=2500000

# Text search
GET /public/search?q=Medan&status=vacant

# Duration chosen in UI — must exist in DB for that unit type
GET /public/search?status=vacant&durationDays=7&minPrice=500000&maxPrice=2500000

# All units (no filters)
GET /public/search
```

To support monthly search in the UI, add admin pricing with `durationDays: 30` for the relevant unit types (or default the frontend duration dropdown to a duration that exists in data).

**Response `200`**

```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Room 101",
      "maxOccupancy": 2,
      "status": "vacant",
      "property": {
        "id": "clx...",
        "name": "Cherry Sky Kost A",
        "address": "Jl. Sudirman No. 12",
        "city": "Jakarta"
      },
      "unitType": {
        "id": "clx...",
        "name": "Studio",
        "description": "Compact single room",
        "size": 18,
        "pricings": [
          { "id": "clx...", "durationDays": 7, "price": 450000 },
          { "id": "clx...", "durationDays": 30, "price": 1500000 }
        ]
      }
    }
  ],
  "meta": {
    "total": 1
  }
}
```

**Error `422`** — invalid query (e.g. only one of `startDate`/`endDate` sent, or `minPrice` > `maxPrice`).

**Frontend usage**

```ts
const params = new URLSearchParams({
  city: "Jakarta",
  status: "vacant",
  startDate: "2026-06-01",
  endDate: "2026-07-01",
});
const res = await fetch(`http://localhost:8000/public/search?${params}`);
const { data, meta } = await res.json();
```

---

## Tenant Routes

> Auth required. Not under `/admin`.

### Profile

#### `GET /profile`

Returns the authenticated user's profile (`id`, `name`, `email`, `role`, `emailVerified`, `image`, `createdAt`, `updatedAt`).

**Error `404`** — user record not found.

---

#### `PUT /profile`

Update the authenticated user's profile (`name` and/or `image`). Email cannot be changed on this endpoint.

**Request body**

```json
{
  "name": "John Doe",
  "image": "https://example.com/avatar.jpg"
}
```

At least one of `name` or `image` is required. Pass `"image": null` to remove the profile image.

**Response `200`** — updated profile (same shape as `GET /profile`).

**Errors:** `401` not authenticated · `422` validation failed

---

#### `PUT /profile/password`

Change the authenticated user's password. Requires the current password.

**Request body**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword1234",
  "revokeOtherSessions": true
}
```

`revokeOtherSessions` defaults to `true` when omitted.

**Response `200`**

```json
{
  "data": {
    "success": true
  }
}
```

**Errors:** `400` incorrect current password · `401` not authenticated · `422` validation failed

---

### Leases

Tenants can view their own leases only.

#### `GET /leases`

Returns all leases for the authenticated user.

**Response `200`** — includes `unit` (with `property`, `unitType`), `unitPricing`, and `leaseRenewal` (`isRenewLease`, `isConfirmed`, `markAsCompleted`, `leaseEndDate`, etc.).

---

#### `GET /leases/:id`

**Error `404`** — lease not found or does not belong to the current user.

---

#### `PUT /leases/:id/renewal`

Request or cancel a lease renewal for the tenant's own lease.

```json
{
  "isRenewLease": true
}
```

| Field | Type | Required |
|---|---|---|
| `isRenewLease` | boolean | yes |

Set `isRenewLease` to `true` to request renewal, or `false` to cancel a pending request. Only **paid** leases can request renewal. Cannot update a renewal that has already been marked completed by admin.

**Response `200`** — updated `leaseRenewal`.

**Errors:** `404` lease or renewal not found · `422` validation failed (including lease not paid or renewal already completed)

Renewal confirmation (`isConfirmed`) is admin-only via `PUT /admin/leases/:id/renewal`.

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
| `description` | string | Notes about what distinguishes this type |
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
| `maxOccupancy` | integer \| null | Maximum tenants allowed |
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
| `leaseRenewal` | `LeaseRenewal` \| null | 1:1 renewal record (auto-created on lease create) |
| `createdById` | string | Admin who created this lease |
| `updatedById` | string | Admin who last updated this lease |

### `LeaseRenewal`

One renewal record per lease (1:1). Created automatically when a lease is created. Included on lease reads as `leaseRenewal`.

| Field | Type | Description |
|---|---|---|
| `id` | string (cuid) | Unique identifier |
| `leaseId` | string | Parent lease (unique — one renewal per lease) |
| `isRenewLease` | boolean | Tenant requested renewal (default `false`) |
| `isConfirmed` | boolean | Renewal confirmed (default `false`; auto-set by cron after deadline) |
| `markAsCompleted` | boolean | Admin has created the follow-up lease for this renewal (default `false`; set via `POST /admin/leases` with `leaseRenewalId`) |
| `leaseEndDate` | datetime | Confirmation deadline — lease `endDate` minus 5 days |
| `updatedById` | string | User who last updated this renewal |
| `createdAt` | datetime | |
| `updatedAt` | datetime | |

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
