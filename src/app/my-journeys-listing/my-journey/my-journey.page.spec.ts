import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyJourneyPage } from './my-journey.page';

describe('MyJourneyPage', () => {
  let component: MyJourneyPage;
  let fixture: ComponentFixture<MyJourneyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyJourneyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
