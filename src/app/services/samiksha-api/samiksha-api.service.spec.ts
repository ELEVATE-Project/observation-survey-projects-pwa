import { TestBed } from '@angular/core/testing';

import { SamikshaApiService } from './samiksha-api.service';

describe('SamikshaApiService', () => {
  let service: SamikshaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SamikshaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
