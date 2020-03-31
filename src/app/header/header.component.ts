import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  favCount = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.apiService.productAddedtoFav$.subscribe(products => {
      this.favCount = products.length;
    });
  }

  changeTheme(event){
    if(event.target.checked){
      document.documentElement.setAttribute('data-theme', "dark");
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

  }
}
