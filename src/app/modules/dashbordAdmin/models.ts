// models.ts
export interface Product {
    productId: string;
    productName: string;
    price: number;
    productTypeId: string;
    imgList: string[];  // Use string instead of SafeResourceUrl here
    productType: ProductType[];
}

export interface ProductType {
    productTypeId: string;
    productTypeName: string;
}

export interface ProductImage {
    productImgName: string;
}
