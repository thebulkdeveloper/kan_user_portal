import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { CartServiceService } from './cart-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  isLoggedIn: boolean = false;
  isLoggedInChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private http: HttpClient, private router: Router, private toastr:ToastrService,
    private cartService:CartServiceService) { }


  register(data: any): any {
    return this.http.post<any>(`${environment.baseUrl}/signup`, data, { observe: "response" })
  }

  login(data: any): void {
    this.http.post<any>(`${environment.baseUrl}/login`, data, { observe: "response" })
      .pipe(
        catchError(error => {
          this.toastr.error(error.error.detail);
          throw error;
        })
      )
      .subscribe((response: HttpResponse<any>) => {
        if (response && response.body) {
          localStorage.setItem('access_token', response.body.access_token)
          localStorage.setItem('role', response.body.role)
          localStorage.setItem('id', response.body.id)
          this.toastr.success('Login Successful');
          this.isLoggedIn = true;
          this.isLoggedInChange.emit(true);

          if(this.isAdmin()){
            this.router.navigate(['/admin-dashboard']);
          }
          else this.router.navigate(['/']);

        }
      });
  }

  logout() {
    const user_id:string|null = localStorage.getItem("id")
    this.http.post<any>(`${environment.baseUrl}/logout/${user_id}`, {}, {observe: "response"})
      .subscribe((response: any)=> {
        if (response && response.body){
          localStorage.clear();
          this.isLoggedIn = false;
          this.isLoggedInChange.emit(false);
          this.toastr.success(response.body.message)
          this.router.navigate(['/login']);
          this.cartService.clearCart();
        }else {
          this.toastr.error("Logout failed")
        }
      })

  }


    getIsLoggedIn(): boolean {
    return this.isLoggedIn=!!localStorage.getItem('access_token');
    }

    isAdmin():Boolean{
       if(localStorage.getItem('role')==='Admin'){
        return true
       }
       return false
    }


    getUserDetails(): Observable<any> {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });

      return this.http.get<any>(`${environment.baseUrl}/me`, { headers });
    }

    getAllUsers(){
      return this.http.get<any>(`${environment.baseUrl}/admin/users`)
    }

    getAdminDetails(){
      return this.http.get<any>(`${environment.baseUrl}/admin/me`);
    }



}
