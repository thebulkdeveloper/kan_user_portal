import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  createAlert() {
    Swal.fire({
      icon: 'success',
      title: 'Request Placed',
      text: 'Your request has been successfully placed.We will shortly confirm the status.',
    });
  }

  success(text:string){
    Swal.fire({
      icon:'success',
      text:text
    })
  }

  copied(text:string){
    Swal.fire({
      position: 'center',
      icon: 'success',
      text:text,
      showConfirmButton: false,
      timer: 1500
  });
  }

  errorAlert(error:any){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text:error
    });
  }
}
