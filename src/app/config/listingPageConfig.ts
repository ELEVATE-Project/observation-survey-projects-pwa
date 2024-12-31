import urlConfig from 'src/app/config/url.config.json';

export const listingConfig = {
    explore: {
        apiUrl: urlConfig.project.exploreListingUrl,
        enableSearch: true,
        headerConfig: {
            title:'EXPLORE',
            customActions: [{ icon: 'options-outline', actionName: 'filter' }],
        },
        enableFilter: true
    },
    saved: {
        apiUrl: urlConfig.project.savedListUrl,
        enableSearch: false,
        headerConfig: {
            title:'SAVED',
            showBackButton:true
        }
    },
    recommendations : {
        apiUrl: urlConfig.recommendation.listingUrl,
        enableSearch: false,
        headerConfig: {
            title:'RECOMMENDATIONS',
            showBackButton : true
        },
        type: "recommendation"
    }
}