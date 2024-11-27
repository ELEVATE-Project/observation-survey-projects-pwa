import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-problem-statement',
  templateUrl: './add-problem-statement.page.html',
  styleUrls: ['./add-problem-statement.page.scss'],
})
export class AddProblemStatementPage implements OnInit {
  headerConfig:any = {
    showBackButton:true
  }
  showInput = false;
  problemStatement: string = '';
  selectedOption: string = '';
  options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  constructor() { }

  ngOnInit() {
  }
  toggleInput() {
    this.showInput = !this.showInput;
    if (!this.showInput) {
      this.problemStatement = ''; 
    }
  }
}
