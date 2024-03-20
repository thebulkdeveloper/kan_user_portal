import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  private cartItems: any[] = [];

  constructor() {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      this.cartItems = JSON.parse(storedItems);
    }
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  addToCart(item: any): void {
    this.cartItems.push(item);
    this.saveCartItems();
  }

  private saveCartItems(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.saveCartItems();
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCartItems();
  }

  getCartItemById(itemId: string): any {
     return this.cartItems.find(item => item.id === itemId);
   
  }

}
