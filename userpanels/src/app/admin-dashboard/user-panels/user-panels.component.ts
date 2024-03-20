import { Component } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent} from 'src/app/dialog/dialog.component';

@Component({
  selector: 'app-user-panels',
  templateUrl: './user-panels.component.html',
  styleUrls: ['./user-panels.component.css']
})
export class UserPanelsComponent {
    
  userData: any[] = [];

  constructor(private adminService: AdminServiceService, private dialog: MatDialog) {}

  ngOnInit() {
    this.userPanelData();

  }

  userPanelData() {
    this.adminService.fetchUserPanels().subscribe((data) => {
      this.userData = data;
      console.log(this.userData)
    });
  }

  openDialog(data:any) { 
    const dialogRef = this.dialog.open(DialogComponent, {
      data:{...data,
      dataType:'userPanelData'}
    });

    dialogRef.afterClosed().subscribe(result => {
       this.userPanelData()
    });
  }




}
