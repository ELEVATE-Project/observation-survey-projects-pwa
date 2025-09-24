# Environment Variables Documentation

This document explains all the environment variables used in the `src/assets/env/env.js` file for the Elevate Projects PWA.

---

## Sample Configuration

```javascript
window["env"] = {
   production: true,
   baseURL: 'https://api.example.com',
   capabilities: 'all',
   restrictedPages: ['DOWNLOADS','AUTH_PAGES','PROFILE','EDIT_PROFILE'],
   unauthorizedRedirectUrl: "/",
   isAuthBypassed: false,
   profileRedirectPath: "/profile/edit",
   showHeader: true,
   config: {
       logoPath: 'assets/images/your-logo.png',
       faviconPath: 'assets/icons/your-favicon.png',
       title: "Your App Name",
       redirectUrl: "/home"
   },
   hostPath: '/ml/'
};
```

## Configuration Variables

| Variable | Type | Default | Description | Example |
|----------|------|---------|-------------|---------|
| **production** | Boolean | `true` | Defines if app is in production mode. `true` for production, `false` for development. | `production: true` |
| **baseURL** | String | - | Base URL of backend API services. | `'https://api.example.com'` |
| **capabilities** | String | `'all'` | Defines available features/capabilities for users. | `'all'`, `'projects'`, `'surveys'`, `'observations'` |
| **restrictedPages** | Array of Strings | `[]` | Pages restricted/hidden based on user permissions. **Available options:** [See pageIds.ts](./src/app/core/constants/pageIds.ts) | `['DOWNLOADS','PROFILE']` |
| **unauthorizedRedirectUrl** | String | `"/"` | URL to redirect unauthorized users or on session expiry. | `"/login"` |
| **isAuthBypassed** | Boolean | `false` | Bypasses authentication checks. Useful for demo/testing. | `false` |
| **profileRedirectPath** | String | - | Path where users go for profile actions (view/edit). | `"/profile/edit"` |
| **showHeader** | Boolean | `true` | Controls visibility of app header/navigation bar. | `true` |
| **config.logoPath** | String | - | Path to app logo image. | `'assets/images/logo.png'` |
| **config.faviconPath** | String | - | Path to favicon shown in browser tab. | `'assets/icons/elevate-logo.png'` |
| **config.title** | String | - | Application title shown in browser/tab headers. | `"Elevate"` |
| **config.redirectUrl** | String | - | Default landing page after login/root access. | `"/home"` |
| **hostPath** | String | `'/'` | Base path where app is hosted (useful for subdirectory deployment). Must match `baseHref` & `deployUrl` in `angular.json`. | `'/ml/'` |

