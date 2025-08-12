import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateVerifyPage } from './certificate-verify.page';

describe('CertificateVerifyPage', () => {
  let component: CertificateVerifyPage;
  let fixture: ComponentFixture<CertificateVerifyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateVerifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
