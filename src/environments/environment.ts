interface Environment {
  baseURL: string;
  production: boolean;
  samikshaBaseURL?: string; 
  projectsBaseURL?:string;
}

//projects and survey
export const environment:Environment = {
  production: true,
  baseURL: "https://project-dev.elevate-apis.shikshalokam.org",
  // "projectsBaseURL": "https://project-dev.elevate-apis.shikshalokam.org",
  // "samikshaBaseURL": "https://survey-dev.elevate-apis.shikshalokam.org"
}

//survey-only

// export const environment = {
//   production: true,
//   baseURL: "<survey-baseUrl>"
// };

//projects-only

// export const environment = {
//   production: true,
//   baseURL: "<projects-baseUrl>"
// };