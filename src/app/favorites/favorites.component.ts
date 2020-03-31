import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites = [];
  noFavorites = false;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.displayFavorites();    
  }

  displayFavorites() {
    this.apiService.getFavorites()
        .subscribe((data: any) => {
          var dataArray: any = [];
        for(let d of data) {
          dataArray.push(d.payload.doc.data());
        }        
        var favArray = JSON.parse(JSON.stringify(dataArray));
        this.favorites = favArray.filter(fav => {return fav.isFavorite});
        this.noFavorites = this.favorites.length == 0;
        this.apiService.productAddedSubject.next(this.favorites);
    });
  }
}
