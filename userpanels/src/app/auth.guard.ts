import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { AuthserviceService } from './services/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthserviceService, private router: Router) { }

  
  canActivate(): boolean{
    if (this.authService.getIsLoggedIn()) {
      // If user is already logged in, redirect to home or dashboard
      this.router.navigate(['/home']); // Adjust this to your home or dashboard route
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  constructor(private authService: AuthserviceService, private router: Router, private toastr:ToastrService) {

   }

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
         return true
         
    }
    else{
      this.toastr.info('Unauthorized Access!')
    }
    return false
  }


}

@Injectable({
  providedIn: 'root'
})

export class RouteGuard implements CanActivate {

  constructor(private authService: AuthserviceService, private router: Router, private toastr:ToastrService) {

   }

  canActivate(): boolean {
      
      const accessToken = localStorage.getItem('access_token')
      const role=localStorage.getItem('role');
      
  
      if (accessToken && role==='User') {
        return true; // Allow access to the route
      } 
      else if(accessToken && role==='Admin'){
        return false
      }
      else {
        this.toastr.error('Please Login')
        return false; // Prevent access to the route
      }
  }


}