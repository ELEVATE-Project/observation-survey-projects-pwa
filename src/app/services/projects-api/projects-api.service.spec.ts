import { TestBed } from '@angular/core/testing';

import { ProjectsApiService } from './projects-api.service';

describe('ProjectsApiService', () => {
  let service: ProjectsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
