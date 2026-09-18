You are the lead software engineer for a hackathon project called "VIT SmartShuttle".

We are building a prototype of an offline-first campus shuttle fare and transportation management system.

CORE PROBLEM:
VIT campus shuttle rides have a fixed fare, but payment is currently handled manually/digitally at the end of the journey. This can cause payment delays, failed payments due to poor connectivity, cash handling, and unnecessary waiting for the driver and passengers.

CORE SOLUTION:
A student authenticates using a simulated VIT student ID QR code when boarding. The system authorizes the shuttle fare through a simulated VIT Wallet. If internet connectivity is unavailable, the transaction is securely queued locally and synchronized when connectivity returns.

IMPORTANT:
This is a hackathon prototype. DO NOT attempt to connect to real VIT systems, VIT Wallet, VTOP, VIT biometric systems, or real financial/payment systems. Everything must be simulated locally.

TECHNOLOGY:

* Frontend: React
* Backend: Node.js + Express
* Database: PostgreSQL if practical; otherwise use SQLite for the initial prototype
* Use JavaScript/TypeScript consistently
* Use a clean, modern responsive UI
* Use a component-based architecture
* Keep the project easy to run locally from VS Code/Antigravity

MAIN USER ROLES:

1. Student
2. Driver
3. Admin

INITIAL FEATURES:

* Student dashboard
* Driver dashboard
* Admin dashboard
* Simulated student accounts
* Simulated VIT Wallet
* Shuttle records
* Transaction records
* Basic authentication/role separation
* Clean API structure

DESIGN PRINCIPLES:

* Do not over-engineer.
* Build a working MVP before adding advanced features.
* Keep external dependencies minimal.
* Do not use blockchain.
* Do not use facial recognition.
* Do not invent integrations with VIT.
* Clearly separate mock/demo services from code that would eventually connect to real university infrastructure.

FIRST TASK:
Before writing a large amount of code, inspect the project directory and determine whether it is empty or contains an existing project.

Then:

1. Propose the folder structure.
2. Initialize the project.
3. Create the frontend and backend foundations.
4. Create the database schema/model structure for:

   * students
   * wallets
   * shuttles
   * trips
   * transactions
5. Add seed/demo data for several students and shuttles.
6. Create a basic navigation system for Student, Driver, and Admin views.
7. Make sure the project runs successfully locally.

Do NOT implement advanced payment, offline synchronization, AI, QR scanning, or analytics yet.

After implementation, run the project and test the basic application flow. Fix any errors you encounter.

At the end, explain:

* What you created
* How to run it
* What files were created
* Any assumptions you made
* What remains to be implemented
Continue working on the existing VIT SmartShuttle project. Do not rewrite the existing architecture unless necessary.

Implement the simulated VIT student identity system.

IMPORTANT:
This is a prototype. Do NOT connect to real VIT authentication, VTOP, biometric systems, or university databases.

FEATURES:

1. STUDENT ID
   Each demo student should have:

* studentId
* name
* program
* walletId
* QR identity payload

The QR payload should uniquely identify the demo student.

2. STUDENT QR DISPLAY
   On the Student Dashboard, add a "My VIT ID" section that displays a QR code representing the student's simulated identity.

3. SHUTTLE SCANNER
   Create a scanner interface that can scan a student's QR code using the device camera if practical.

Also provide a DEMO MODE fallback:

* Select a demo student from a dropdown/list
* Simulate scanning that student's ID

The demo must work even if camera permissions are unavailable.

4. VALIDATION
   When a QR is scanned:

* Validate the student
* Display the student's name and ID
* Reject malformed/unknown QR codes
* Prevent duplicate scans within a short configurable period

5. SECURITY
   Do not put wallet balance or sensitive information directly inside the QR payload.
   The QR should contain only a safe student identifier or signed demo identifier.

6. UI
   Make the scanner visually clear:
   "Scan VIT ID to Board Shuttle"

Show:

* Student identity
* Verification status
* Shuttle currently being used

FIRST build and test the QR generation and simulated scanner flow.

Do not implement payment deduction or offline synchronization yet.

