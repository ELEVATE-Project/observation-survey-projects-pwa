The Elevate Projects PWA is developed using the Ionic framework. This document provides instructions on setting up the development environment and deploying the application.

Contents
---------------------

 * [Dependencies](#dependencies)
 * [Setting up the CLI and Prerequisites](#setting-up-the-cli-and-prerequisites)
 * [Setup and Configuration](#setup-and-configuration)
 * [Setting up the Project](#setting-up-the-project)
 * [Serving the Application](#serving-the-application)
 * [Debugging the Application](#debugging-the-application)
 * [Deployment Guide](#deployment-guide)
   * [Environment Configuration](#environment-configuration)
   * [User Authentication and Portal Setup](#user-authentication-and-portal-setup)
   * [Native Deployment](#native-deployment)
   * [Docker Deployment](#docker-deployment)

Dependencies
------------

| Requirement       | Description                                                                                                             |
|-------------------|-------------------------------------------------------------------------------------------------------------------------|
| Ionic CLI         | Version 7.x.x+ (Global) / @ionic/angular: ^8.8.2                                                                       |
| Ionic Framework   | @ionic/angular: ^8.8.2, @angular/build: ^21.2.5, @angular/cli: ^21.2.5, @ionic/angular-toolkit: ^12.3.0                 |
| Capacitor         | Capacitor CLI: ^8.3.0, @capacitor/core: ^8.3.0                                                                          |
| System            | [nodejs](https://nodejs.org/) : ^20.x.x, npm: ^10.x.x                                                                   |

Additional information
----------------------

* [Ionic Framework](https://ionicframework.com/docs/)

Setting up the CLI and Prerequisites
-------------------------------------

Before setting up the project for development or deployment, ensure the following prerequisites are installed:

1. **Install Node.js v18.20.8 and npm v10.8.2** (if not already installed)
   - Download and install from https://nodejs.org
   - Verify installation:
     ```bash
     node -v
     npm -v
     ```

2. **Install Ionic Framework**
   ```bash
   npm install -g ionic
   ```

3. **Install Ionic CLI**
   ```bash
   npm install -g @ionic/cli
   ```

4. **Install PM2 (Process Manager)** (required for deployment)
   ```bash
   npm install -g pm2
   ```

Setup and Configuration
-----------------------

1. **Fork the repository** https://github.com/ELEVATE-Project/observation-survey-projects-pwa to your GitHub account

2. **Clone your forked repository**
   ```bash
   git clone <FORKED_REPO_LINK>
   ```

3. **Navigate to the project directory**
   ```bash
   cd observation-survey-projects-pwa
   ```

4. **Fetch the branch and pull latest updates**
   ```bash
   git checkout <branch-name>
   git pull origin <branch-name>
   ```

Setting up the Project
----------------------

#### **Part 1: Basic Application Setup**

1. **Navigate to the project folder:**
   ```bash
   cd observation-survey-projects-pwa
   ```
2. **Install dependencies:**
   ```bash
   npm install --force
   ```
3. **Configure Environment Variables:**
   Follow the [Environment Configuration](#environment-configuration) section to set up your `env.js` file.

#### **Part 2: Backend Service Integration (Optional)**

If you want to connect the PWA to the full backend service:

1. **Setup Backend Service**: Follow the instructions in the [Project Service Documentation](https://github.com/ELEVATE-Project/project-service/tree/main/documentation/3.4.0).

2. **Update Base URL**: Once the backend is running (typically on port 6001), update the `baseURL` in your `src/assets/env/env.js` to `http://localhost:6001`.

3. **Initialize Database Data**: Run the following script to populate the initial form definitions into your local database:
   ```bash
   node forms_migration.js
   ```
4. **Initialize User Service Data**: Run the following script to populate forms and features in the user service database:
   ```bash
   chmod +x formsManager.sh
   ./formsManager.sh
   ```

#### **Part 3: Elevate Portal Integration (Optional)**

If you require a complete user management system with login, registration, and discovery of projects and programs:

1. **Setup Elevate Portal**: Follow the installation guide in the [Elevate Portal Repository](https://github.com/ELEVATE-Project/elevate-portal/blob/release-1.1.1/README.md).

2. **Authentication & Access**: The portal handles user sessions and provides the interface to launch specific projects and programs within this PWA.

3. **Update Base URL**: Once the backend is running (typically on port 3001), update the `NEXT_PUBLIC_BASE_URL` in your `apps/shikshagraha-app/public/env-config.js` to `http://localhost:3001`.

4. **Host the app**: Run the following command to serve the portal:
   ```bash
   nx dev shikshagraha-app --port=3000 --verbose
   ```

Serving the Application
------------------------

1. Run the project on your local system using the following command:

    ```
    ionic serve
    ```

Debugging the Application
-------------------------

1. Open the running app in the browser.
2. Start inspecting using Chrome dev tools or any alternatives.

## Deployment Guide

### Environment Configuration

Update the environment configuration file:

- **Local Path:** `src/assets/env/env.js`
- **Deployment Path:** `/usr/src/app/www/ml/assets/env/env.js`

Configure the environment variables:

```javascript
window["env"] = {
   production: true,
   baseURL: '<BaseUrl>',
   capabilities: 'all',
   restrictedPages: ['DOWNLOADS','AUTH_PAGES','PROFILE','EDIT_PROFILE'],
   unauthorizedRedirectUrl: "/",
   isAuthBypassed: true,
   profileRedirectPath: "<PathToProfileEdit>",
   showHeader: true,
   config:{
       logoPath:'assets/images/logo.png',
       faviconPath:'assets/icons/elevate-logo.png',
       title:"Elevate",
       redirectUrl:"/home"
   },
   hostPath:'/ml/'
};
```

> **Note**: For detailed documentation on each environment variable, refer to the [Environment Configuration Documentation](./env-variables-guide.md).

### User Authentication and Portal Setup

**Option 1: Integration with Existing System**
If you have your own user login, registration, and home page to list capabilities, you can integrate this PWA by adding the following nginx path configuration to your existing setup:

```nginx
location /ml/ {
    # Your nginx configuration for the PWA
}
```

**Option 2: Using Elevate Portal**
If you need a complete user authentication system with login, registration, and home page capabilities, you can use our separate portal repository:

**Elevate Portal Repository**: https://github.com/ELEVATE-Project/elevate-portal

This repository provides a complete user management system that can be deployed alongside this PWA. Refer to the setup documentation in that repository for detailed installation and configuration instructions.

### Native Deployment

Deploy the portal to path at the URL https://xyz.com/ml/

1. **Setup and Configuration**
   - Follow the [Setup and Configuration](#setup-and-configuration) section above to fork, clone, and prepare your repository.

2. **Configure Angular.json**
   ```bash
   cd projectpath/angular.json
   ```
   Add the following key-value pairs in `app.architect.build.options`:
   ```json
   "baseHref": "/ml/",
   "deployUrl": "/ml/"
   ```

3. **Install dependencies and build the project**
   ```bash
   npm install --force
   ```

4. **Build the project for production**
   ```bash
   ionic build --prod
   ```

5. **Start the application using PM2**
   ```bash
   pm2 start pm2.config.json
   ```

### Docker Deployment

1. **Setup and Configuration**
   - Follow the [Setup and Configuration](#setup-and-configuration) section above to fork, clone, and prepare your repository.

2. **Configure Angular.json**
   ```bash
   cd projectpath/angular.json
   ```
   Add the following key-value pairs in `app.architect.build.options`:
   ```json
   "baseHref": "/ml/",
   "deployUrl": "/ml/"
   ```

3. **Install Docker** (if not already installed)
   - Download and install Docker from https://www.docker.com/get-started/

4. **Run using Docker Compose**
   ```bash
   docker compose up -d
   ```
   This command builds the image and starts the container in detached mode. The application will be accessible on port `7007`.

5. **Stop and Remove Containers**
   ```bash
   docker compose down
   ```