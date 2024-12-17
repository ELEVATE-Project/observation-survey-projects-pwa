import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewStoryPage } from './view-story.page';

describe('VeiwDetailsPage', () => {
  let component: ViewStoryPage;
  let fixture: ComponentFixture<ViewStoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