After implementation:

* Run the application
* Test valid student scan
* Test invalid QR
* Test duplicate scan
* Fix all errors
* Report exactly what changed.

Continue from the existing VIT SmartShuttle project.

Implement a SIMULATED VIT WALLET system.

IMPORTANT:
This is NOT connected to any real VIT financial system and must not attempt to access VTOP, VIT Wallet, bank accounts, UPI, or real payment gateways.

WALLET FEATURES:

Each student has:

* walletId
* currentBalance
* transactionHistory
* outstandingTransportDues

Create backend APIs for:

* Get wallet balance
* Get transaction history
* Authorize a fare
* Complete/settle a fare
* Create an outstanding transport charge

FARE:
The shuttle fare is fixed at ₹20 per trip.

TRANSACTION LIFECYCLE:

BOARDING
→ Fare authorization
→ Trip in progress
→ Trip completion
→ Fare settlement

Use explicit transaction states such as:

* AUTHORIZED
* COMPLETED
* PENDING_SYNC
* FAILED
* OUTSTANDING
* CANCELLED

INSUFFICIENT BALANCE:
If the student's wallet does not have enough balance:

* Do NOT simply crash or reject the entire application.
* Record the attempted trip.
* Mark the ₹20 transport charge as OUTSTANDING according to the prototype's rules.
* Clearly display the status to the user.

IMPORTANT:
Prevent duplicate charging for the same trip.

Create a transaction ID for every fare transaction.

The transaction should record:

* transactionId
* studentId
* shuttleId
* amount
* timestamp
* status
* tripId

STUDENT DASHBOARD:
Show:

* Current wallet balance
* Current trip
* Recent transactions
* Outstanding dues

DRIVER DASHBOARD:
Show payment status for passengers on the current shuttle.

ADMIN:
Show basic transaction totals.

Test:

1. Student with sufficient balance
2. Student with exactly ₹20
3. Student with less than ₹20
4. Duplicate payment attempt
5. Transaction history

Do not implement offline synchronization yet.
Continue from the existing VIT SmartShuttle project.

Now implement the complete NORMAL ONLINE boarding flow.

USER STORY:

A student enters a shuttle.

1. Driver selects the current shuttle.
2. Student scans their simulated VIT ID.
3. System authenticates the student.
4. System checks the student's wallet.
5. System creates a ₹20 fare authorization.
6. Student is added to the current passenger list.
7. Driver dashboard immediately shows the passenger and payment status.

FLOW:

SCAN ID
↓
IDENTIFY STUDENT
↓
VALIDATE STUDENT
↓
CHECK WALLET
↓
AUTHORIZE ₹20
↓
CREATE TRIP
↓
ADD PASSENGER
↓
SHOW SUCCESS

A successful transaction should display:

"Trip Authorized"
"Fare: ₹20"
"Student: [name]"
"Shuttle: [shuttle ID]"

DO NOT finalize the transaction as completed until the trip is completed.

PREVENT:

* Same student boarding the same shuttle twice within a short period
* Duplicate transaction creation
* Unknown student IDs
* Invalid shuttle IDs

DRIVER DASHBOARD:
Show:

* Current shuttle
* Passenger count
* Passenger names/IDs
* Payment status
* Pending/offline status when applicable

STUDENT DASHBOARD:
Show:

* Current shuttle
* Trip status
* Fare status

Create a clean state transition system.

Test the complete flow from QR scan → student verification → fare authorization → passenger list.

Do not implement offline mode yet.
Continue from the existing VIT SmartShuttle project.

Now implement the OFFLINE-FIRST TRANSACTION SYSTEM.

This is one of the core features of the hackathon project.

PROBLEM:
Students may not have reliable internet connectivity inside/around the shuttle. The payment system must therefore not depend on the student's phone having internet access.

IMPORTANT ARCHITECTURE:
The shuttle-side application is the trusted transaction device.

When the shuttle device has internet:

* Transactions are sent to the backend normally.

When the shuttle device loses internet:

* Valid transactions must be stored locally.
* They must enter a synchronization queue.
* They must automatically synchronize when connectivity returns.

