import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDetailsPage } from './view-details.page';

describe('VeiwDetailsPage', () => {
  let component: ViewDetailsPage;
  let fixture: ComponentFixture<ViewDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
