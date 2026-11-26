# Backend API contract

The app talks to the backend **only** through `services/api.js`. Every screen calls one of the
functions below. Today they return sample data (`services/mock.js`); set `EXPO_PUBLIC_API_URL`
in `.env` and the same calls go to your server with no screen changes.

## Conventions
- Base URL: `EXPO_PUBLIC_API_URL`, e.g. `https://api.example.com/v1` (HTTPS only).
- JSON in and out. Field names are `snake_case`. Dates are `YYYY-MM-DD`. Money is a plain number (no currency symbol).
- Auth: `Authorization: Bearer <token>` on every request except `GET /companies` and `POST /auth/login`.
- Errors: non-2xx with `{ "message": "Human readable text" }`. The app shows `message` to the user.
- `401` on any call while logged in = token expired: the app logs the user out and shows Login.
- Statuses (orders and deposits): `pending`, `approved`, `cancelled`.

## Auth
| Screen | Call | Request | Response |
|---|---|---|---|
| Login (company list) | `GET /companies` | | `[{ "id": "1", "name": "DX Group" }]` |
| Login | `POST /auth/login` | `{ "username": "DMS-0042", "password": "...", "company_id": "1" }` | `{ "token": "jwt...", "user": { "id": "u1", "name": "Rahim Traders", "dms_code": "DMS-0042", "company": "DX Group" } }` |
| Profile > Log out | `POST /auth/logout` | | `{ "ok": true }` (optional; the app logs out locally either way) |

`username` is the customer's **DMS code**. The token is stored in the device Keychain/Keystore until Logout.

## Home
`GET /dashboard`
```json
{
  "as_of": "2026-11-25",
  "order_value": 3280000,
  "sellout_value": 3420000,
  "balance": 165000,
  "deposit_total": 2300000,
  "profile_complete": false
}
```
- `order_value`: total of orders until today. The app labels it "Excluding cancelled", so exclude cancelled orders.
- `sellout_value`: customer's sales to end customers until today.
- `balance`: current available balance (same number as the last ledger row).
- `deposit_total`: approved deposits.
- `profile_complete`: `false` while BIN or TIN is missing (shows the "Complete your profile" prompt).

`GET /incentive`  (calculated entirely by the backend)
```json
{ "period": "November 2026", "earned": 24500, "sales_achieved": 612500, "sales_target": 1000000, "note": "Calculated by head office" }
```
`sales_achieved`, `sales_target` and `note` are optional. Without `sales_target` the progress bar is hidden.
If this call fails the incentive card is simply not shown.

## Inventory
`GET /products?search=` -> array
```json
[{ "id": "1", "product_name": "iPhone 15 Pro Max", "sku": "AAPL-IP15PM-256G", "category": "Electronics",
   "brand": "Apple", "unit_price": 185000, "available": 57 }]
```
`available` is the quantity the customer may order. The app hides products with `available <= 0`.
(For large catalogs add `page` and `limit`; the app currently loads the full list.)

## Orders
`GET /orders?days=15&status=pending` -> array, newest first. `days` and `status` are optional.
```json
[{ "id": "o1009", "order_no": "SO-1009", "date": "2026-11-24", "status": "pending", "total": 465000, "note": "",
   "items": [{ "product_id": "1", "product_name": "iPhone 15 Pro Max", "sku": "AAPL-IP15PM-256G", "qty": 2, "unit_price": 185000 }],
   "courier": null }]
```
`courier` is `null` until logistics uploads it from the back panel, then:
`{ "name": "Pathao Courier", "tracking_no": "PC-88213", "phone": "01700-000000" }`

`POST /orders`  (place order from the cart)
```json
{ "items": [{ "product_id": "1", "qty": 2, "unit_price": 185000 }], "note": "Deliver before Friday" }
```
Response: the created order (same shape as above, `status: "pending"`).
**The server must re-validate** stock (`qty <= available`) and **recompute prices**; do not trust `unit_price`.
Return `{ "message": "..." }` with a 4xx if invalid (e.g. "iPhone 15 Pro Max has only 1 available.").

## Finance
`GET /ledger` -> array, **oldest first** (the app shows newest first)
```json
[{ "id": "L1", "date": "2026-11-10", "voucher": "DEP-901", "particular": "Bank Deposit: BRAC Bank",
   "narration": "Deposit approved", "debit": 0, "credit": 500000, "balance": 500000, "type": "Bank" }]
```
`type` is one of `Sales`, `Bank`, `Cash`, `Adjustment`. Convention used by the screens:
**debit = money out (orders), credit = money in (deposits)**, `balance` = running balance computed by the server.

`GET /banks` -> `[{ "id": "1", "name": "Dutch-Bangla Bank", "account_no": "****1234" }]`

`GET /deposits` -> array, newest first
```json
[{ "id": "d3", "voucher_no": "DEP-955", "date": "2026-11-22", "bank_id": "1", "bank_name": "Dutch-Bangla Bank",
   "amount": 300000, "status": "pending", "attachment_url": null }]
```
`POST /deposits` is **multipart/form-data**: `voucher_no`, `date`, `bank_id`, `amount`, optional file field `attachment` (PDF/JPG/PNG, max 5MB).
Response: the created deposit with `status: "pending"`. Balance changes only after approval.

## Profile
`GET /profile`
```json
{ "name": "Rahim Traders", "dms_code": "DMS-0042", "company": "DX Group",
  "phone": "01711-000000", "email": "rahim@example.com", "address": "Motijheel, Dhaka", "bin": "", "tin": "" }
```
`PUT /profile` with `{ "bin", "tin", "phone", "email", "address" }` -> updated profile.
**BIN and TIN are mandatory.** The app enforces 13-digit BIN and 12-digit TIN (`services/config.js`); validate on the server too.
`name`, `dms_code` and `company` are read-only in the app.

## Not built yet (in the proposal)
Notifications (send to all/individual, read status), pagination, token refresh, order/deposit push updates, and a sell-out entry screen.
