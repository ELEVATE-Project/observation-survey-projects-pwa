import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectReportPage } from './project-report.page';

describe('ProjectReportPage', () => {
  let component: ProjectReportPage;
  let fixture: ComponentFixture<ProjectReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
