IMPORTANT FUNCTIONAL UPDATE — DO NOT JUST DESIGN STATIC SCREENS.

The previous implementation did NOT correctly implement the following requirements.
Now implement them as actual working functionality in the existing VIT SmartShuttle prototype.

DO NOT REBUILD OR REDESIGN THE ENTIRE UI.
Keep the existing visual design, dark theme, cards, navigation and branding.
Modify the existing screens and flows to add the missing functionality.

==================================================
1. STUDENT MUST SEE SHUTTLE AVAILABILITY / DEMAND
==================================================

The Student Dashboard currently does NOT show shuttle availability or demand.

ADD THIS TO THE STUDENT DASHBOARD.

Create a clearly visible section called:

"SHUTTLE AVAILABILITY"

Students should be able to see the current status of campus shuttles without accessing the Driver or Admin dashboard.

For every shuttle show:

- Shuttle ID
- Status
- Current passenger count
- Maximum capacity
- Driver name if assigned
- Current trip status

Use statuses such as:

AVAILABLE
ACTIVE
FULL
OFFLINE

Example:

SH-07
AVAILABLE
0 / 30 passengers

SH-03
ACTIVE
18 / 30 passengers

SH-05
FULL
30 / 30 passengers

SH-02
OFFLINE

Also add a "DEMAND" indicator.

Example:

SH-07
Low Demand

SH-03
High Demand

The demand should be based on the current number of passengers / active requests in the demo data.

Students should be able to understand:

- Which shuttle is available
- Which shuttle is currently active
- Which shuttle is full
- Which shuttle is offline
- How much demand there currently is

IMPORTANT:
This must NOT be a static decorative card.

Use the same shared shuttle data used by the Admin and Driver dashboards.

If the Driver starts SH-07:
→ SH-07 should change from AVAILABLE to ACTIVE on the Student Dashboard.

If passengers are added:
→ passenger count should increase.

If the shuttle reaches capacity:
→ status should become FULL.

If the Admin changes the shuttle status:
→ Student Dashboard should reflect the change.

==================================================
2. PROPER LOGIN FOR ALL THREE ROLES
==================================================

Currently the application only asks for a Student ID and does not properly authenticate users.

FIX THIS.

The opening screen must clearly provide three separate options:

STUDENT
DRIVER
ADMIN

Each role must have its own login screen.

--------------------------------
STUDENT LOGIN
--------------------------------

Student Login must require:

Student ID
Password

Example demo account:

Student ID: VIT2021001
Password: student123

Add a "Login" button.

After successful login:
→ Open ONLY the Student Dashboard.

--------------------------------
DRIVER LOGIN
--------------------------------

Driver Login must require:

Driver ID
Password

Example demo account:

Driver ID: DRV001
Password: driver123

After successful login:
→ Open ONLY the Driver Dashboard.

--------------------------------
ADMIN LOGIN
--------------------------------

Admin Login must require:

Admin ID
Password

Example demo account:

Admin ID: ADM001
Password: admin123

After successful login:
→ Open ONLY the Admin Dashboard.

--------------------------------
LOGIN VALIDATION
--------------------------------

Implement actual login validation in the prototype.

If credentials are incorrect:

Show:

"Invalid ID or password"

Do not allow access to the dashboard.

Add:

"Logout"

After logout:
→ Return to the role/login screen.

IMPORTANT SECURITY REQUIREMENT:

A student must NEVER be able to access Driver or Admin functionality simply by changing a URL, clicking a navigation element, editing profile information, or changing their Student ID.

The currently logged-in role must determine which dashboard can be accessed.

Do not merely hide the buttons.
Actually enforce role-based access in the prototype logic.

==================================================
3. STUDENT PRIVACY
==================================================

Students must only see their own account data.

For example, if logged in as:

Arjun Sharma
VIT2021001

the Student Dashboard must show ONLY:

Arjun's
- Name
- Student ID
- Wallet
- Transactions
- Trip history
- Outstanding dues
- Active trip

A student must NOT be able to change their Student ID to:

VIT2021056

and become Kiran Patel.

Students must NOT be able to:

- Change their Student ID
- Access another student's wallet
- Access another student's transactions
- Access another student's trip history
- Change another student's details
- Access Admin Dashboard
- Access Driver Dashboard

Student profile editing should only allow genuinely editable fields.

Student ID must remain fixed and unique.

Create these demo student accounts:

