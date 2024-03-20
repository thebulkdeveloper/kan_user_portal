import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { elementAt } from 'rxjs';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { PanelserviceService } from 'src/app/services/panelservice.service';

@Component({
  selector: 'app-create-panel',
  templateUrl: './create-panel.component.html',
  styleUrls: ['./create-panel.component.css']
})
export class CreatePanelComponent {
 
  registrationForm!: FormGroup;
  panel_id!:number;
  user_id!:number;
  readonly:boolean=false;
  panelData:any;
  title:any='Create Panel';


  constructor(private formBuilder: FormBuilder, private panelService:PanelserviceService,
    private route: ActivatedRoute, private router:Router, private authService:AuthserviceService,
    private cartService:CartServiceService,
    private toastr:ToastrService) {}

  ngOnInit() {

     
  
    this.fetchProfileData();
    this.registrationForm = this.formBuilder.group({
      user_id:[{value:null}],
      panel_id:[{value:null}],
      username: ['', Validators.required],
      password:['password'],
      amount: [0],
   
    });

    this.route.params.subscribe(params => {
      this.panel_id =  parseInt(params['id']);
      this.fetchPanelData(this.panel_id)
      this.registrationForm.get('panel_id')?.setValue(this.panel_id)
    });

  }

  fetchProfileData() {
    this.authService.getUserDetails().subscribe(
      userData=>{
        this.user_id=userData.id;
        this.registrationForm.get('user_id')?.setValue(this.user_id);
      }, 
      error=>{
        console.error('Error', error)
      }
    )
  }

  isFieldInvalid(fieldName: string) {
    const field = this.registrationForm.get(fieldName);
    return field?.invalid && (field?.touched || field?.dirty);
  }

  fetchPanelData(id:number){
      this.panelService.getDataById(id).subscribe(data=>{
        this.panelData=data;
        this.registrationForm.get('amount')?.setValue(this.panelData.amount);
      })
  }

  
    onSubmit() {
      if (this.registrationForm.valid) {
        console.log(this.registrationForm.value)
        this.router.navigate(['payment'], { state: { formData: this.registrationForm.value } });
      } else {
        this.registrationForm.markAllAsTouched();
      }
    }


    addToCart(): void {
       if(this.registrationForm.valid){

        let newFormData={
          ...this.registrationForm.value,
          'title':this.panelData.title,
          'exchange_url':this.panelData.exchange_url,
          'image':this.panelData.imageurl,
          'id':this.generateUniqueId()
         }
        this.cartService.addToCart(newFormData);
        this.toastr.success('Panel Added to Cart')
        this.router.navigate(['/cart'])
       }
       else{
        this.registrationForm.markAllAsTouched()
       }
    }

    private generateUniqueId(): string {
      return Date.now().toString();
    }



  }




