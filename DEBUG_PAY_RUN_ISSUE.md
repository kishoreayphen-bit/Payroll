# Pay Run 400 Error - Debugging Summary

## Current Status
Still getting 400 error when creating pay run. The error message shows:
```
could not execute statement [ERROR: current transaction is aborted, commands ignored until end of transaction block]
```

## What This Means
An earlier SQL statement in the transaction is failing, which aborts the entire transaction. All subsequent SQL commands are then ignored.

## What We've Tried
1. ✅ Fixed 401 auth error - added userId to TokenResponse, derived userId from SecurityContext
2. ✅ Fixed JPQL MONTH/YEAR functions - converted to date range queries
3. ✅ Added try-catch around attendance calculations to prevent abort
4. ✅ Added migration V19 for missing columns (payment_status, payment_date, is_withheld)
5. ✅ Removed @Transactional to prevent cascading abort
6. ✅ Added explicit error logging for PayRunEmployee save

## The Real Issue
The transaction is STILL aborting on the PayRunEmployee INSERT. This suggests:
1. There's STILL a missing column in the database that the entity expects
2. OR there's a constraint violation (FK, unique, etc.)
3. OR there's a data type mismatch

## Next Steps to Debug
Since we can't see the actual SQL error (it's hidden by the transaction abort), we need to:

1. **Check the actual database schema** - We need to verify what columns actually exist in pay_run_employees
2. **Enable SQL logging** - Add `spring.jpa.show-sql=true` to see the exact SQL being executed
3. **Check for constraint violations** - The employee or pay_run FK might be invalid

## Immediate Action Required
We need to see the ACTUAL SQL error, not just the "transaction aborted" message. The best way is to:
1. Enable SQL logging in application.yml
2. Restart backend
3. Attempt to create pay run
4. Check backend console for the FIRST error (before "transaction aborted")

This will show us the exact column or constraint that's failing.
