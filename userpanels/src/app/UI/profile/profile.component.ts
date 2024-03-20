import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthserviceService } from 'src/app/services/authservice.service';

interface Profile {
  id: number;
  mobile: string;
  name: string;
  image: string;
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profile: Profile | undefined;

  constructor(private authService:AuthserviceService) { }

  ngOnInit(): void {
    this.fetchProfileData();
  }

  fetchProfileData() {
    this.authService.getUserDetails().subscribe(
      userData=>{
        this.profile=userData
      }, 
      error=>{
        console.error('Error', error)
      }
    )
  }
}
