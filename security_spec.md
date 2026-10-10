# WowCalc Security Specification

## Data Invariants
- Every subcategory must belong to a valid category.
- Only the administrator (`classifiedsmine@gmail.com`) can perform write operations (create, update, delete).
- Read access is public for all categories and subcategories.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Unauthenticated Write**: Attempting to create a category without being signed in.
2. **Non-Admin Write**: Attempting to create a category as a signed-in user who is not the admin.
3. **Spoofed Admin Email**: Attempting to write with a manually set email claim (not possible in rules if verified properly).
4. **Invalid Title Size**: Creating a category with a title longer than 100 characters.
5. **Orphaned Subcategory**: Creating a subcategory without a `categoryId`.
6. **Bypassing Server Timestamps**: Providing a client-side timestamp for `createdAt` during creation.
7. **Modifying `createdAt`**: Attempting to update the `createdAt` field on an existing document.
8. **Malicious ID Injection**: Creating a document with a 1MB string as the ID.
9. **Shadow Field Injection**: Adding an `isAdmin: true` field to a category document.
10. **State Shortcut**: Directly modifying a hypothetical status field to a terminal state (not applicable here but tested via `hasOnly`).
11. **Bulk Delete Attack**: Attempting a batch delete as a non-admin.
12. **PII Leak Test**: Attempting to read documents from a collection not explicitly allowed (default deny).

## Verification Strategy
- All write operations use `isAdmin()` check.
- `isAdmin()` checks for specific email AND `email_verified == true`.
- `incoming().diff(existing()).affectedKeys().hasOnly(...)` ensures no ghost fields are updated.
- `request.time` is used for all timestamp validations.
