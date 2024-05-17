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
  jsonData:any;
  typeTemplateMapping: { [key: string]: TemplateRef<any> } = {};
  @ViewChild('bannerTemplate') bannerTemplate!: TemplateRef<any>;
  @ViewChild('productTemplate') productTemplate!: TemplateRef<any>;
  @ViewChild('recommendationTemplate') recommendationTemplate!: TemplateRef<any>;

  constructor(private http: HttpClient) { 
  }

  ngOnInit() {
    this.http.get<any>('assets/listingData.json').subscribe(data => {
      this.jsonData = data;
      this.typeTemplateMapping = {
        "banner": this.bannerTemplate,
        "solutionList": this.productTemplate,
        "Recomendation": this.recommendationTemplate
      };
    });
  }
}