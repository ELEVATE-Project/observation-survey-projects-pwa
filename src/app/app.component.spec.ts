// src/app/app.component.spec.ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';             // ①
import { of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    // ② Provide a fake SwUpdate
    const swUpdateMock = {
      isEnabled: false,
      available: of(),       // no updates
      activated: of(),       // no activations
      checkForUpdate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: SwUpdate, useValue: swUpdateMock },        // ③
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
