import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { catchError, BehaviorSubject } from 'rxjs';
import { AlertService } from './alert.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  // private reload = new BehaviorSubject<any>(false);

  constructor(private http:HttpClient, private alert:AlertService, private toastr:ToastrService, private router:Router) { }

  listPanel(data:any):any{
    this.http.post<any>(`${environment.baseUrl}/admin/create/panellist`, data, { observe: "response" }).subscribe((response: HttpResponse<any>) => {
      if (response && response.body) {
         this.alert.success('Panel Created Successfully.')
         this.router.navigate(['/admin-dashboard'])
      }
    });
  }

  fetchListedPanel(): Observable<any> {
     return this.http.get<any>(`${environment.baseUrl}/panel/all`);
  }

  fetchUserPanels():Observable<any>{
    return this.http.get<any>(`${environment.baseUrl}/admin/users_panel`);
  }

  loadImage(image_path:string):Observable<any>{
    return this.http.post<any>(`${environment.baseUrl}/load_image`, {
      "image_path":image_path
    });
  }



  deleteItem(itemId: number):Observable<any>{
    const url = `${environment.baseUrl}/admin/deletepanel/${itemId}`;
    return this.http.delete(url);

  }

  addBank(data: any): any {
    this.http.post<any>(`${environment.baseUrl}/admin/bankdetail/add`, data, { observe: "response" }).pipe(
      catchError(error => {
        this.alert.errorAlert(error.error.detail)
        throw error;
      })
    )
    .subscribe((response: HttpResponse<any>) => {
      if (response && response.body) {
         this.alert.success('Bank Added Successfully.')
      }
    });

  }


  approveOrReject(data:any){
    this.http.post<any>(`${environment.baseUrl}/admin/user_panel_action`, data, { observe: "response" }).pipe(
      catchError(error => {
        this.alert.errorAlert(error.error.detail)
        throw error;
      })
    )
    .subscribe((response: HttpResponse<any>) => {
      if (response && response.body) {
         this.alert.success(response.body.Message)
        //  this.reload.next(true);
      }
    });
  }

  // reloadData(){
  //  return this.reload.asObservable();
  // }


  getdepositRequests(){
    return this.http.get<any>(`${environment.baseUrl}/admin/user_requests`);
  }


  depositOrReject(data:any){
    this.http.post<any>(`${environment.baseUrl}/admin/user_requests/action`, data, { observe: "response" }).pipe(
      catchError(error => {
        this.alert.errorAlert(error.error.detail)
        throw error;
      })
    )
    .subscribe((response: HttpResponse<any>) => {
      if (response && response.body) {
        this.alert.success(response.body.detail)
        //  this.reload.next(true);
      }
    });
  }

  fetchBankDetails(){
    return this.http.get<any>(`${environment.baseUrl}/admin/bankdetail`);
  }



}
