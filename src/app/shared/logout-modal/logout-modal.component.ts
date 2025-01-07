import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db/db.service';

@Component({
  selector: 'app-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss'],
})
export class LogoutModalComponent  {
  unSyncedDataList:any = []

  constructor(private modalCtrl: ModalController, private dbService: DbService) {}

  async ngOnInit(){
    await this.dbService.openDatabase();
    let fetchedList = await this.dbService.getAllTransactions()
    this.unSyncedDataList = fetchedList.filter((data:any)=>{ return data.data.isEdit })
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(true, 'confirm');
  }
}