IMPLEMENT:

1. CONNECTION STATUS
   Create a clearly visible indicator:

ONLINE
or
OFFLINE

Also provide a DEMO CONTROL that lets us intentionally simulate:

* Internet ON
* Internet OFF

This is required for the hackathon demonstration.

2. OFFLINE TRANSACTION QUEUE

When offline:
Student scans ID
↓
Student is validated using locally available demo identity data
↓
Transaction is created locally
↓
Transaction status = PENDING_SYNC

Store:

* transactionId
* studentId
* shuttleId
* tripId
* amount
* timestamp
* deviceId
* status

Use persistent browser storage such as IndexedDB where appropriate.

3. SYNC ENGINE

When connection returns:

PENDING_SYNC
↓
Validate transaction
↓
Send to backend
↓
Backend checks transactionId/idempotency
↓
Transaction committed once
↓
Local transaction marked SYNCHRONIZED

4. IDEMPOTENCY

This is extremely important.

If the same offline transaction is sent multiple times, the backend MUST NOT charge the student multiple times.

Use transactionId/idempotency keys.

5. CONFLICT HANDLING

Handle:

* Duplicate transaction
* Student already charged
* Invalid student
* Invalid shuttle
* Server unavailable
* Sync failure

Failed synchronization should remain safely queued for retry.

6. UI

Driver dashboard should show:

ONLINE
Passengers: 18
Synced: 17
Pending sync: 1

When offline:

OFFLINE MODE
Transactions are securely queued
Pending: 1

When internet returns:

SYNCING...
1 transaction synchronized ✓

7. DEMO REQUIREMENT

Make the entire feature easy to demonstrate.

I should be able to:

1. Start application online
2. Scan student
3. Create transaction
4. Toggle OFFLINE
5. Scan another student
6. Show transaction being queued
7. Toggle ONLINE
8. Show automatic synchronization
9. Show the transaction appearing in the backend/admin dashboard

Do not use fake animations to pretend synchronization happened. The underlying transaction state must actually change.

Test the system thoroughly and fix synchronization bugs.
Continue from the existing VIT SmartShuttle project.

Implement trip completion and fare settlement.

CURRENT MODEL:
BOARDING:
Student identity verified
→ ₹20 fare authorized
→ Trip created

NOW ADD:

EXIT / TRIP COMPLETION

Student scans their VIT ID again when leaving the shuttle.

System:

1. Finds the student's active trip.
2. Validates that the trip belongs to the current shuttle.
3. Marks the trip as COMPLETED.
4. Settles the ₹20 fare.
5. Updates the wallet.
6. Records the completed transaction.
7. Removes the student from the active passenger list.

DISPLAY:

Trip Completed ✓
Fare: ₹20
Shuttle: #07
Time: [time]
Transaction ID: [ID]

HANDLE:

* Student has no active trip
* Student tries to exit from another shuttle
* Student scans twice
* Offline exit
* Already completed trip

IMPORTANT:
The same ₹20 transaction must never be charged twice.

Make the state transitions explicit and test them.
Continue from the existing project.

Upgrade the Driver Dashboard into a realistic shuttle operator interface.

The driver should NOT need to handle individual cash payments.

Dashboard should prominently show:

SHUTTLE #07

Connection:
🟢 ONLINE / 🔴 OFFLINE

Passengers:
18

Fare Status:
17 Synchronized
1 Pending

Current passengers table:

* Student ID
* Student name
* Boarding time
* Fare status
* Trip status

Actions:

* Scan VIT ID
* Complete trip/exit scan
* View pending synchronization
* Retry synchronization

IMPORTANT:
Keep the driver's interface extremely simple because the driver should spend minimal time interacting with the system.

Do not add unnecessary features.

Make the dashboard suitable for a live hackathon demonstration.
Continue from the existing project.

Build the Admin Dashboard for VIT SmartShuttle.

The purpose is to demonstrate that the system provides transportation visibility in addition to payment automation.

SHOW:

Today's:

* Total trips
* Total passengers
* Total fare collected
* Successful transactions
* Offline transactions
* Pending transactions
* Failed transactions

