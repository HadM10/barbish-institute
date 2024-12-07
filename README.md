# Barbish Institution Website

## Project Setup Instructions

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- Git
- HeidiSQL (
  To set up the database using HeidiSQL for your project, follow these steps:

1. Download and Install HeidiSQL
   If you haven’t already, download and install HeidiSQL from https://www.heidisql.com/download.php.
2. Connect to the MySQL Server
   Open HeidiSQL and click on "New" in the session manager to create a new connection.
   Fill in the connection details:
   Hostname / IP: The IP address or localhost (if you're connecting to a local MySQL server).
   User: The MySQL username (e.g., root or the user created for the project).
   Password: The password for your MySQL user.
   Port: Default is 3306, unless you've changed it.
   Click "Open" to connect.
3. Create a New Database
   Once you're connected to your MySQL server, you need to create a new database for your project.

In the left panel (where databases are listed), right-click on "localhost" (or the server you connected to).
Select "Create new" and then "Database".
Enter a name for your new database, such as barbish_institute, and click "OK".
)

### Step 1: Clone the Repository and Setup Project

Run the following commands in a single bash script (git bash here on desktop):

```bash
# Clone the repository
git clone --branch staging https://github.com/HadM10/barbish-institute.git


```

Then open folder on vscode and open two terminals:

in the first terminal:

```bash

# Setup backend
cd server
npm install

# Create .env file inside the server folder for backend (.env):

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password you choose in heidiSQL
DB_NAME=barbish_institute
DB_PORT=3306
JWT_SECRET=your_jwt_secret (keep empty for now)

then finally

npm start

in the second terminal:

# Setup frontend
cd client
npm install

# Create .env file for frontend (.env) (if needed)

REACT_APP_API_URL=http://localhost:5000/api

then finally

npm start

```
