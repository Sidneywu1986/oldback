# fund-management Specification

## Purpose
TBD - created by archiving change comprehensive-rebuild. Update Purpose after archive.
## Requirements
### Requirement: Fund Account
The system MUST maintain fund accounts for users and masters.

- Each user/master MAY own a fund account
- Each account MUST track: balance, frozen balance, cumulative income
- All balance changes MUST generate a corresponding `fund_transactions` record
- The system MUST ensure account balance is always consistent with transaction history

#### Scenario: Fund Account Balance After Transaction
- **Given** a fund account with a balance of 500.00 and no frozen balance
- **When** a recycle points redemption credit of 200.00 is applied to the account
- **Then** the account balance MUST be 700.00 AND a corresponding `fund_transactions` record of type "income" for 200.00 MUST exist

### Requirement: Transaction Ledger
The system MUST record every financial transaction.

- Every fund movement MUST generate a transaction record
- Transaction types MUST include: income (recycle points redemption), withdrawal, freeze, unfreeze
- Each transaction record MUST include: amount, type, associated order, timestamp, remarks
- The transaction list MUST support filtering by date range and transaction type
- Transaction records MUST be immutable (no deletion allowed)

#### Scenario: Viewing Transaction History Filtered by Type
- **Given** a fund account with 50 transaction records of mixed types (income, withdrawal, freeze, unfreeze)
- **When** the user filters the transaction list by type "income" with no date range
- **Then** only income-type records MUST be displayed AND the total count MUST match the number of income transactions for that account

### Requirement: Withdrawal Review
The system MUST implement a withdrawal request and review flow.

- Users/masters MUST be able to submit withdrawal requests with: amount, payment method, payment account
- Finance staff MUST be able to approve or reject withdrawal requests
- Approved withdrawals MUST deduct the account balance and generate a withdrawal transaction
- Rejected withdrawals MUST require a rejection reason
- Rejected withdrawals MUST unfreeze the previously frozen balance

#### Scenario: Finance Staff Approving a Withdrawal Request
- **Given** a pending withdrawal request for 300.00 from an account with 1000.00 balance and no frozen balance
- **When** a finance staff member approves the withdrawal request
- **Then** the account balance MUST be 700.00, a withdrawal transaction of 300.00 MUST be recorded, and the withdrawal request status MUST change to "approved"

### Requirement: Fund Safety
The system MUST enforce financial safety constraints.

- Withdrawal amount MUST NOT exceed available balance (balance - frozen balance)
- Concurrent withdrawal requests MUST be locked to prevent over-withdrawal
- All financial operation records MUST be append-only and cannot be deleted

#### Scenario: Attempting to Withdraw More Than Available Balance
- **Given** a fund account with a balance of 500.00 and a frozen balance of 200.00 (available balance = 300.00)
- **When** a user submits a withdrawal request for 400.00
- **Then** the system MUST reject the request with an error indicating insufficient funds AND no transaction record MUST be created AND the account balance MUST remain 500.00

