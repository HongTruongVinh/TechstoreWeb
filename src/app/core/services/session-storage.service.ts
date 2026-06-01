import { Injectable } from "@angular/core";
import { CartItem } from "../../models/models/cart/cart-item.model";
import { TokenStorageService } from "./token-storage.service";
import { CartService } from "./cart.service";
import { ERetCode } from "../../models/enum/etype_project.enum";
import { CategoryService } from "./category.service";
import { BrandService } from "./brand.service";

const ORDERITEMS_KEY = 'orderItems';
const CARTITEMS_KEY = 'cartItems';


@Injectable({ providedIn: 'root' })
export class SessionStorageService {

  constructor(
    private tks: TokenStorageService,
    private cartService: CartService
  ) {
  }

  createCartSession(CartItems: CartItem[]) {
    sessionStorage.setItem(CARTITEMS_KEY, JSON.stringify(CartItems));
  }

  addItemToCart(cartItem: CartItem) {
    const cartItems = this.getCartItems() || [];
    cartItems.push(cartItem);
    sessionStorage.setItem(CARTITEMS_KEY, JSON.stringify(cartItems));
  }

  getCartItems(): CartItem[] | null {
    const cartItemsJson = sessionStorage.getItem(CARTITEMS_KEY);
    if (cartItemsJson) {
      try {
        return JSON.parse(cartItemsJson) as CartItem[];
      }
      catch (e) {
        console.error('Lỗi khi parse cart items từ sessionStorage:', e);
        return null;
      }
    }
    return null;
  }

  isItemInCart(productVariantOptionId: string): boolean {
    const cartItems = this.getCartItems();
    if (cartItems) {
      return cartItems.some(item => item.productVariantOptionId === productVariantOptionId);
    }
    return false;
  }

  createOrder(orderItems: CartItem[]) {
    sessionStorage.setItem(ORDERITEMS_KEY, JSON.stringify(orderItems));
  }

  public getOrderItems(): CartItem[] | null {
    const orderItemsJson = sessionStorage.getItem(ORDERITEMS_KEY);
    if (orderItemsJson) {
      try {
        return JSON.parse(orderItemsJson) as CartItem[];
      } catch (e) {
        console.error('Lỗi khi parse order items từ sessionStorage:', e);
        return null;
      }
    }
    return null;
  }

  clearOrder() {
    sessionStorage.removeItem(ORDERITEMS_KEY);
  }

  getBrands(){

  }

  
}