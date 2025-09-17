# Smart Lab Management Frontend - Local Setup Guide

This guide will help you set up and run the Smart Lab Management frontend project on your local machine.

## Prerequisites
- Node.js (v18 or above recommended)
- npm (comes with Node.js)
- Git (optional, for cloning from a repository)

## Installation Instructions

### 1. Install Node.js and npm
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- npm is included with Node.js
- Verify installation:
  ```
  node -v
  npm -v
  ```

### 2. (Optional) Install Git
- Download and install Git from [git-scm.com](https://git-scm.com/)
- Verify installation:
  ```
  git --version
  ```

## Step-by-Step Setup

### 1. Clone the Repository (if using Git)
```
git clone https://github.com/raghuvanshi007/Smart-Lab-Management.git
```
Or, copy the project folder to your local machine.

### 2. Navigate to the Frontend Directory
```
cd Smart-Lab-Management/frontend
```

### 3. Install Dependencies
```
npm install
```
This will install all required packages listed in `package.json`.

### 4. Add Logo Images (Optional)
Place your logo images in:
```
public
```
Reference them in your code as `your-logo.png`.

### 5. Start the Development Server
```
npm start
```
This will launch the app in development mode. Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Common Issues & Fixes
- **Missing dependencies:** Run `npm install` again.
- **Corrupt or missing `package.json`:** Restore or recreate the file.
- **Empty `public/index.html`:** Ensure it contains `<div id="root"></div>`.
- **Port conflicts:** Change the port in `package.json` or stop other running apps.

### 7. Build for Production
```
npm run build
```
This will create an optimized production build in the `build` folder.

## Project Structure
- `src/` - React source code
- `public/` - Static files (HTML, logos, etc.)
- `package.json` - Project configuration and dependencies

## Support
If you encounter issues, check the error messages in the terminal and follow the troubleshooting steps above. For further help, contact the project maintainer or open an issue on GitHub.
