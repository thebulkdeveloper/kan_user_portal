import { Component } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent} from 'src/app/dialog/dialog.component';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {

  userDepositData:any[]=[];
  depositData:any;

  constructor(private adminService:AdminServiceService, private dialog: MatDialog){}

  ngOnInit(){
    this.getdepositData();
  }

  getdepositData(){
    this.adminService.getdepositRequests().subscribe((data)=>{
      this.userDepositData=data;
      console.log(this.userDepositData)
    })
  }


  
  openDialog(data:any) { 
    const dialogRef = this.dialog.open(DialogComponent, {
      data:{...data,
      dataType:'userRequest'}
    });

    dialogRef.afterClosed().subscribe(result => {
       this.getdepositData()
    });
  }

}
