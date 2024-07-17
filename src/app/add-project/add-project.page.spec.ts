import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProjectPage } from './add-project.page';

describe('AddProjectPage', () => {
  let component: AddProjectPage;
  let fixture: ComponentFixture<AddProjectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
