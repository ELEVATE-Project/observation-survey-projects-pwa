import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VeiwDetailsPage } from './veiw-details.page';

describe('VeiwDetailsPage', () => {
  let component: VeiwDetailsPage;
  let fixture: ComponentFixture<VeiwDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VeiwDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
