import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from 'src/app/services/admin-service.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent {

   

  exchangeForm!: FormGroup;

  constructor(private fb: FormBuilder, private adminService:AdminServiceService) {}

  ngOnInit(): void {
    this.exchangeForm = this.fb.group({
      title: ['', Validators.required],
      exchange_url: ['', Validators.required],
      amount: ['', Validators.required],
      exchange_type: ['', Validators.required],
      imageurl: [''] // Not required
    });
  }

  onSubmit() {
     this.adminService.listPanel(this.exchangeForm.value)
  }

  isFieldInvalid(field: string) {
    const control = this.exchangeForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

}