SHUTTLE UTILIZATION:
For each shuttle:

* Number of trips
* Passenger count
* Average passengers per trip
* Payment success rate

TIME ANALYTICS:
Show passenger demand by hour.

Example:
4 PM
5 PM
6 PM
7 PM

Use clear charts and cards.

TRANSACTION MONITORING:
Show:

* Recent transactions
* Pending transactions
* Failed transactions
* Outstanding student dues

SECURITY/AUDIT:
Show transaction ID, student ID, shuttle ID, timestamp, device ID, and status.

The dashboard should look like a real campus transportation control center.

Use demo data when necessary, but all displayed values should be generated from the application's underlying data rather than hardcoded visual numbers.
Continue from the working VIT SmartShuttle system.

Now add an AI/ML transportation intelligence layer.

DO NOT modify or break the existing payment, identity, offline synchronization, or transaction systems.

GOAL:
Predict future shuttle passenger demand based on historical simulated shuttle usage.

INPUT DATA:

* Timestamp
* Hour
* Day of week
* Shuttle ID
* Boarding count
* Trip count
* Historical passenger demand

OPTIONAL:

* Campus events
* Weather
  Only use these if they can be implemented reliably in the prototype.

OUTPUT:
For a selected future time period, estimate expected passenger demand.

Example:

5:00 PM
Expected demand: 24 passengers
Demand level: HIGH

The system should also provide an understandable explanation such as:

"Demand is expected to increase based on historical passenger volume during this time period."

IMPORTANT:
Do not fabricate real VIT transportation statistics.
Clearly label generated/demo data as simulated.

For the hackathon, prioritize:

* Reliable demonstration
* Explainability
* Simple implementation
* Fast response

If a sophisticated ML model is unnecessary, use an appropriate lightweight forecasting approach rather than adding a complex model purely for appearance.

Integrate the prediction into the Admin Dashboard.

Also consider a simple anomaly detection mechanism for unusual transaction patterns, but only implement it if it does not destabilize the core application.
Perform a security and reliability audit of the entire VIT SmartShuttle prototype.

Do not redesign the application unnecessarily.

Review:

AUTHENTICATION

* Student role separation
* Driver role separation
* Admin role separation

AUTHORIZATION

* Students cannot access admin functionality
* Drivers cannot modify arbitrary student wallets
* Students can only view their own information

TRANSACTIONS

* Prevent duplicate charges
* Use transaction IDs/idempotency
* Validate transaction ownership
* Prevent client-side manipulation of fare amount

QR SECURITY

* Do not store wallet balance in QR
* Reject malformed IDs
* Prevent simple replay/duplicate scans where possible

OFFLINE SECURITY

* Validate queued transactions on synchronization
* Prevent duplicate synchronization
* Handle corrupted/invalid local transactions

DATABASE

* Validate input
* Prevent obvious injection vulnerabilities
* Do not expose sensitive data unnecessarily

SECRETS

* Ensure API keys/secrets are not committed to source control
* Create/update .env.example if needed

Then:

1. Identify vulnerabilities.
2. Fix realistic vulnerabilities.
3. Add basic validation.
4. Test the fixes.
5. Give a concise security report.

Do not claim the prototype is production-secure. Clearly distinguish prototype security from requirements for a real VIT deployment.
The VIT SmartShuttle prototype is now functionally complete.

DO NOT add major new features.

Your task is to make the existing system reliable and presentation-ready for a hackathon.

PRIORITY ORDER:

1. Fix all existing bugs.
2. Ensure the complete demo flow works.
3. Improve UI consistency.
4. Improve loading/error/empty states.
5. Make the offline demonstration obvious.
6. Ensure dashboards use real application data.
7. Remove unnecessary placeholder content.
8. Ensure mock/demo VIT integrations are clearly labeled.
9. Improve accessibility and responsive behavior.
10. Ensure the application can be started easily from a clean environment.

CRITICAL DEMO FLOW:

STUDENT
→ Open Student Dashboard
→ Show simulated VIT ID
→ Board Shuttle
→ Scan ID
→ ₹20 authorized

