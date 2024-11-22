import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavePage } from './save.page';

describe('SavePage', () => {
  let component: SavePage;
  let fixture: ComponentFixture<SavePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
