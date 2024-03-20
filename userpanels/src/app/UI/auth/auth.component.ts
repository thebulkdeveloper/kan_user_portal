import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  
  showLogin: boolean = true;

  constructor(private authService: AuthserviceService, private router: Router, private toastr:ToastrService) {}

  openLogin() {
    this.showLogin = true;
  }

  openSignUp() {
    this.showLogin = false;
  }

  RegisterformData = {
    mobile: '',
    name: '',
    password_hash: '',
    role: 'User' // default value
  };

  LoginformData = {
    mobile: '',
    password_hash: '',
  };

  validateMobileLength(form: NgForm) {
    if (form.controls['mobile'].value && form.controls['mobile'].value.length !== 10) {
        form.controls['mobile'].setErrors({ 'incorrect': true });
    } else {
        form.controls['mobile'].setErrors(null);
    }
  }


  onSubmitReg() {
    if (this.RegisterformData.mobile.length==10 && this.RegisterformData.name && this.RegisterformData.password_hash) {
      console.log(this.RegisterformData)
      this.authService.register(this.RegisterformData).pipe(
        catchError(error => {
          console.error('Registration failed:', error);
          this.toastr.error(error.error.detail);
          throw error; 
        })
      )
      .subscribe((response: HttpResponse<any>) => {
        if (response && response.body) {
          this.toastr.success('Registration Successful ! Please Login');
          this.router.navigate(['/login']);
          this.showLogin=!this.showLogin
        }
      });
      
    } else {
      console.error('RegisterformData is empty');
    }
  }

  onSubmitLog() {
    if (this.LoginformData.mobile && this.LoginformData.password_hash) {
      console.log(this.LoginformData);
      this.authService.login(this.LoginformData);
    } else {
      console.error('LoginformData is empty');
    }
  }
}
