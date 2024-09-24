import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateListingPage } from './certificate-listing.page';

describe('CertificateListingPage', () => {
  let component: CertificateListingPage;
  let fixture: ComponentFixture<CertificateListingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
