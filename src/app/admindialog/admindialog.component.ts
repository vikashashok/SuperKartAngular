import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { ApiService } from '../api.service'
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Products } from '../productlist/products';
import { Upload } from "../admin/upload";

@Component({
  selector: 'admindialog',
  templateUrl: './admindialog.component.html',
  styles: ['./admindialog.component.scss']
})
export class AdminDialogComponent {
  type: string = "";
  product = new Products("","","","","");
  updateitem: any = {};
  deleteitem: any = {};
  selectedFiles: FileList;
  currentUpload: Upload;

    constructor(private dialog: MatDialog, private apiService: ApiService, private router: Router,
      private dialogRef: MatDialogRef<AdminDialogComponent>,
      @Inject(MAT_DIALOG_DATA) private data) {}

    ngOnInit() {      
      this.type = this.data.dialogType;
      if(this.type === "edit") {
        this.product = JSON.parse(JSON.stringify(this.data.productData));
      } else if(this.type === "delete") {
        this.deleteitem = JSON.parse(JSON.stringify(this.data.productData));
      }
    }

    detectFiles(event) {
      this.selectedFiles = event.target.files;
      let file = this.selectedFiles.item(0);
      this.currentUpload = new Upload(file);
      this.apiService.pushUpload(this.currentUpload).then(res => {
        this.currentUpload = null;
        this.product.imgPath = res;
      },
      err => {
        console.log(err);
        //this.closeDialog();
      });
    }

    saveProduct(form: NgForm) {
      this.apiService.isProductChanged(this.product);
      this.closeDialog();
      if(this.type === "add") {
          this.apiService.addProduct(this.product,"products").then(
              res => {
                  form.reset();
                  //this.closeDialog();
              },
              err => {
            console.log(err);
            //this.closeDialog();
          });
      } else {
        this.updateProd(form);
      }
    }

    updateProd(form: NgForm) {
      this.apiService.isProductChanged(this.product);
      this.closeDialog();
      this.apiService.updateProduct(this.product,this.product.id).then(
        res => {
            form.reset();
            //this.closeDialog();
        })
        .catch(err => {
            console.log(err);
           //this.closeDialog();
        });    
    }
    
    deleteProduct() {
      this.apiService.isProductChanged(this.deleteitem);
      this.closeDialog();
      this.apiService.deleteProduct(this.deleteitem.id).then(
      res => {
          //this.closeDialog();
      }).catch(error => {
        //this.closeDialog();
      });
    }

    closeDialog() {
      this.router.navigate([{ outlets: { popup: null }}]);
      this.dialogRef.close();
    }

}
