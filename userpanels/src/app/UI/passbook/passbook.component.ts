import { Component } from '@angular/core';
import { PanelserviceService } from 'src/app/services/panelservice.service';

@Component({
  selector: 'app-passbook',
  templateUrl: './passbook.component.html',
  styleUrls: ['./passbook.component.css']
})
export class PassbookComponent {

  passBook:any[]=[];

  constructor(private panelService:PanelserviceService){}

  ngOnInit(){
     this.passBookData()
  }

  passBookData(){
    this.panelService.fetchPassBook().subscribe((data)=>{
      this.passBook=data;
    })
  }

}
