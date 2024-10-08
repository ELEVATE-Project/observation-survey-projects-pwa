interface Environment {
  baseURL: string;
  production: boolean;
  surveyBaseURL?: string; 
  projectsBaseURL?:string;
}

//projects and survey for docker
export const environment:Environment = {
  production: true,
  baseURL: '<base-url>',
  projectsBaseURL: '<project-base-url>',
  surveyBaseURL: '<surveu-base-url>'
}

//projects and survey for docker
// export const environment:Environment = {
//   production: true,
//   baseURL: window['env' as any]['baseURL' as any] as unknown as string,
//   projectsBaseURL: '<project-base-url>',
//   surveyBaseURL: '<surveu-base-url>'
// }

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