# Partner Portal (Hotel Extranet) — architecture & roadmap

## Decision

- **Do hotels need an extranet?** Yes — but a **content extranet**, not an OTA one.
  StayEasy doesn't handle rates, availability, or bookings, so hotels manage
  their **listing content** (description, positioning, facilities, official
  benefits, official URL, photo, voucher) and view **performance** (clicks,
  plan, status). No rate/availability/reservation management.

- **Separate site / subdomain?** Not yet. The portal lives in the **same
  codebase** under the **`/partner` route namespace** with its own full-screen
  shell (no public navbar/footer) and is `noindex`'d via robots.txt — exactly
  like `/admin`.
  - Promote to a **subdomain** (`partners.stayeasy…`) later, when there is real
    auth + PII + a team backend. With the namespace design, that is a hosting/DNS
    change, not a rewrite.

## What shipped (v1, demo)

- `/partner/login` — **email + password** sign-in, plus a **Create account** tab
  (hotel name, city, email, password). New accounts are `Pending` and cannot sign
  in until an admin approves them. Stores accounts in `partnerAccounts` and the
  active session in `partnerAuth` (localStorage; demo only — plaintext password).
- **Admin → Approvals**: pending account requests with Approve / Reject. Approving
  grants portal access and creates a starter listing the partner then fills in.
- `/partner` — portal home: plan, status, 30-day clicks, listing summary, links
  to edit and to the public page.
- `/partner/edit` — self-service editor for the content fields. Saves a patch to
  `hotelEdits` (localStorage). `mockRepo` merges these patches over the catalogue,
  so edits appear on the public hotel page immediately.

## Data flow

```
Hotel signs in  →  edits content  →  hotelEdits store (slug → patch)
                                         │
                          mockRepo.catalogue().map(applyEdits)
                                         │
                         public /hotels/:slug shows the edit
```

## To productionize (Phase 3 backend)

- Real auth: email + password / magic link → partner API issues a token
  (replace `partnerAuth`). One login → one or more properties (org model).
- Persist edits server-side: `PUT /partners/:slug/listing` (replace `hotelEdits`),
  with an **approval/moderation** step before content goes live.
- Roles: property manager vs. group admin; audit log of changes.
- Move to `partners.stayeasy…` subdomain; keep the public site separate.
- Image uploads (not just URLs) → object storage + CDN.
