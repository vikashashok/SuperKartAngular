import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { AdminDialogComponent } from '../admindialog/admindialog.component';
import { ApiService } from '../api.service';
import { MessagingService } from '../messaging.service';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styles: ['./admin.component.scss']
})
export class AdminComponent {
    email: string = "";
    successMessage: string = "";
    errorMessage: string = "";
	
    adminDialogRef: MatDialogRef<AdminDialogComponent>;
    dataSrc: MatTableDataSource<any>;
    displayedColumns: string[] = [];
    showSpinner: boolean = true;
    editText: string = "Edit";
    deleteText: string = "Delete";
    dialogType: string = "";
    apiSub: Subscription;

    constructor(private apiService: ApiService, private dialog: MatDialog, private msgService: MessagingService){
    }
    
    ngOnInit() {
        this.showProducts();
        this.apiService.productChanged$.subscribe(prod => {
            let index = this.dataSrc.data.findIndex(a => { return a.id === prod.id} );
            if(this.dialogType === 'delete') {
                if(index > -1) {
                    this.dataSrc.data.splice(index,1);
                    this.dataSrc = new MatTableDataSource<any>(this.dataSrc.data);
                }
            } else if(this.dialogType === 'edit') {
                if(index > -1) {
                    this.dataSrc.data[index] = JSON.parse(JSON.stringify(prod));
                    this.dataSrc = new MatTableDataSource<any>(this.dataSrc.data);
                }
            } else {
                if(index === -1) {
                    this.dataSrc.data.push(JSON.parse(JSON.stringify(prod)));
                    this.dataSrc = new MatTableDataSource<any>(this.dataSrc.data);
                }
            }
        });
    }
	
	openAdminDialog(dialogType,element) {
        this.dialogType = dialogType;
        this.adminDialogRef = this.dialog.open(AdminDialogComponent,{
            width: '50%',
            data: {
                productData: element,
                dialogType: dialogType ? dialogType : ''
              }
        });
    }

	displayProductsTable(dataArray) {
		let src = new MatTableDataSource<any>(dataArray);
		this.displayedColumns = [];
		this.displayedColumns.push('edit');
		for(let prop in src.filteredData[0]){
			if(prop.indexOf("description") === -1 && prop.indexOf("imgPath") === -1){
				this.displayedColumns.push(prop);
			}
		}
		this.displayedColumns = this.displayedColumns.concat(['delete']);
		this.dataSrc = src;
		this.showSpinner = false;
		this.apiSub.unsubscribe();
	}
    
    showProducts() {    
		var dataArray: any = [];
		this.apiSub = this.apiService.getProducts()
			.subscribe((data: any) => {
			for(let d of data) {
			  dataArray.push(d.payload.doc.data());
			}
			this.displayProductsTable(dataArray);
		});
    }

    ngOnDestroy() {
        this.apiSub.unsubscribe();
    }
}