Arjun Sharma
VIT2021001
student123

Kiran Patel
VIT2021056
student123

Priya Nair
VIT2021088
student123

Test that logging into each account displays that student's own data.

==================================================
4. STUDENT WALLET TOP-UP
==================================================

The Student must be able to add money directly from their own Student Dashboard.

Currently the wallet is only displayed.

CHANGE THIS.

Add a clear:

"+ ADD MONEY"

button next to the wallet balance.

Example:

WALLET BALANCE
₹120

[ + ADD MONEY ]

When the student clicks "+ ADD MONEY":

Open a wallet top-up interface.

Provide preset amounts:

₹50
₹100
₹200
₹500

Also provide:

Custom Amount

The student can enter another valid amount.

Then show a confirmation screen:

"Add ₹100 to SmartShuttle Wallet?"

[ Cancel ]
[ Pay ₹100 ]

Since this is a hackathon prototype, DO NOT integrate a real payment gateway.

Instead simulate the payment.

After clicking Pay:

Show:

"Payment Successful ✓"

Then immediately update:

Previous Balance: ₹120
Added: ₹100
New Balance: ₹220

Add the top-up to the student's transaction history:

Wallet Top-up
+₹100
SUCCESSFUL
9:52 PM

IMPORTANT:
The wallet update must happen only for the currently logged-in student.

If Arjun adds ₹100:
→ Only Arjun's wallet becomes ₹220.

Kiran's wallet must remain unchanged.

==================================================
5. CONNECT WALLET WITH SHUTTLE FARE
==================================================

Keep the existing ₹20 SmartShuttle fare system.

When a student's trip ends:

IF wallet balance >= ₹20:

Automatically deduct ₹20.

Show:

"Fare Paid Automatically ✓"

Transaction:
SmartShuttle Fare
-₹20
PAID

IF wallet balance < ₹20:

Do not prevent the student from completing the trip.

Instead:

- Mark ₹20 as OUTSTANDING
- Update Outstanding Dues
- Show "Payment Pending"
- Allow the driver to complete the trip
- Driver does NOT wait for payment

This demonstrates the main problem SmartShuttle is solving.

==================================================
6. CONNECT EVERYTHING
==================================================

All of these features must use shared application state.

Example complete flow:

Student logs in as Arjun
↓
Arjun sees shuttle availability
↓
Driver logs in as DRV001
↓
Driver starts SH-07
↓
Student dashboard changes SH-07 from AVAILABLE → ACTIVE
↓
Driver scans Arjun's QR
↓
Arjun appears as a passenger
↓
Arjun sees ACTIVE TRIP
↓
Driver ends trip
↓
₹20 fare is automatically processed
↓
Arjun's wallet updates
↓
Transaction appears in Arjun's history
↓
Admin sees the transaction
↓
Student can later click "+ ADD MONEY"
↓
Simulated payment succeeds
↓
Arjun's wallet immediately increases

==================================================
7. DEMO ACCOUNTS
==================================================

Make demo accounts easy to test.

STUDENT
ID: VIT2021001
Password: student123

DRIVER
ID: DRV001
Password: driver123

ADMIN
ID: ADM001
Password: admin123

Do NOT expose passwords inside dashboards after login.

==================================================
8. FINAL TESTING REQUIREMENT
==================================================

Before considering this task complete, test these exact scenarios:

TEST 1:
Login as Student → verify Student Dashboard opens.

TEST 2:
Login as Driver → verify Driver Dashboard opens.

TEST 3:
Login as Admin → verify Admin Dashboard opens.

TEST 4:
Try incorrect password → login must fail.

TEST 5:
Student must not access Driver/Admin dashboard.

TEST 6:
Student changes wallet using + ADD MONEY → wallet balance must update.

TEST 7:
Student top-up must create a wallet transaction.

TEST 8:
Driver starts shuttle → Student sees shuttle as ACTIVE.

TEST 9:
Driver scans student → Student sees ACTIVE TRIP.

TEST 10:
Driver ends trip → ₹20 fare is processed and transaction appears.

TEST 11:
Student cannot change Student ID to access another student's account.

TEST 12:
Student can see shuttle availability and demand directly from Student Dashboard.

DO NOT mark these features as complete unless the interactions actually work.

Keep the existing disclaimer:

"Not connected to real VIT systems"

and for wallet:

"Demo payment — no real money is processed."

The goal is a realistic, connected hackathon prototype — not static mockup screens.