import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_ENDPOINT = environment.API_ENDPOINT;
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'accept': '*/*' }) };

@Injectable({
  providedIn: 'root'
})
export class CallserviceService {
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ฟังก์ชันเพิ่มสินค้าลงในตะกร้า
  addToCart(product: any): Observable<any> {
    const currentCart = this.cartSubject.value;
    currentCart.push(product);
    this.cartSubject.next(currentCart);
    return this.http.post<any>(`${API_ENDPOINT}/cart/add`, product, httpOptions);
  }

  // ฟังก์ชันอัปเดตสินค้าภายในตะกร้า
  updateCartItem(item: any): Observable<any> {
    return this.http.put<any>(`${API_ENDPOINT}/cart/update/${item.id}`, JSON.stringify(item), httpOptions);
  }

  // ฟังก์ชันอัปเดตจำนวนสินค้าภายในตะกร้า
  updateCartItemQuantity(productId: any, quantity: number): Observable<any> {
    const currentCart = this.cartSubject.value.map(item => {
      if (item.id === productId) {
        item.quantity = quantity;
      }
      return item;
    });
    this.cartSubject.next(currentCart);
    return this.http.put<any>(`${API_ENDPOINT}/cart/updateQuantity/${productId}`, { quantity }, httpOptions);
  }

  // ฟังก์ชันลบสินค้าจากตะกร้า
  removeFromCart(productId: any): Observable<any> {
    const currentCart = this.cartSubject.value.filter(product => product.id !== productId);
    this.cartSubject.next(currentCart);
    return this.http.delete<any>(`${API_ENDPOINT}/cart/remove/${productId}`);
  }

  // ฟังก์ชันล้างตะกร้าสินค้า
  clearCart(): Observable<any> {
    this.cartSubject.next([]);
    return this.http.delete<any>(`${API_ENDPOINT}/cart/clear`);
  }

  // ฟังก์ชันดึงสินค้าจากตะกร้า
  getCartItems(): Observable<any[]> {
    return this.cart$;
  }

  // ฟังก์ชันสำหรับการทำงานอื่นๆ เช่น การจัดการบทบาท ผู้ใช้ และสินค้า
  getAllRole(): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINT}/role/getAll`);
  }

  saveRegister(data: any): Observable<any> {
    return this.http.post<any>(`${API_ENDPOINT}/register/save`, JSON.stringify(data), httpOptions);
  }

  authen(userName: any, password: any): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINT}/login/authen`, { params: { userName, password } });
  }

  updateProfile(data: any, userId: any): Observable<any> {
    return this.http.put<any>(`${API_ENDPOINT}/register/update/${userId}`, JSON.stringify(data), httpOptions);
  }

  getByUserId(userId: any): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINT}/register/getById`, { params: { userId } });
  }

  getAllUser(): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINT}/manage/user/getAllUser`);
  }

  deleteUserByUserId(userId: any): Observable<any> {
    return this.http.delete<any>(`${API_ENDPOINT}/register/delete`, { params: { userId } });
  }

  getProductImgByProductId(productId: any): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINT}/product/getProductImgByProductId`, { params: { productId } });
  }

  getBlobThumbnail(fileName: string): Observable<Blob> {
    return this.http.get<Blob>(`${API_ENDPOINT}/product/getImageByte`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      params: { fileName },
      responseType: 'blob' as 'json'
    });
  }

  getImageByte(fileName: string): Observable<Blob> {
    return this.http.get<Blob>(`${API_ENDPOINT}/product/getImageByte`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      params: { fileName },
      responseType: 'blob' as 'json'
    });
  }

  getAllProduct(): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINT}/product/getAll`);
  }

  getProductTypeAll(): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINT}/product/getProductTypeAll`);
  }

  saveImage(formData: FormData, productId: any): Observable<any> {
    return this.http.post<any>(`${API_ENDPOINT}/product/saveImage/${productId}`, formData);
  }

  saveProduct(data: any): Observable<any> {
    return this.http.post<any>(`${API_ENDPOINT}/product/save`, JSON.stringify(data), httpOptions);
  }

  removeImgByProductId(productId: any): Observable<any> {
    return this.http.delete<any>(`${API_ENDPOINT}/product/removeImgByProductId`, { params: { productId } });
  }

  deleteProduct(productId: any): Observable<any> {
    return this.http.delete<any>(`${API_ENDPOINT}/product/delete`, { params: { productId } });
  }

  getProductByProductId(productId: any): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINT}/product/getById`, { params: { productId } });
  }

  updateProduct(data: any, productId: any): Observable<any> {
    return this.http.put<any>(`${API_ENDPOINT}/product/update/${productId}`, JSON.stringify(data), httpOptions);
  }

  deleteImage(fileName: any): Observable<any> {
    return this.http.delete<any>(`${API_ENDPOINT}/product/deleteImgByFileName`, { params: { fileName } });
  }

  // ฟังก์ชันจัดการคำสั่งซื้อ
  saveOrder(data: any): Observable<any> {
    return this.http.post<any>(`${API_ENDPOINT}/order/save`, JSON.stringify(data), httpOptions);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINT}/order/getById`, { params: { orderId } });
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${API_ENDPOINT}/order/getAll`);
  }

  deleteOrder(orderId: any): Observable<any> {
    return this.http.delete<any>(`${API_ENDPOINT}/order/delete`, { params: { orderId } });
  }

  saveCart(data: any): Observable<any> {
    return this.http.post<any>(`${API_ENDPOINT}/api/cart/save`, JSON.stringify(data), httpOptions);
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${API_ENDPOINT}/order-status`);
  }

}