import { Injectable }          from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth }     from "@angular/fire/auth";
import * as firebase from 'firebase';

import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class MessagingService {
    messaging = firebase.messaging();
    currentMessage = new BehaviorSubject(null);
    notificationMsg = {};
    tokenID = '';
    tokenList$: AngularFireList<any>;

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private apiService: ApiService) {
        this.tokenList$ = db.list('/fcmTokens');
     }

    updateToken(token) {        
        
        var tokenPresent = false;
        this.tokenList$.snapshotChanges().subscribe(list=> {
            
            if(list.length == 0) { 
                this.tokenList$.push(token); 
                return; 
            } else {
                list.forEach(element =>{ 
                    let x = element.payload.toJSON();
                    if(x == token) {          
                        tokenPresent = true;
                    }
                });
                if(!tokenPresent) {
                    this.tokenList$.push(token); 
                }
            }
        });
    }

    getPermission() {
        this.messaging.requestPermission()
        .then(() => {
            
            return this.messaging.getToken();
        })
        .then(token => {
            
            this.tokenID = token;
            this.updateToken(token);
        })
        .catch((err) => {
            console.log('Unable to get permission to notify.', err);
        });
    }

    receiveMessage() {
        this.messaging.onMessage((payload) => {
            console.log("Message received. ", payload);
            this.currentMessage.next(payload);
        });
    }
}