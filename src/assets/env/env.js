window["env"] = {
    production: true,
    baseURL: 'https://saas-qa.tekdinext.com',
    projectsBaseURL: 'https://saas-qa.tekdinext.com',
    surveyBaseURL: 'https://saas-qa.tekdinext.com',
    capabilities: 'all',
    restrictedPages: ['DOWNLOADS','AUTH_PAGES'],
    unauthorizedRedirectUrl: "/",
    isAuthBypassed: true,
    profileRedirectPath: "/profile-edit",
    showHeader: true,
    config:{
        logoPath:'assets/images/logo.png',
        faviconPath:'assets/icons/elevate-logo.png',
        title:"Elevate",
        redirectUrl:"/home"
    },
    hostPath:'/ml/'
};