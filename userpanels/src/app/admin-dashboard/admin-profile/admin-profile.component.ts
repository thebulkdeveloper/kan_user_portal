import { Component } from '@angular/core';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent {
     
     profile:any;


     constructor(private authService:AuthserviceService){}
     
     ngOnInit(){
      this.authService.getAdminDetails().subscribe(data=>{
         this.profile=data;
      })
     }
}
