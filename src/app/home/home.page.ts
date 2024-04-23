import { Component, OnInit, TemplateRef, ViewChild  } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { HttpClient } from '@angular/common/http';
register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  swiperModules = [IonicSlides];
  popular: any[] = [];
  recent: any[] = [];
  jsonData:any;
  selectedSegment:any

  constructor(private http: HttpClient) { 
  }

  ngOnInit() {
    this.http.get<any>('assets/data.json').subscribe(data => {
      this.jsonData = data; // Assign the fetched data to the property
    });
    this.popular = [
      { id: 1, company: 'Technyks LLC', location: 'New Delhi', expires_on: '30/11/23', post: 'Senior UX Designer', type: 'Full Time', salary: '$40-90k/year', logo_dark: 'ct_dark.png', logo_light: 'ct_light.png' },
      { id: 2, company: 'Uber Technologies', location: 'Bangalore', expires_on: '07/12/23', post: 'Full-Stack Developer', type: 'Full Time', salary: '$30-80k/year', logo_dark: 'uber_dark.png', logo_light: 'uber_light.png' },
      { id: 3, company: 'LinkedIn Corp.', location: 'Mumbai', expires_on: '15/12/23', post: 'Lead UX Designer', type: 'Full Time', salary: '$30-70k/year', logo_dark: 'linkedin_dark.png', logo_light: 'linkedin_light.png' },
    ];
    this.recent = [
      { id: 4, company: 'TikTok', location: 'New Delhi', expires_on: '30/11/23', post: 'Senior UX Designer', type: 'Full Time', salary: '$40-90k/year', logo_dark: 'tiktok_dark.png', logo_light: 'tiktok_light.png' },
      { id: 2, company: 'Uber Technologies', location: 'Bangalore', expires_on: '07/12/23', post: 'Full-Stack Developer', type: 'Full Time', salary: '$30-80k/year', logo_dark: 'uber_dark.png', logo_light: 'uber_light.png' },
      { id: 3, company: 'LinkedIn Corp.', location: 'Mumbai', expires_on: '15/12/23', post: 'Lead UX Designer', type: 'Full Time', salary: '$30-70k/year', logo_dark: 'linkedin_dark.png', logo_light: 'linkedin_light.png' },
    ];
  }



 // Define a mapping between types and their corresponding templates
 typeTemplateMapping: { [key: string]: TemplateRef<any> } = {};

 // Reference to template variables
 @ViewChild('bannerTemplate') bannerTemplate!: TemplateRef<any>;
 @ViewChild('productTemplate') productTemplate!: TemplateRef<any>;
 @ViewChild('recommendationTemplate') recommendationTemplate!: TemplateRef<any>;

 // Initialize the mapping in ngAfterViewInit
 ngAfterViewInit() {
   this.typeTemplateMapping = {
     "banner": this.bannerTemplate,
     "main": this.productTemplate,
     "Recommendation": this.recommendationTemplate
     // Add more types and their corresponding templates here
   };
 }
}
