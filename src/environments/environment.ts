interface Environment {
  baseURL: string;
  production: boolean;
}

//projects and survey for non-docker
// export const environment:Environment = {
//   production: true,
//   baseURL: '<base-url>',
//   projectsBaseURL: '<project-base-url>',
//   surveyBaseURL: '<survey-base-url>'
// }

//projects and survey for docker
export const environment:Environment = {
  production: true,
  baseURL: window['env' as any]['baseURL' as any] as unknown as string,
}

//survey-only

// export const environment = {
//   production: true,
//   baseURL: "<survey-base-url>"
// };

//projects-only

// export const environment = {
//   production: true,
//   baseURL: "<projects-base-url>"
// };