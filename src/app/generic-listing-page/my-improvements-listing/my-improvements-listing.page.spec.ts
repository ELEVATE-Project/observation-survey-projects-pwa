import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyImprovementsListingPage } from './my-improvements-listing.page';

describe('MyImprovementsListingPage', () => {
  let component: MyImprovementsListingPage;
  let fixture: ComponentFixture<MyImprovementsListingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyImprovementsListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
