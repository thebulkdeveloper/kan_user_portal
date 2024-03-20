import { Component } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { PanelserviceService } from 'src/app/services/panelservice.service';
import { environment } from 'src/environments/environment.development';
import { catchError } from 'rxjs';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

  formData: any;
  imageFile: File | null = null;
  payment_qr:string | null = null;
  bankDetails:any | null = null;
  show_upi: Boolean = true
  singleCartItem:any=null
  title:string='PAYMENT';
  DepositData:any=null;
  addUserBank:boolean=false;
  textToCopy='Text to copy';

  constructor(private route: ActivatedRoute, private toastr:ToastrService, private panelService:PanelserviceService,
    private cartService:CartServiceService) {}

  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      if(history.state.depositData){
        this.DepositData=history.state.depositData;
        console.log(this.DepositData)
        this.show_upi = parseInt(this.DepositData?.total_coin)<= 100000
        this.payment_qr = `${environment.baseUrl}/generate_qr_code?amount=${this.DepositData?.total_coin}&description=No%20Description`;
      }

      if(history.state.formData){
      this.formData = history.state.formData;
      this.show_upi = parseInt(this.formData?.amount)<= 100000
      console.log(this.formData)
      this.payment_qr = `${environment.baseUrl}/generate_qr_code?amount=${this.formData?.amount}&description=No%20Description`;
      }


    });
    
    const user_account = this?.DepositData?.action_type=="Withdraw"
    this.panelService.paymentInfo(user_account).pipe(
        catchError(error => {
        if(error.status==404){
          this.addUserBank=true;
        }
        throw error;
      })
    ).subscribe(paymentDetails=>{
      if (paymentDetails.length>0) {
        this.bankDetails = paymentDetails[0];
      }
    })

    this.route.queryParams.subscribe(params => {
      const itemId = params['cartId'];
      if (itemId) {
        this.singleCartItem = this.cartService.getCartItemById(itemId);
        this.show_upi = parseInt(this.singleCartItem?.amount)<= 100000
        this.payment_qr = `${environment.baseUrl}/generate_qr_code?amount=${this.singleCartItem?.amount}&description=No%20Description`;
      }
    });

  }

  handleImageFile(event: any) {
    this.imageFile = event.target.files[0];
  }
  


  onSubmit(){
    const newformData = new FormData();

    if(this.DepositData!==null && this.DepositData?.action_type==="Deposit"){
       if(this.imageFile!==null){
        newformData.append('user_panel_id', this?.DepositData.panel_id)
        newformData.append('amount', this?.DepositData.total_coin)
        newformData.append('action_type', this?.DepositData.action_type)
        newformData.append('payment_img',this?.imageFile)
        this.panelService.depositFromMyPanel(newformData);
       }
       else{
        this.toastr.warning('Screenshot Required')
       }
    }

    else if(this.DepositData!==null && this.DepositData?.action_type==="Withdraw"){
      newformData.append('user_panel_id', this?.DepositData.panel_id)
      newformData.append('amount', this?.DepositData.total_coin)
      newformData.append('action_type', this?.DepositData.action_type)
      this.panelService.depositFromMyPanel(newformData);
    }

    else{

      if(this.imageFile!==null){
        newformData.append('panel_id', this.formData?.panel_id || this.singleCartItem.panel_id)
        newformData.append('username', this.formData?.username || this.singleCartItem.username)
        newformData.append('password', this.formData?.password || this.singleCartItem.password)
        newformData.append('amount', this.formData?.amount || this.singleCartItem.amount)
        newformData.append('payment_img',this.imageFile)
        this.panelService.createPanel(newformData);
        this.cartService.removeFromCart(this.singleCartItem?.id)
      }
      else{
        this.toastr.warning('Screenshort Required')
      }

    }

   }


  protected readonly parent = parent;
  protected readonly parseInt = parseInt;
}
