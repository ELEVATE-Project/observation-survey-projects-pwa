import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyJourneysListingPage } from './my-journeys-listing.page';

describe('MyJourneysListingPage', () => {
  let component: MyJourneysListingPage;
  let fixture: ComponentFixture<MyJourneysListingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyJourneysListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
