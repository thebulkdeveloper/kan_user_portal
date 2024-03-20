import { Component } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service.service';

@Component({
  selector: 'app-view-bank',
  templateUrl: './view-bank.component.html',
  styleUrls: ['./view-bank.component.css']
})
export class ViewBankComponent {
  
  bankInfo:any[]=[];

  constructor(private adminService:AdminServiceService){}


  ngOnInit(){
    this.adminService.fetchBankDetails().subscribe((data)=>{
      this.bankInfo=data;
      console.log(this.bankInfo)
    })
  }


}
