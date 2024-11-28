import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpotlightListingPage } from './spotlight-listing.page';

describe('SpotlightListingPage', () => {
  let component: SpotlightListingPage;
  let fixture: ComponentFixture<SpotlightListingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotlightListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
