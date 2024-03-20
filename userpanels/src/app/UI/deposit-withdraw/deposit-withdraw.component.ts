import { Component} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import {PanelserviceService} from "../../services/panelservice.service";
import {HttpResponse} from "@angular/common/http";
import { data } from 'jquery';

@Component({
  selector: 'app-deposit-withdraw',
  templateUrl: './deposit-withdraw.component.html',
  styleUrls: ['./deposit-withdraw.component.css']
})
export class DepositWithdrawComponent {
  cardForm!: FormGroup;
  panel_id!:number
  type!:string
  panel!:any
  panel_data:any;

  constructor(private fb: FormBuilder, private router:Router, private activatedRoute: ActivatedRoute,
              private pservice:PanelserviceService) { }
  

  ngOnInit(){

    this.cardForm = this.fb.group({
      coinField: ['', [
        Validators.required,
        Validators.min(100),
        Validators.max(10000000)
      ]]
    });


    this.activatedRoute.params.subscribe(params => {
      this.type = params["type"]
      this.panel_id =  parseInt(params['id']);
    });

    this.pservice.fetchMyPanelById(this.panel_id).subscribe((response: HttpResponse<any>)=>{
      if (response){
        this.panel = response
      }
    })


  }



  get coinField() {
    return this.cardForm.get('coinField');
  }


  onSubmit() {
    if (this.cardForm.valid) {
      this.router.navigate(['payment'], { state: { depositData:{
        panel_id:this.panel_id,
        action_type: this.capitalizeFirstLetter(this.type),
        total_coin:this.cardForm.value.coinField
      } } });
    } else {
      console.log('Form submission failed. Please check the form.');
    }
  }


   capitalizeFirstLetter(text:string):string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