DRIVER
→ See passenger
→ See fare status

SYSTEM
→ Toggle network OFF
→ Student boards
→ Transaction enters PENDING_SYNC

SYSTEM
→ Toggle network ON
→ Transaction synchronizes automatically

STUDENT
→ Exit shuttle
→ Trip completed
→ ₹20 settled

ADMIN
→ Transaction appears
→ Analytics update
→ Offline transaction visible in history

Make sure this entire flow works reliably.

Also create/update:

* README.md
* Setup instructions
* Architecture overview
* API overview
* Demo instructions
* Known limitations
* Future deployment requirements

IMPORTANT:
Do not claim that the prototype is actually integrated with VIT Wallet or VIT's authentication systems.

The final application should look and behave like a polished hackathon prototype rather than a collection of disconnected features.

Now make the VIT SmartShuttle prototype feel like a real-time working system.

IMPORTANT:
Students should NOT be manually added by the driver.

Students are already registered in the system. The driver only scans their VIT ID / QR code when they board.

Add realistic demo data and interactions for all three roles.

DRIVER DASHBOARD:
- Add a "Start Trip" button.
- After starting a trip, show the Shuttle ID and trip status as ACTIVE.
- Add a prominent "Scan Student QR" button.
- Since this is a hackathon prototype, simulate scanning instead of requiring a real camera.
- Clicking "Scan Student QR" should open a scanner-style interface with demo students:
  - Arjun Sharma — VIT2021001
  - Kiran Patel — VIT2021056
  - Priya Nair — VIT2021088
- Selecting/scanning a student should immediately show:
  "Student Verified ✓"
  Student name
  VIT ID
  "Boarded Successfully"
- Add the student to the CURRENT PASSENGERS list.
- Increase passenger count automatically.
- Prevent the same student from being scanned twice during the same trip.
- Add boarding time for each passenger.
- Add a "Remove" option for passengers if needed before the trip ends.
- Add an "End Trip" button.

STUDENT DASHBOARD:
When a student is scanned by the driver, their dashboard should immediately reflect the active trip.

For example:
ACTIVE TRIP
SH-07
Status: IN PROGRESS
Boarded: 9:42 PM

When the driver ends the trip:
- Active trip changes to completed.
- ₹20 fare is automatically recorded.
- Wallet balance decreases by ₹20.
- Trips Today increases by 1.
- A new transaction appears in Recent Transactions.

ADMIN DASHBOARD:
Add realistic management functionality.

STUDENTS:
- Search students
- View registered students
- Add student
- Deactivate/remove student
- View wallet balance
- View outstanding dues
- View trip history

DRIVERS:
- View drivers
- Add driver
- Deactivate/remove driver
- Assign driver to shuttle
- Show driver status

SHUTTLES:
- View shuttle list
- Add shuttle
- Deactivate/remove shuttle
- Assign driver
- Show status: Available / Active Trip / Offline

TRANSACTIONS:
Show:
Student | Shuttle | Driver | Amount | Time | Status

LIVE ACTIVITY:
Add a real-time activity feed.

Example:
9:42 PM — Arjun Sharma boarded SH-07
9:43 PM — Kiran Patel boarded SH-07
9:44 PM — SH-07 trip started
9:51 PM — SH-07 trip completed
9:51 PM — ₹20 fare charged

MOST IMPORTANT:
Make the prototype data connected across the Student, Driver and Admin views.

Example flow:
Driver starts SH-07
→ scans Arjun Sharma
→ Arjun appears as a passenger
→ Arjun's Student Dashboard shows ACTIVE TRIP
→ Admin Live Activity shows "Arjun Sharma boarded SH-07"
→ Driver ends trip
→ ₹20 transaction is created
→ Student wallet updates
→ Admin transaction table updates

Use shared demo state/data so these changes happen immediately rather than showing unrelated static screens.

Keep the current VIT SmartShuttle dark UI, branding, cards and visual style. Do not redesign the existing interface unnecessarily.

This is a hackathon simulation, so use simulated QR scanning and demo data rather than claiming real VIT system integration.

