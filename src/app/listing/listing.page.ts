import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  jsonData:any;

  constructor(private http: HttpClient) { 
  }

  ngOnInit() {
    this.http.get<any>('assets/data.json').subscribe(data => {
      this.jsonData = data;
    });
  }

}
