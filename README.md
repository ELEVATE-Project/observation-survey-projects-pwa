The Elevate PWA is developed using the Ionic framework. This document provides instructions on setting up the development environment and deploying the application.

Contents
---------------------

 * [Dependencies](#dependencies)
 * [Setting up the CLI and Prerequisites](#setting-up-the-cli-and-prerequisites)
 * [Setting up the Project](#setting-up-the-project)
 * [Building the Application](#building-the-application)
 * [Debugging the Application](#debugging-the-application)
 * [Deployment Guide](#deployment-guide)
   * [Setup and Configuration](#setup-and-configuration)
   * [Environment Configuration](#environment-configuration)
   * [Native Deployment](#native-deployment)
   * [Docker Deployment](#docker-deployment)

Dependencies
------------

| Requirement       | Description                                                                                                             |
|-------------------|-------------------------------------------------------------------------------------------------------------------------|
| Ionic CLI         | Version 7.1.1 (/usr/local/lib/node_modules/@ionic/cli)                                                                  |
| Ionic Framework   | @ionic/angular 7.0.0 @angular-devkit/build-angular : 17.0.0 @angular-devkit/schematics : 17.0.0 @angular/cli : 17.0.0 @ionic/angular-toolkit : 11.0.1 |
| Capacitor         | Capacitor CLI : 6.0.0 @capacitor/core : 6.0.0                     |
| System            | [nodejs](https://nodejs.org/) : v18.20.3 npm: 10.7.0           |

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

Setting up the Project
----------------------

1. Clone the [repository](https://github.com/ELEVATE-Project/observation-survey-projects-pwa).
2. Go to the project folder using the below command.
    ```
    cd observation-survey-projects-pwa
    ```
3. Set the environment variables in the `src/env/env.js` file.
4. Run `npm i -f`.

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

### Setup and Configuration

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

### Environment Configuration

Update the environment configuration file:

```bash
cd src/assets/env/env.js
```

Configure the environment variables:

```javascript
window["env"] = {
   production: true,
   baseURL: '<BaseUrl>',
   projectsBaseURL: '<BaseUrl>',
   surveyBaseURL: '<BaseUrl>',
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

### Native Deployment

Deploy the portal to path at the URL https://xyz.com/ml/

1. **Configure Angular.json**
   ```bash
   cd projectpath/angular.json
   ```
   Add the following key-value pairs in `app.architect.build.options`:
   ```json
   "baseHref": "/ml/",
   "deployUrl": "/ml/"
   ```

2. **Install dependencies and build the project**
   ```bash
   npm install --force
   ```

3. **Build the project for production**
   ```bash
   ionic build --prod 
   ```

4. **Start the application using PM2**
   ```bash
   pm2 start pm2.config.json
   ```

### Docker Deployment

1. **Configure Angular.json**
   ```bash
   cd projectpath/angular.json
   ```
   Add the following key-value pairs in `app.architect.build.options`:
   ```json
   "baseHref": "/ml/",
   "deployUrl": "/ml/"
   ```

2. **Install Docker** (if not already installed)
   - Download and install Docker from https://www.docker.com/get-started/

3. **Navigate to the project directory**
   ```bash
   cd /path/to/project-directory
   ```

4. **Log in to Docker**
   ```bash
   docker login -u <email-id>
   ```

5. **Build the Docker image**
   ```bash
   docker build -t <image-name>:latest .
   ```
   Note: Ensure the `.` at the end is present — it refers to the current directory.

6. **Run the Docker container**
   ```bash
   docker run -p 8080:<container-port> <image-name>:latest
   ```
   Replace `<container-port>` with the port number exposed in the Dockerfile (refer to the Dockerfile to find the exposed port, e.g., EXPOSE 6006).