Keep the existing disclaimer:
"Not connected to real VIT systems"
PAYMENT LOGIC:

The ₹20 fare should be automatically settled through the SmartShuttle wallet when the trip is completed.

The driver should NOT need to collect cash or wait for a UPI payment.

If the student's wallet has at least ₹20:
- Automatically deduct ₹20.
- Mark transaction as PAID.
- Show "Fare Paid Automatically ✓".

If the student's wallet has less than ₹20:
- Do not block the trip.
- Mark the fare as OUTSTANDING.
- Add ₹20 to Outstanding Dues.
- Show a clear "Payment Pending" status.
- The driver should still be able to complete the trip without waiting for payment.

This should clearly demonstrate the main problem being solved:
the driver does not have to stop and wait for every passenger to pay after the trip.
FINAL SHARING REQUIREMENT:

At the end of this implementation, make sure the finished prototype can be shared with judges as a Figma prototype/link.

If this workflow is connected to Figma, create/update the Figma file and provide the final shareable Figma link.

The final shared prototype should allow judges to:
- Open the prototype
- Switch between Student, Driver and Admin roles
- Navigate through the main workflows
- Demonstrate the simulated QR scanning
- See the connected trip/payment flow

Make sure the final prototype is presentation-ready and that all important demo interactions are accessible from the shared prototype.
Now improve the VIT SmartShuttle prototype by fixing the following real-world usability, access-control, privacy, and wallet issues.

IMPORTANT:
Do not redesign the existing UI unnecessarily. Keep the current VIT SmartShuttle dark theme, branding, cards, typography and overall visual style.

==================================================
1. SHUTTLE AVAILABILITY MUST BE VISIBLE TO STUDENTS
==================================================

Currently shuttle availability is primarily visible to Admin.

Students should also be able to see which shuttles are currently available.

Add a "Shuttle Availability" section to the Student Dashboard.

Show each shuttle with:

- Shuttle ID
- Current status:
  - AVAILABLE
  - ACTIVE
  - OFFLINE
- Assigned driver if applicable
- Current passenger count / capacity if available
- Last updated time

Example:

SH-07
AVAILABLE
Driver: Ravi Kumar
Capacity: 18 / 30

SH-03
ACTIVE
Driver: Arun
Passengers: 24 / 30

SH-05
OFFLINE

The information should come from the same shared shuttle data used by the Admin and Driver dashboards.

If Admin changes a shuttle from AVAILABLE to OFFLINE, the Student Dashboard should reflect that change.

If a Driver starts a trip on SH-07, students should immediately see SH-07 as ACTIVE.

==================================================
2. PROPER ROLE-BASED LOGIN
==================================================

Students must NOT be able to access Driver or Admin dashboards simply by changing the URL, navigating manually, or editing student information.

Create a proper role-selection/login flow at the beginning.

Show:

STUDENT
DRIVER
ADMIN

When STUDENT is selected:
- Open Student Login
- Student enters Student ID and password
- Then open only the Student Dashboard.

When DRIVER is selected:
- Open Driver Login
- Require Driver ID and password
- Then open only the Driver Dashboard.

Provide a clearly visible DEMO ACCOUNT so the hackathon judges can easily test the Driver role.

Demo Driver:
Driver ID: DRV001
Password: driver123

When ADMIN is selected:
- Open Admin Login
- Require Admin ID and password
- Then open only the Admin Dashboard.

Provide a clearly visible DEMO ACCOUNT for testing.

Demo Admin:
Admin ID: ADM001
Password: admin123

Do NOT expose the passwords inside the actual dashboard after login.

Add:
- Login validation
- Invalid credentials message
- Logout button
- Role-based access control

A Student account must never be able to access Admin or Driver functionality.

==================================================
3. STUDENT PRIVACY / ACCOUNT SECURITY
==================================================

Currently a student can potentially change student details and access another student's information.

Fix this.

Each Student account must have its own unique Student ID and profile.

Students should only be able to view/edit information that is intentionally editable for THEIR OWN account.

