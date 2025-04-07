# Notes Project

## Overview
This is a simple notes management application that allows users to:
- View all notes.
- Add new notes.
- Edit existing notes.
- Delete notes.
- Export notes.

The project uses:
- **Frontend**: HTML, CSS, JavaScript.
- **Backend**: Node.js with Express.js.
- **Database**: SQLite.

---

## Prerequisites
1. Install [Node.js](https://nodejs.org/) (LTS version recommended).
2. Ensure `npm` (Node Package Manager) is installed (comes with Node.js).

---

## How to Run the Project
1. **Download and Extract**:
   - Download the project folder and extract it to your local machine.

2. **Navigate to the Project Directory**:
   - Open a terminal and navigate to the project folder:
     ```
     cd c:\Users\david\Desktop\Code\marlonJS
     ```

3. **Install Dependencies**:
   - Run the following command to install all required dependencies:
     ```
     npm install
     ```

4. **Start the Server**:
   - Run the server:
     ```
     node server.js
     ```
   - The server will start on `http://localhost:3000`.

5. **Access the Application**:
   - Open your browser and navigate to:
     ```
     http://localhost:3000
     ```

---

## Notes
- The project uses SQLite for the database. Ensure the `notes.db` file is in the project directory.
- If port `3000` is unavailable, you can change the port in `server.js`:
   ```javascript
   const port = 8080; // Example: Change to an available port
   ```
   Then access the project at `http://localhost:<port>`.

---

## Troubleshooting
- **Error: `Failed to fetch notes`**:
  - Ensure the backend server is running (`node server.js`).
  - Check the terminal for error messages.

- **Database Issues**:
  - Ensure the `notes.db` file exists in the project directory.
  - If the database is missing, the server will create a new one automatically.

---

## Project Structure
```
marlonJS/
├── add.html          # Add new note page
├── edit.html         # Edit note page
├── export.html       # Export notes page
├── index.html        # Main page to view all notes
├── script.js         # Frontend JavaScript
├── server.js         # Backend server
├── notes.db          # SQLite database
├── package.json      # Node.js dependencies
├── package-lock.json # Dependency lock file
└── README.md         # Instructions
```
