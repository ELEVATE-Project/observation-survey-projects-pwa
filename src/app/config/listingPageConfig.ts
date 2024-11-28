import urlConfig from 'src/app/config/url.config.json';

export const listingConfig = {
    explore: {
        apiUrl: "/project/v1/library/categories/projects/educationLeader",
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
    }
}