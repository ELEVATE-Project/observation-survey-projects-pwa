interface Environment {
  baseURL: string;
  production: boolean;
  surveyBaseURL?: string;
  projectsBaseURL?:string;
  capabilities:'all' | 'project' | 'survey';
  restrictedPages: any,
  unauthorizedRedirectUrl:string
  isAuthBypassed: any,
  config:any,
  profileRedirectPath: any,
  showHeader:any,
  hostPath?: string;
}

//projects and survey for non-docker
// export const environment:Environment = {
//   production: true,
//   baseURL: '<base-url>',
//   projectsBaseURL: '<project-base-url>',
//   surveyBaseURL: '<survey-base-url>'
// }s

//projects and survey for docker
export const environment:Environment = {
  production: true,
  baseURL: window['env' as any]['baseURL' as any] as unknown as string,
  projectsBaseURL: window['env' as any]['projectsBaseURL' as any] as unknown as string,
  surveyBaseURL: window['env' as any]['surveyBaseURL' as any] as unknown as string,
  capabilities:window['env' as any]['capabilities' as any] as unknown as any,
  restrictedPages: window['env' as any]['restrictedPages' as any],
  unauthorizedRedirectUrl: window['env' as any]['unauthorizedRedirectUrl' as any] as unknown as string,
  isAuthBypassed: window['env' as any]['isAuthBypassed' as any] as unknown as any,
  config: window['env' as any]['config' as any] as unknown as any,
  profileRedirectPath: window['env' as any]['profileRedirectPath' as any] as unknown as any,
  showHeader: window['env' as any]['showHeader' as any] as unknown as any,
  hostPath: window['env' as any]['hostPath' as any] as unknown as string
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