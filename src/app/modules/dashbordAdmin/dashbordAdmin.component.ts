import { Component, OnInit, OnDestroy } from '@angular/core';
import { CallserviceService } from '../services/callservice.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product, ProductType, ProductImage } from './models'; // Adjust based on actual path

@Component({
  selector: 'app-dashbordAdmin',
  templateUrl: './dashbordAdmin.component.html',
  styleUrls: ['./dashbordAdmin.component.css']
})
export class DashbordAdminComponent implements OnInit, OnDestroy {
  imageBlobUrls: SafeResourceUrl[] = [];
  productImgList: ProductImage[] = [];
  productList: Product[] = [];
  filteredProductList: Product[] = [];
  productTypeList: ProductType[] = [];
  searchQuery: string = '';
  selectedProductType: string = '';
  subscriptions: Subscription[] = [];

  constructor(
    private callService: CallserviceService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.getProductTypeAll();

    const productSub = this.callService.getAllProduct().subscribe(res => {
      if (res.data) {
        this.productList = res.data;
        this.filteredProductList = [...this.productList];
        this.loadProductImages();
      }
    });
    this.subscriptions.push(productSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadProductImages() {
    for (let product of this.productList) {
      product.imgList = [];
      product.productType = this.productTypeList.filter((x: ProductType) => x.productTypeId === product.productTypeId);
      const imgSub = this.callService.getProductImgByProductId(product.productId).subscribe((res) => {
        if (res.data) {
          this.productImgList = res.data;
          for (let productImg of this.productImgList) {
            this.getImage(productImg.productImgName, product.imgList);
          }
        } else {
          window.location.reload();
        }
      });
      this.subscriptions.push(imgSub);
    }
  }

  getImage(fileNames: string, imgList: SafeResourceUrl[]) {
    const imgSub = this.callService.getBlobThumbnail(fileNames).subscribe((res) => {
      let objectURL = URL.createObjectURL(res);
      let imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      imgList.push(imageBlobUrl);
    });
    this.subscriptions.push(imgSub);
  }

  getProductTypeAll() {
    const typeSub = this.callService.getProductTypeAll().subscribe((res) => {
      if (res.data) {
        this.productTypeList = res.data;
      }
    });
    this.subscriptions.push(typeSub);
  }

  applyFilters() {
    this.filteredProductList = this.productList.filter(product => {
      const matchesQuery = product.productName.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = !this.selectedProductType || product.productType.some((type: ProductType) => type.productTypeId === this.selectedProductType);
      return matchesQuery && matchesType;
    });
  }
  

  onDeleteProduct(productId: string) {
    if (productId) {
      const deleteSub = this.callService.deleteProduct(productId).subscribe(res => {
        if (res.data) {
          window.location.reload();
        }
      });
      this.subscriptions.push(deleteSub);
    }
  }

  onUpdateProduct(productId: string) {
    this.router.navigate(['/product/' + productId]);
  }

  addToCart(product: Product) {
    this.callService.addToCart(product);
    const data = {
      productId: product.productId,
      price: product.price
    };
    this.callService.saveCart(data).subscribe((res)=>{
      if(res.data){
        console.log("Product added", res.data);
      }
    });
    this.router.navigate(['/cart']);
  }
}
