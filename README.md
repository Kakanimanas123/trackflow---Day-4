# trackflowDay4
This repository contains the **Day 4 work** for the TrackFlow CRM & Operations App assignment.

Features Implemented

### 🔹 Leads Module
- `LeadList.tsx`: Lists all leads in the system.
- `LeadCard.tsx`: Displays each lead's information in a card format.
- `LeadForm.tsx`: Form used to add or edit lead details.
- `LeadDetails.tsx`: Shows full information for a specific lead.

### 🔹 Orders Module
- `Orders.tsx`: Displays order lifecycle and current status.
  - Order stages: **Order Received → In Development → Ready to Dispatch → Dispatched**

### 🔹 Shared Logic
- `AppContext.tsx`: Central state management using React Context API.
  - Handles adding, updating, and deleting leads and orders.
  - Uses localStorage for persistence.

### 🔹 Routing
- `App.tsx`: Routes between Dashboard, Leads, and Orders modules.

