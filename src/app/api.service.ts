import { Injectable } from "@angular/core";
import { Products } from "./productlist/products";

import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';
// import { Router } from "@angular/router";
import { Subject, Observable} from 'rxjs';
import { Upload } from './admin/upload';

@Injectable()
export class ApiService {
  private productChangedSubject = new Subject<any>();
  productChanged$: Observable<any>;
  public productAddedSubject = new Subject<any>();
  productAddedtoFav$: Observable<any>;
  products = [];
  imgPathToStore: string = "";

  constructor(private firestore: AngularFirestore) {
    this.productChanged$ = this.productChangedSubject.asObservable();
    this.productAddedtoFav$ = this.productAddedSubject.asObservable();
  }

  isProductChanged(prod) {
    this.productChangedSubject.next(prod);
  }

  getProductDetail(id: string) {
    for(let prod of this.products) {
        if(prod.id === id) {
            return prod;
        }
    }
  }

  getProducts() {
    return this.firestore.collection("products").snapshotChanges();
  }

  getFavorites() {
    return this.firestore.collection("favorites").snapshotChanges();
  }

  addFavorites(product) {
    this.firestore.collection("favorites").doc(product.id).set({
      id: product.id,
      title: product.title,      
      isFavorite: product.isFavorite,
      imgPath: product.imgPath,
      price: product.price
    });
  }
  
  addProduct(value: Products, productType: string){
    return this.firestore.collection(productType).doc(value.id).set({
      id: value.id,
      title: value.title,
      imgPath: value.imgPath,
      description: value.description,
      price: value.price
    });
  }

  pushUpload(upload: Upload) {
    let basePath: string = '/uploads';
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${basePath}/${upload.file.name}`).put(upload.file);
    return new Promise<any>((resolve, reject) => {      
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>  {
          // upload in progress
          upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        (error) => {
          // upload failed
          console.log("upload failed",error);
          reject(error);
        },
        () => {
          // upload success
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            this.imgPathToStore = downloadURL;
            this.updateImageMetadata(upload);
            resolve(this.imgPathToStore);
          });
        }
      );
    })
  }

  updateImageMetadata(upload) {    
    let basePath: string = '/uploads';
    let storageRef = firebase.storage().ref();
    var forestRef = storageRef.child(`${basePath}/${upload.file.name}`)
    // Create file metadata to update
    var newMetadata = {
      cacheControl: 'public,max-age=3000'
    }

    // Update metadata properties
    forestRef.updateMetadata(newMetadata).then(function(metadata) {
      // Updated metadata for is returned in the Promise
      console.log('File metadata', metadata);
    }).catch(function(error) {
      // Uh-oh, an error occurred!
    });
  }
  
  updateProduct(product: Products,id: string) {
    return this.firestore
      .collection("products")
      .doc(id)
      .set(product, { merge: true });
  }

  deleteProduct(id: string) {
    this.deleteFavorites(id);
    return this.firestore.collection("products")
      .doc(id)
      .delete();
  }

  deleteFavorites(id: string) {
    return this.firestore.collection("favorites")
      .doc(id)
      .delete();
  }
}