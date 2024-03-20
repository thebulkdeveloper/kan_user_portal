import { Component } from '@angular/core';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css']
})
export class AllusersComponent {
   
    users:any[]=[];

    constructor(private authService:AuthserviceService){}

    ngOnInit(){
         this.authService.getAllUsers().subscribe((data)=>{
          this.users=data
         })
    }


}
