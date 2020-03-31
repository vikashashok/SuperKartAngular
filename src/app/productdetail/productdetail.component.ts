import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Products } from '../productlist/products';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.scss']
})
export class ProductdetailComponent implements OnInit {
  product: any;
  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  handleClick() {  
    this.product['isFavorite'] = !this.product['isFavorite'];
    this.apiService.addFavorites(this.product);
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
          if(this.product['id'] === fav.id) {
            this.product['isFavorite'] = favorites.isFavorite ? 'true' : false;
          }
        }
        for(let fav of favorites) {
          for(let p of this.apiService.products) {
            if(p.id === fav.id) {
              p.isFavorite = fav.isFavorite ? 'true' : false;
            }
          }
        }
        this.apiService.productAddedSubject.next(this.apiService.products.filter(p => {return p.isFavorite}));
    });
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');   
    if(this.apiService.products.length == 0) {
      let dataArray: any = [];
      this.apiService.getProducts()
          .subscribe((data: any) => {
        for(let d of data) {
            dataArray.push(d.payload.doc.data());
        }        
        this.apiService.products = JSON.parse(JSON.stringify(dataArray));
        this.product = this.apiService.getProductDetail(id);
        this.showFavorites();
      });
    } else {
        this.product = this.apiService.getProductDetail(id);
        this.showFavorites();
    }
  }

}
