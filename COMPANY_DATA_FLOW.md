# Company Data Flow

## Where the Created Company is Listed

### 📊 **Database Storage**
The company/organization data is stored in the PostgreSQL database:
- **Table**: `organizations`
- **Location**: Database `payroll`
- **Created by**: Migration file `V3__create_organizations_table.sql`

### 🔄 **Data Flow**

1. **Company Creation** (TenantRegister page):
   ```
   User fills form → POST /api/v1/organizations → Saved to database
   ```

2. **Company Retrieval** (Dashboard):
   ```
   Dashboard loads → GET /api/v1/organizations → Fetches from database → Displays in UI
   ```

### 📍 **Where Company is Displayed**

#### **Dashboard (Main Display)**
- **Location**: Top header bar
- **Component**: Company dropdown button
- **Shows**: 
  - Company name (e.g., "Agren Company")
  - Industry (e.g., "Technology")

#### **Company Dropdown Menu**
When you click the company name in the header:
- Company icon with gradient background
- Company name (from `organization.companyName`)
- Industry type (from `organization.industry`)
- Links to:
  - Company Settings
  - Company Profile

### 🔍 **How to View Company Data**

1. **In the UI**:
   - Login to the dashboard
   - Look at the top header bar
   - Click on the company name to see full details

2. **In the Database**:
   ```sql
   SELECT * FROM organizations;
   ```

3. **Via API**:
   ```
   GET http://localhost:8080/api/v1/organizations
   ```

### 📝 **Company Data Fields**

The organization table stores:
- `id` - Unique identifier
- `company_name` - Company name
- `industry` - Industry type
- `address_line1` - Address line 1
- `address_line2` - Address line 2
- `city` - City
- `state` - State
- `postal_code` - Postal code
- `country` - Country
- `payroll_start_date` - When payroll starts
- `user_id` - Owner/creator of the organization
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### 🎯 **Current Implementation**

The Dashboard component:
1. Fetches organization data on load using `useEffect`
2. Stores it in `organization` state
3. Displays the first organization for the logged-in user
4. Shows "Loading..." while fetching
5. Shows "No Company" if no organization exists

### 🔧 **API Endpoints**

- **Create Organization**: `POST /api/v1/organizations`
- **Get Organizations**: `GET /api/v1/organizations`
- **Backend Controller**: `OrganizationController.java`
- **Service**: `OrganizationService.java`
- **Repository**: `OrganizationRepository.java`
