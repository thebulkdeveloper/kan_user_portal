import { Component } from '@angular/core';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { PanelserviceService } from 'src/app/services/panelservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  myPanels:any[]=[];
   
  constructor(private authService: AuthserviceService, private panel:PanelserviceService) {}

  ngOnInit(){

    this.getMyPanels()

  }
  
  getMyPanels(){
    this.panel.fetchMyPanel().subscribe((data)=>{
      this.myPanels=data
    })
  }
}
