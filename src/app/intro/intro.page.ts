import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from 'authentication_frontend_library';
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
  logoutHanldler:any;

  constructor(
    private fb: FormBuilder,
    private platform: Platform,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.logoutHanldler = this.handleMessage.bind(this);
      window.addEventListener('message', this.logoutHanldler);
    this.createForm();
    this.checkIfMobileView();
    this.platform.resize.subscribe(() => {
      this.checkIfMobileView();
    });
  }

  async handleMessage(event: MessageEvent){
    if(event.data.msg){
      this.checkAuthLabel();
    }
  }

  ionViewWillEnter(){
    this.checkAuthLabel();
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

checkAuthLabel(): void {
    const userData = localStorage.getItem('name');
    this.authLabel = userData ? 'Logout' : 'Login';
  }

 async authentication(){
    if(this.authLabel === 'Login'){
      this.router.navigate(['/login']);
    }
    else{
    this.authService.logout();
    }
  }

  onClick(action: any) {
    if (action?.url) {
      this.router.navigate([action.url]);
    }
  }

  ngOnDestroy(): void {
        window.removeEventListener('message', this.logoutHanldler);
  }
}
