import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileImagePage } from './profile-image.page';

describe('ProfileImagePage', () => {
  let component: ProfileImagePage;
  let fixture: ComponentFixture<ProfileImagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
