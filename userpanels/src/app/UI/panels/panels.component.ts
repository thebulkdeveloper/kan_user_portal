import { Component, Input, Output } from '@angular/core';
import { PanelserviceService } from 'src/app/services/panelservice.service';
import { catchError } from 'rxjs';
import { AlertService} from 'src/app/services/alert.service';

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.css']
})
export class PanelsComponent {


  panels: any[]=[];
  err:string='';
  dropdownData:any[]=[];
  selectedValue:string='All Sites';
  myPanels:any[]=[];

  @Input() tabs: { label: string}[];
  activeTab = 'Create Panel';

  constructor( private panelService:PanelserviceService, private alertService:AlertService) {
    this.tabs = [
      { label: 'My Panels'},
      { label: 'Create Panel'},
      // Add more tabs as needed
    ];
  }


  ngOnInit() {
      this.fetchData()
      this.panelService.fetchDropDown().subscribe((data)=>{
        this.dropdownData=data;
      })
  }

  onSelectChange(): void {
     this.fetchData();
  }


  fetchData() {
    this.panelService.fetchPanelData(this.selectedValue).subscribe(
      (response) => {
        this.panels = response;
      },
      (error) => {
        this.err=error.error.detail
      }
    );
  }


  onTabClick(tabLabel: string) {
    this.activeTab = tabLabel;
    this.fetchMyPanel()
  }

  trackByFn(index: number, item: { label: string}): number {
    return index;
  }


  fetchMyPanel(){
    this.panelService.fetchMyPanel().pipe(
      catchError(error => {
       this.err=error.error.detail
        throw error;
      })
    ).subscribe((data)=>{
      this.myPanels=data;
      console.log(data)
    })
  }

}
