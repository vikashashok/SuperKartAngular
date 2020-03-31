import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})
export class ProductlistComponent implements OnInit {
  products = [];

  constructor(private apiService: ApiService) { }
 
  displayCatalog() {
    this.apiService.getProducts()
        .subscribe((data: any) => {
          var dataArray: any = [];
        for(let d of data) {
          dataArray.push(d.payload.doc.data());
        }        
        this.products = JSON.parse(JSON.stringify(dataArray));
        this.showFavorites();
        this.apiService.products = JSON.parse(JSON.stringify(this.products));
    });
  }

  showFavorites() {    
    this.apiService.getFavorites()
        .subscribe((data: any) => {
          var dataArray: any = [];
        for(let d of data) {
          dataArray.push(d.payload.doc.data());
        }        
        var favorites = JSON.parse(JSON.stringify(dataArray));
        for(let fav of favorites) {
          for(let p of this.products) {
            if(p.id === fav.id) {
              p.isFavorite = fav.isFavorite ? 'true' : false;
            }
          }
        }
        this.apiService.productAddedSubject.next(this.products.filter(p => {return p.isFavorite}));
    });
  }

  handleClick(prod) {  
    prod.isFavorite = !prod.isFavorite;
    this.apiService.addFavorites(prod);
  }

  ngAfterViewInit(){
    this.displayCatalog();    
  }

  ngOnInit() {    
  }

}
