import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { FavoritesComponent } from './favorites/favorites.component';


const routes: Routes = [
	{ path: 'admin', component: AdminComponent },
   {
	   path: 'category/productdetails/:id',
	   component: ProductdetailComponent
   },
   { path: 'favorites', component: FavoritesComponent },
   { path: '', component: ProductlistComponent },
   { path: '**', redirectTo: "/", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
