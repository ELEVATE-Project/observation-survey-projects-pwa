import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProblemStatementPage } from './add-problem-statement.page';

describe('AddProblemStatementPage', () => {
  let component: AddProblemStatementPage;
  let fixture: ComponentFixture<AddProblemStatementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProblemStatementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
