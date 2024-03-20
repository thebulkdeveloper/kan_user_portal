import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthserviceService} from 'src/app/services/authservice.service';
import { PanelserviceService } from 'src/app/services/panelservice.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent} from 'src/app/dialog/dialog.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSidebarOpen = false;
  isLoggedIn: boolean = false;
  
  notifications: any[]=[];
  

  constructor(private authService: AuthserviceService, private  router:Router,
     private panelServiec:PanelserviceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.authService.isLoggedInChange.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });

  }


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

   logout() {
    this.authService.logout();
   }

  isHomeRoute(): boolean {
    return this.router.url === '/';
  }

  getCurrentRouteName(): string {
    return this.router.url;
  }

  getNotification(){
     this.panelServiec.fetchNotification().subscribe((data)=>{
      this.notifications=data;
     })
  }

  openDialog() { 
    this.getNotification()
    const dialogRef = this.dialog.open(DialogComponent, {
      data:{...this.notifications, dataType:'notification'}
    });

    dialogRef.afterClosed().subscribe(result => {
       this.getNotification()
    });
  }
  


}
