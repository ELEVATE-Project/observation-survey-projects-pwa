import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservationPage } from './observation.component';

describe('ObservationPage', () => {
  let component: ObservationPage;
  let fixture: ComponentFixture<ObservationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
