import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AlertService } from './alert.service';
@Injectable({
  providedIn: 'root'
})
export class PanelserviceService {

  constructor(private http:HttpClient, private toastr:ToastrService , private router:Router,
    private alert:AlertService) { }



  fetchPanelData(type:string): Observable<any> {
    if (type === 'All Sites') {
      return this.http.get<any>(`${environment.baseUrl}/panel/all`);
    } else {
      return this.http.get<any>(`${environment.baseUrl}/panel/all?type=${type}`);
    }
  }

  fetchDropDown():Observable<any>{
    return this.http.get<any>(`${environment.baseUrl}/panel/types/all`)
  }

  getDataById(id:number){
    return this.http.get<any>(`${environment.baseUrl}/panel/${id}`);
  }

  createPanel(data: any): any {
    this.http.post<any>(`${environment.baseUrl}/panel/create/new`, data, { observe: "response" }).pipe(
      catchError(error => {
        this.alert.errorAlert(error.error.detail)
        throw error;
      })
    )
    .subscribe((response: HttpResponse<any>) => {
      if (response && response.body) {
         this.alert.createAlert()
         this.router.navigate(['/panels'])
      }
    });

  }



  public paymentInfo(user_account:boolean):Observable<any>{
    return this.http.get(`${environment.baseUrl}/bankdetails?user_account=${user_account}`);
  }


  fetchMyPanel(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/panel/mypanel/all`);
  }

  fetchMyPanelById(id:number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/panel/mypanel/single/${id}`);
  }

  fetchPassBook():Observable<any>{
     return this.http.get<any>(`${environment.baseUrl}/passbook`);
    }
   
  fetchNotification():Observable<any>{
    return this.http.get<any>(`${environment.baseUrl}/notification`);
  }


  depositFromMyPanel(data:any):any{
    this.http.post<any>(`${environment.baseUrl}/my_panel_actions`, data, { observe: "response" }).pipe(
      catchError(error => {
        this.alert.errorAlert(error.error.detail)
        throw error;
      })
    )
    .subscribe((response: HttpResponse<any>) => {
      if (response && response.body) {
        this.alert.success(response.body.message)
         this.router.navigate(['/panels'])
      }
    });

  }


  addUserBank(data:any):any{
    this.http.post<any>(`${environment.baseUrl}/bankaccount`, data, { observe: "response" }).pipe(
      catchError(error => {
        this.alert.errorAlert(error.error.detail)
        throw error;
      })
    )
    .subscribe((response: HttpResponse<any>) => {
      if (response && response.body) {
        this.alert.success(response.body.message)
        window.location.reload()
      }
    });


 
  }

}
