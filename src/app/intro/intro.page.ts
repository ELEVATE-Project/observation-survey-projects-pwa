import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { DATA } from 'src/assets/config/website-data';
@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  formGroup!: FormGroup;
  isMobileView: boolean = false;
  authLabel = 'Login';
  data: any = DATA;

  constructor(
    private fb: FormBuilder,
    private platform: Platform,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.checkIfMobileView();
    this.platform.resize.subscribe(() => {
      this.checkIfMobileView();
    });
  }
  createForm(): void {
    if (!this.data.footer.footerForm) return;
    const controls: any = {};
    this.data.footer.footerForm.forEach((field: any) => {
      const validators = [];
      if (field.validators?.includes('required')) {
        validators.push(Validators.required);
      }
      if (field.validators?.includes('email')) {
        validators.push(Validators.email);
      }
      controls[field.formControlName] = ['', validators];
    });
    this.formGroup = this.fb.group(controls);
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      console.log('Form Submitted', this.formGroup.value);
    } else {
      console.log('Form Invalid');
    }
  }

  checkIfMobileView() {
    this.isMobileView = this.platform.width() < 576;
  }

  login() {
    this.router.navigate(['/auth/landing']);
  }
}
