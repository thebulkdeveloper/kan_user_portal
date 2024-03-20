import { Component, ChangeDetectorRef } from '@angular/core';
import { PanelserviceService } from 'src/app/services/panelservice.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AdminServiceService } from 'src/app/services/admin-service.service';


@Component({
  selector: 'app-mypanels',
  templateUrl: './mypanels.component.html',
  styleUrls: ['./mypanels.component.css']
})
export class MypanelsComponent {

    panels:any[]=[];
        
    constructor(private adminService:AdminServiceService, private toastr:ToastrService, private cdRef: ChangeDetectorRef){}

    ngOnInit(){
      this.allPanels()
    }

    allPanels(){
       this.adminService.fetchListedPanel().subscribe((data)=>{
        this.panels=data;
       })
    }

    deletePanel(itemId:number) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.adminService.deleteItem(itemId).subscribe(
            () => {
              Swal.fire(
                'Deleted!',
                'Your item has been deleted.',
                'success'
              );
              window.location.reload()
            },
            error => {
              Swal.fire(
                'Error!',
                'An error occurred while deleting the item.',
                'error'
              );
            }
          );
        }
      });
    }


}
