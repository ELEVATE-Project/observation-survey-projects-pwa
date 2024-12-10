import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiDetailsPage } from './mi-details.page';

describe('MiDetailsPage', () => {
  let component: MiDetailsPage;
  let fixture: ComponentFixture<MiDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
