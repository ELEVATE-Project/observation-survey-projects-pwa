import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import urlConfig from 'src/app/config/url.config.json';
import { ProjectsApiService } from 'src/app/services/projects-api/projects-api.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent  implements OnInit {
  filterList:any = []
  filterForm: FormGroup = this.fb.group({})
  @Output() onClose = new EventEmitter();

  constructor(private fb: FormBuilder, private menuControl: MenuController, private apiService: ProjectsApiService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.getFilterList()
  }

  getFilterList(){
    this.apiService.get(`${urlConfig.project.filterUrl}?language=en`).subscribe({
      next: (response: any)=>{
        if(response.status == 200){
          this.filterList = response.result
          this.createForm()
        }
      },
      error: (error:any)=>{
        this.toastService.presentToast(error.error.message, 'danger')
      }
    })
  }

  createForm(){
    const formControls = this.filterList.reduce((controls:any, section:any) => {
      controls[section.code] = this.fb.array([]);
      return controls;
    }, {});
    
    this.filterForm = this.fb.group(formControls);
  }

  onCheckboxChange($event:any, option:any, name: any){
    const currentControl = this.filterForm.get(name) as FormArray;
    if($event.checked){
      currentControl.push(this.fb.control(option));
    }else{
      const index = currentControl.controls.findIndex(
        control => control.value.value === option.value
      );
      if(index !== -1){
        currentControl.removeAt(index);
      }
    }
  }

  applyFilter(){
    const selectedValues:any = {};
    this.filterList.forEach((section:any)=> {
      const sectionName = section.code
      selectedValues[sectionName] = this.filterForm.get(sectionName)?.value;
    });
    this.closeFilter()
  }

  clearFilter(){
    this.filterList.forEach((section: any) => {
      const control = this.filterForm.get(section.code) as FormArray;
      control.clear();
    });  
  }

  closeFilter(){
    const formattedData: any = {}
    let selectedFilterValues = this.filterForm.value
    Object.keys(selectedFilterValues).forEach((key) => {
      formattedData[key] = selectedFilterValues[key].map((item: any) => item.value).join(",")
    });
    this.onClose.emit(formattedData)
    this.menuControl.close()
  }
}