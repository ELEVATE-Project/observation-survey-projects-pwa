import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import './jest-global-mocks';

declare global {
  interface Window {
    env: {
      baseURL: string;
      projectsBaseURL: string;
      surveyBaseURL: string;
      capabilities: string;
    };
  }
}

window.env = {
  baseURL: 'https://example.com',
  projectsBaseURL: 'https://example.com/projects',
  surveyBaseURL: 'https://example.com/survey',
  capabilities: 'all'
}; 


setupZoneTestEnv();
