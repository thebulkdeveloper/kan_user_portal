import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { PanelserviceService } from 'src/app/services/panelservice.service';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.css']
})
export class AddBankComponent {
  

  @Input() addUserBank:boolean=false;

  bankForm!:FormGroup


  constructor(private fb: FormBuilder, private adminService:AdminServiceService,
    private panel:PanelserviceService) {}

  ngOnInit(){

    this.bankForm = this.fb.group({
      bank_name: ['', Validators.required],
      acc_no: ['', [Validators.required]],
      ifsc_code: ['', [Validators.required]],
      upi_id: ['', [Validators.required]]
    });

  
  }

  onSubmit() {

    if (this.bankForm.valid) { 
       
      if(this.addUserBank==true){
        let formData=new FormData();
        formData.append('bank_name', this.bankForm.get('bank_name')?.value)
        formData.append('acc_no', this.bankForm.get('acc_no')?.value);
        formData.append('ifsc_code', this.bankForm.get('ifsc_code')?.value);
        formData.append('upi_id', this.bankForm.get('upi_id')?.value);
        this.panel.addUserBank(formData)
        
      }
      else{
        let formData=new FormData();
        formData.append('bank_name', this.bankForm.get('bank_name')?.value)
        formData.append('acc_no', this.bankForm.get('acc_no')?.value);
        formData.append('ifsc_code', this.bankForm.get('ifsc_code')?.value);
        formData.append('upi_id', this.bankForm.get('upi_id')?.value);
        this.adminService.addBank(formData);
      }



    } else {
      this.bankForm.markAllAsTouched();
    }
 }

}
