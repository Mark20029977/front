import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CallserviceService } from '../services/callservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit {
  orderForm: FormGroup;
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private callService: CallserviceService
  ) {
    this.orderForm = this.formBuilder.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Ensure phone number is 10 digits
      amphoe: ['', Validators.required],
      tambon: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCartItems(); // Load cart items on initialization
  }

  loadCartItems(): void {
    this.callService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.totalPrice = this.calculateTotalPrice(); // Calculate total price
    });
  }

  calculateTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  clearCart(): void {
    this.callService.clearCart().subscribe(() => {
      this.cartItems = []; // Clear cart items
      this.totalPrice = 0; // Reset total price
      this.router.navigate(['/payment']).then(() => {
        console.log('Navigation to /payment successful');
      }).catch(err => {
        console.error('Navigation error:', err);
      });
    }, error => {
      console.error('Error clearing cart:', error);
    });
  }
  gotocart(): void {
    if (this.orderForm.invalid) {
      const firstInvalidControl = Object.keys(this.orderForm.controls).find(control => this.orderForm.controls[control].invalid);
      let errorMessage = '';
  
      switch (firstInvalidControl) {
        case 'address':
          errorMessage = 'กรุณากรอกที่อยู่';
          break;
        case 'city':
          errorMessage = 'กรุณากรอกจังหวัด';
          break;
        case 'postalCode':
          errorMessage = 'กรุณากรอกรหัสไปรษณีย์';
          break;
        case 'phoneNumber':
          errorMessage = 'กรุณากรอกเบอร์โทรศัพท์';
          break;
        case 'amphoe':
          errorMessage = 'กรุณากรอกอำเภอ';
          break;
        case 'tambon':
          errorMessage = 'กรุณากรอกตำบล';
          break;
        default:
          errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วน';
          break;
      }
  
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน!',
        text: errorMessage,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3085d6',
        iconColor: '#f39c12'
      });
      return;
    }
  
    Swal.fire({
      title: 'ยืนยันการชำระสินค้า',
      text: "คุณต้องการชำระเงินจริงหรือไม่?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      customClass: {
        popup: 'alert-popup',
        title: 'alert-title',
        confirmButton: 'alert-confirm-button',
        cancelButton: 'alert-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.clearCart(); // Clear cart
        this.router.navigate(['/payment']);
      }
    });
  }
}  