Students must NOT be able to:
- Change their Student ID
- Change their account identity to another student
- View another student's wallet
- View another student's transactions
- View another student's trip history
- Access another student's dashboard
- Modify another student's profile
- Access Admin functionality
- Access Driver functionality

The Student ID should be treated as a unique identity.

For the demo, create multiple student accounts:

Student 1:
Name: Arjun Sharma
Student ID: VIT2021001
Password: student123

Student 2:
Name: Kiran Patel
Student ID: VIT2021056
Password: student123

Student 3:
Name: Priya Nair
Student ID: VIT2021088
Password: student123

When logged in as Arjun, only Arjun's data should appear.

When logged in as Kiran, only Kiran's data should appear.

Do not allow the user to simply edit the profile name or Student ID to become another student.

==================================================
4. STUDENT WALLET TOP-UP
==================================================

Students should be able to add money to their own SmartShuttle wallet directly from the Student Dashboard.

Add:

"WALLET"

Current Balance:
₹120

[ + Add Money ]

Clicking "Add Money" should open a simple top-up interface.

Provide preset amounts:

+ ₹50
+ ₹100
+ ₹200
+ ₹500

Also allow a custom amount.

For the hackathon prototype, simulate the payment rather than integrating a real payment gateway.

Example flow:

Student clicks "+ ₹100"
→ Show payment confirmation screen
→ "Demo Payment"
→ Student clicks "Pay"
→ Show "Payment Successful ✓"
→ Wallet increases by ₹100
→ New wallet balance is displayed immediately
→ Add a transaction to wallet history

Example:

Previous Balance: ₹120
Added: ₹100
New Balance: ₹220

Transaction:

Wallet Top-up
+₹100
Status: SUCCESSFUL
Time: 9:52 PM

Make it clear that this is a simulated/demo payment and is NOT connected to a real payment gateway.

==================================================
5. CONNECT EVERYTHING THROUGH SHARED DATA
==================================================

All three roles should use the same underlying demo data.

Student
↕
Driver
↕
Admin

Example:

Admin changes SH-07 status to AVAILABLE
→ Student sees SH-07 as AVAILABLE.

Driver starts SH-07 trip
→ SH-07 becomes ACTIVE for Student and Admin.

Driver scans Arjun
→ Arjun's Student account shows ACTIVE TRIP.
→ Driver sees Arjun in CURRENT PASSENGERS.
→ Admin sees Arjun in LIVE ACTIVITY.

Driver ends trip
→ ₹20 fare is processed.
→ Arjun's wallet updates.
→ Transaction appears for Arjun.
→ Admin sees the transaction.

Student adds ₹100 to wallet
→ Student wallet immediately updates.
→ Wallet transaction appears in Student transaction history.

==================================================
6. SECURITY / ACCESS CONTROL DEMO
==================================================

Make the role separation obvious during the hackathon presentation.

Student:
Can access only Student Dashboard.

Driver:
Can access only Driver Dashboard.

Admin:
Can access only Admin Dashboard.

Do not rely only on hiding buttons.

The application should actually check the current logged-in role before allowing access to each dashboard.

Add Logout so the judge can switch between roles during the demo.

==================================================
7. DEMO-FRIENDLY EXPERIENCE
==================================================

Make the login screen easy for judges to understand.

Include a small:

"Demo Accounts"

section on the login screen.

Show:

STUDENT
VIT2021001 / student123

DRIVER
DRV001 / driver123

ADMIN
ADM001 / admin123

These are demo credentials only.

Keep the existing disclaimer:

"Not connected to real VIT systems"

Also add, where appropriate:

"Demo payment — no real money is processed."

Do not claim real VIT authentication, real payment gateway integration, or real-time connection to VIT systems.

==================================================
FINAL GOAL
==================================================

The prototype should now demonstrate:

1. Role-based login
2. Student privacy
3. Driver access control
4. Admin access control
5. Shared shuttle availability
6. Real-time-looking status updates across dashboards
7. QR-based student boarding
8. Automatic trip fare processing
9. Student wallet top-up
10. Connected Student / Driver / Admin workflows

Keep the existing design and improve the functionality rather than rebuilding the interface from scratch.