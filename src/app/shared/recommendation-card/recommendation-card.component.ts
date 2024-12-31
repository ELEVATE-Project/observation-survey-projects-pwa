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
    if(this.type == "recommendation"){
      this.cardData.title = this.cardData.actual_title || this.cardData.expected_title
      this.cardData.duration = this.cardData.actual_duration || this.cardData.expected_duration
    }
    let evidenceListOne = this.cardData?.evidences || []
    let evidenceListTwo = this.cardData?.categories ? this.cardData.categories.flatMap((data:any) => data.evidences ?? []) : []
    let evidenceList = [...evidenceListOne, ...evidenceListTwo]
    let image = evidenceList.find((data:any) => this.imageFormats.includes(data.type))
    if(image){
      this.cardImage = image.downloadableUrl
    }
  }

  redirect(){
    if(this.type === 'journey'){
      this.router.navigate(["project-details"],{ state: { _id: this.cardData._id } })
    }else if(this.type === 'recommendation'){
      this.router.navigate(["mi-details/recommendation",this.cardData.id])
    }else{
      this.router.navigate(["mi-details",this.cardData._id ])
    }
  }

}