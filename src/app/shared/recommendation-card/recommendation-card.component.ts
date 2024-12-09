import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendation-card',
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.scss'],
})
export class RecommendationCardComponent  implements OnInit {
  @Input() type:any = 'explore';
  @Input() cardData: any
  imageFormats = ["jpg", "png", "jpeg", "gif", "tiff", "tif", "webp"]
  cardImage = "assets/MI-2.0-card-images/recommended-bg.png"

  constructor(private router: Router) { }

  ngOnInit() {
    let evidenceListOne = this.cardData?.evidences || []
    let evidenceListTwo = this.cardData?.categories ? this.cardData.categories.flatMap((data:any) => data.evidences ?? []) : []
    let evidenceList = [...evidenceListTwo, ...evidenceListOne]
    let image = evidenceList.find((data:any) => this.imageFormats.includes(data.type))
    if(image){
      this.cardImage = image.downloadableUrl
    }
  }

  redirect(){
    if(this.type === 'explore'){
      this.router.navigate(["mi-details",this.cardData._id ])
    }
    else if(this.type === 'journey'){
      this.router.navigate([])
    }
  }

}