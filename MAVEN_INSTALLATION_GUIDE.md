# Maven Installation Guide for Windows

## Quick Installation Methods

### Method 1: Using Chocolatey (Easiest - Requires Admin)

1. **Open PowerShell as Administrator** (Right-click PowerShell → Run as Administrator)

2. **Install Chocolatey:**
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

3. **Close and reopen PowerShell as Administrator**

4. **Install Maven:**
   ```powershell
   choco install maven -y
   ```

5. **Verify installation:**
   ```powershell
   mvn --version
   ```

---

### Method 2: Manual Installation (No Admin Required)

#### Step 1: Download Maven

1. Go to: https://maven.apache.org/download.cgi
2. Download: **apache-maven-3.9.6-bin.zip** (or latest version)
3. Save to your Downloads folder

#### Step 2: Extract Maven

1. Extract the ZIP file to: `C:\Program Files\Apache\maven`
   - Or any location you prefer (e.g., `C:\maven` or `D:\tools\maven`)
2. You should have a folder like: `C:\Program Files\Apache\maven\apache-maven-3.9.6`

#### Step 3: Set Environment Variables

**Option A: Using GUI**

1. Press `Win + X` → Select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables" (or "User variables"):
   
   **Add MAVEN_HOME:**
   - Click "New"
   - Variable name: `MAVEN_HOME`
   - Variable value: `C:\Program Files\Apache\maven\apache-maven-3.9.6`
   - Click OK

   **Update PATH:**
   - Find "Path" variable
   - Click "Edit"
   - Click "New"
   - Add: `%MAVEN_HOME%\bin`
   - Click OK on all dialogs

**Option B: Using PowerShell (Current User Only)**

```powershell
# Set MAVEN_HOME
[System.Environment]::SetEnvironmentVariable('MAVEN_HOME', 'C:\Program Files\Apache\maven\apache-maven-3.9.6', 'User')

# Add to PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$newPath = $currentPath + ';%MAVEN_HOME%\bin'
[System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
```

#### Step 4: Verify Installation

1. **Close all PowerShell/Command Prompt windows**
2. **Open a NEW PowerShell window**
3. **Run:**
   ```powershell
   mvn --version
   ```

You should see output like:
```
Apache Maven 3.9.6
Maven home: C:\Program Files\Apache\maven\apache-maven-3.9.6
Java version: 17.0.x, vendor: Oracle Corporation
```

---

### Method 3: Using Scoop (Alternative Package Manager)

1. **Install Scoop** (in PowerShell):
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. **Install Maven:**
   ```powershell
   scoop install maven
   ```

3. **Verify:**
   ```powershell
   mvn --version
   ```

---

## Prerequisites

### Java JDK Required!

Maven requires Java JDK. Check if you have it:

```powershell
java -version
```

**If Java is not installed:**

1. **Using Chocolatey:**
   ```powershell
   choco install openjdk17 -y
   ```

2. **Using Scoop:**
   ```powershell
   scoop bucket add java
   scoop install openjdk17
   ```

3. **Manual Download:**
   - Download from: https://adoptium.net/
   - Install JDK 17 or higher
   - Set JAVA_HOME environment variable

---

## After Installation

### 1. Verify Maven is Working

```powershell
mvn --version
```

Expected output:
```
Apache Maven 3.9.x
Maven home: ...
Java version: 17.x.x
```

### 2. Start Your Backend

```powershell
cd d:\PayRoll\backend
mvn spring-boot:run
```

### 3. Wait for Backend to Start

You should see:
```
Started PayrollBackendApplication in X.XXX seconds
```

### 4. Test Backend

Open browser or use curl:
```
http://localhost:8080
```

---

## Troubleshooting

### Issue: "mvn is not recognized"

**Solution:**
1. Close ALL PowerShell/CMD windows
2. Open a NEW window
3. Try again
4. If still not working, check PATH variable includes `%MAVEN_HOME%\bin`

### Issue: "JAVA_HOME is not set"

**Solution:**
1. Install Java JDK (see Prerequisites above)
2. Set JAVA_HOME:
   ```powershell
   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-17', 'User')
   ```

### Issue: "Permission Denied"

**Solution:**
- Run PowerShell as Administrator
- Or install Maven in a user-writable location (e.g., `C:\Users\YourName\maven`)

---

## Quick Start Commands (After Installation)

```powershell
# Terminal 1 - Start Backend
cd d:\PayRoll\backend
mvn spring-boot:run

# Terminal 2 - Start Frontend (in a new window)
cd d:\PayRoll\frontend
npm run dev
```

---

## Recommended: Install Everything at Once

If you have admin access, run this in PowerShell as Administrator:

```powershell
# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Close and reopen PowerShell as Admin, then:
choco install openjdk17 maven -y

# Verify
java -version
mvn --version
```

---

## Next Steps

After Maven is installed:

1. ✅ Verify: `mvn --version`
2. ✅ Start backend: `cd d:\PayRoll\backend && mvn spring-boot:run`
3. ✅ Wait for "Started PayrollBackendApplication"
4. ✅ Test: Open http://localhost:8080
5. ✅ Start frontend in another terminal
6. ✅ Try signup/login

---

## Need Help?

If you're still having issues:
1. Check if Java is installed: `java -version`
2. Check PATH variable includes Maven bin folder
3. Restart your computer (sometimes required for PATH changes)
4. Try manual installation method if package managers fail
