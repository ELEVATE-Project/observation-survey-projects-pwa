export interface UrlConfig {
    survey: {
        listingUrl: string;
    };
    observation: {
        listingUrl: string;
    };
    project: {
        listingUrl: string;
    };
    formListing: {
        listingUrl: string;
    };
    entityListing: {
        listingUrl: string;
    };
    profileListing: {
        listingUrl: string;
    },
    report:{
        listingUrl: string;
    },
    program:{
        listingUrl: string;
    }
  }

export interface NavItem {
    label: string;
    icon: string;
    route: string;
    keepNavBar: boolean;
  }