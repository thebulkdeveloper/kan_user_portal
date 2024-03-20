import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { PanelserviceService } from 'src/app/services/panelservice.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: any[] = [];

  constructor(private cartService:CartServiceService, private toastr:ToastrService, private panelService:PanelserviceService,
    private router:Router) {}

  ngOnInit(): void {
    this.loadCartItems();
    console.log(this.cartItems)
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  removeFromCart(itemId:string): void {
    this.cartService.removeFromCart(itemId);
    this.loadCartItems();
    this.toastr.success('Panel Removed From Cart')
    
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCartItems();
  }

  payNow(itemId:string){
    let singleCartItem = this.cartService.getCartItemById(itemId);
    this.router.navigate(['/payment'], { queryParams: { cartId: itemId } });
  }


}
