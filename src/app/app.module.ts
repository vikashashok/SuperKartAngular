import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BannerComponent } from './banner/banner.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { AdminComponent } from './admin/admin.component';
import { AdminDialogComponent } from './admindialog/admindialog.component';
import { FooterComponent } from './footer/footer.component';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { ApiService } from './api.service';
import { MessagingService } from './messaging.service'; 

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { environment } from "../environments/environment";
import { ServiceWorkerModule } from '@angular/service-worker';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BannerComponent,
    NewsletterComponent,
    ProductlistComponent,
    ProductdetailComponent,
    AdminComponent,
    AdminDialogComponent,
	  FooterComponent,
	  FavoritesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
	  BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    MatTableModule,
	  MatDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFireDatabaseModule,
    AngularFireMessagingModule,
  ],
  providers: [
    ApiService,
    MessagingService,
    AsyncPipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [AdminDialogComponent]
})
export class AppModule { }
