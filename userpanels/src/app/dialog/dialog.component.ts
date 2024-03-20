import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from '../services/admin-service.service';
import {environment} from "../../environments/environment.development";
import { ToastrService } from 'ngx-toastr';
import { PanelserviceService } from '../services/panelservice.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
   
  transactionForm!: FormGroup;
  depositForm!:FormGroup;
  image_url!:string;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,private formBuilder: FormBuilder, private adminService:AdminServiceService, private toastr:ToastrService,
  private panelService:PanelserviceService)
  { }

   onCloseClick() {
    this.dialogRef.close('closed');
  }



  ngOnInit() {
    this.transactionForm = this.formBuilder.group({
      transactionId: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });

    this.depositForm = this.formBuilder.group({
      transactionId: ['', Validators.required],
      username: ['', Validators.required],
      amount:[{value:0}],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });


    if(this.data?.screenshot!=undefined)
      this.image_url = `${environment.baseUrl}/${this.data?.screenshot}`
    else{
      this.image_url = `${environment.baseUrl}/${this.data?.bank_image_url}`
    }

    
    this.depositForm.get('amount')?.setValue(this.data?.amount);
    this.depositForm.get('username')?.setValue(this.data?.username);
    this.depositForm.get('password')?.setValue(this.data?.password);

  }



  onSubmit() {
    if (this.transactionForm.valid) {

      let approveForm={
        'id':this.data.id,
        'status':'Approved',
        'amount':this.data.amount,
        'transaction_id':this.transactionForm.get('transactionId')?.value,
        'updated_user_id':this.transactionForm.get('username')?.value,
        'updated_user_password':this.transactionForm.get('password')?.value
      }

      this.adminService.approveOrReject(approveForm);
    }

    if (this.depositForm.valid) {
      const newdepositForm=new FormData();
      newdepositForm.append('pid', this.data.passbook_id)
      newdepositForm.append('action_type', 'Approved')
      newdepositForm.append('username', this.depositForm.get('username')?.value)
      newdepositForm.append('password', this.depositForm.get('password')?.value)
      newdepositForm.append('amount', this.depositForm.get('amount')?.value)
      newdepositForm.append('transaction_id', this.depositForm.get('transactionId')?.value)
      this.adminService.depositOrReject(newdepositForm);
    }


  }

  onReject(){

    if(this.data.dataType=='userPanelData'){
         let rejectForm={
        'id':this.data.id,
        'status':'Rejected',
        'amount':this.data.amount,
        'transaction_id':this.transactionForm.get('transactionId')?.value,
        'updated_user_id':this.data.username,
        'updated_user_password':this.transactionForm.get('password')?.value
    }
    this.adminService.approveOrReject(rejectForm)
    }
    

    if(this.data.dataType=='userRequest'){
      const newdepositForm=new FormData();
      newdepositForm.append('pid', this.data.passbook_id)
      newdepositForm.append('action_type', 'Rejected')
      newdepositForm.append('username', this.data.username)
      newdepositForm.append('password', this.data.password)
      newdepositForm.append('amount',this.data.amount)

      this.adminService.depositOrReject(newdepositForm);
    }

  }


  protected readonly environment = environment;

  
}
