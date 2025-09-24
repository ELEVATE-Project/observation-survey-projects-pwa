# Environment Variables Documentation

This document explains all the environment variables used in the `src/assets/env/env.js` file for the Elevate Projects PWA.

## Configuration Structure

The environment configuration is structured as a JavaScript object assigned to `window["env"]`. Below are the detailed explanations for each variable:

## Core Configuration Variables

### `production`
- **Type**: Boolean
- **Default**: `true`
- **Description**: Indicates whether the application is running in production mode. Set to `true` for production deployments and `false` for development.
- **Example**: `production: true`

### `baseURL`,`projectsBaseURL`,`surveyBaseURL`
- **Type**: String
- **Description**: The base URL for the main API endpoints. This is the root URL where your backend services are hosted.
- **Example**: `baseURL: 'https://api.example.com'`

## Feature Configuration

### `capabilities`
- **Type**: String
- **Default**: `'all'`
- **Description**: Defines what capabilities/features are available to users. Use 'all' to enable all features or specify specific capabilities.
- **Possible Values**: `'all'`, `'projects'`, `'surveys'`, `'observations'`
- **Example**: `capabilities: 'all'`

### `restrictedPages`
- **Type**: Array of Strings
- **Description**: List of page identifiers that should be restricted or hidden from users based on permissions.
- **Available Options**:
  - `'DOWNLOADS'` - Restricts access to downloads page
  - `'AUTH_PAGES'` - Restricts authentication-related pages
  - `'PROFILE'` - Restricts profile viewing
  - `'EDIT_PROFILE'` - Restricts profile editing
- **Example**: `restrictedPages: ['DOWNLOADS','AUTH_PAGES','PROFILE','EDIT_PROFILE']`

## Authentication & Navigation

### `unauthorizedRedirectUrl`
- **Type**: String
- **Default**: `"/"`
- **Description**: URL to redirect users when they don't have proper authorization or when session expires.
- **Example**: `unauthorizedRedirectUrl: "/login"`

### `isAuthBypassed`
- **Type**: Boolean
- **Default**: `true`
- **Description**: When set to `true`, bypasses authentication checks. Useful for demo environments or when using external authentication systems.
- **Example**: `isAuthBypassed: false`

### `profileRedirectPath`
- **Type**: String
- **Description**: The path where users should be redirected for profile-related actions like editing or viewing profile information.
- **Example**: `profileRedirectPath: "/profile/edit"`

### `showHeader`
- **Type**: Boolean
- **Default**: `true`
- **Description**: Controls whether the application header/navigation bar is displayed. Set to `false` to hide the header.
- **Example**: `showHeader: true`

## Application Branding Configuration

### `config`
- **Type**: Object
- **Description**: Contains application branding and visual configuration settings.

#### `config.logoPath`
- **Type**: String
- **Description**: Path to the application logo image file.
- **Example**: `logoPath: 'assets/images/logo.png'`

#### `config.faviconPath`
- **Type**: String
- **Description**: Path to the favicon image file displayed in browser tabs.
- **Example**: `faviconPath: 'assets/icons/elevate-logo.png'`

#### `config.title`
- **Type**: String
- **Description**: The application title displayed in browser tabs and headers.
- **Example**: `title: "Elevate"`

#### `config.redirectUrl`
- **Type**: String
- **Description**: Default URL to redirect users after successful login or when accessing the root path.
- **Example**: `redirectUrl: "/home"`

## Deployment Configuration

### `hostPath`
- **Type**: String
- **Description**: The base path where the application is hosted. Used when deploying to a subdirectory rather than root domain.
- **Example**: `hostPath: '/ml/'`
- **Note**: This should match the `baseHref` and `deployUrl` configured in angular.json

## Complete Configuration Example

```javascript
window["env"] = {
   production: true,
   baseURL: 'https://api.example.com',
   projectsBaseURL: 'https://api.example.com',
   surveyBaseURL: 'https://api.example.com',
   capabilities: 'all',
   restrictedPages: ['DOWNLOADS','AUTH_PAGES','PROFILE','EDIT_PROFILE'],
   unauthorizedRedirectUrl: "/",
   isAuthBypassed: false,
   profileRedirectPath: "/profile/edit",
   showHeader: true,
   config:{
       logoPath:'assets/images/your-logo.png',
       faviconPath:'assets/icons/your-favicon.png',
       title:"Your App Name",
       redirectUrl:"/home"
   },
   hostPath:'/ml/'
};
```