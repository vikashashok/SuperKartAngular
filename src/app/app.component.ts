import { Component, HostListener } from '@angular/core';
import { MessagingService } from "./messaging.service";
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'superkart';
  deferredPrompt: any;
  showButton = false;
  message: BehaviorSubject<any>;
  constructor(private msgService: MessagingService) {}

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showButton = true;
  }
  
  addToHomeScreen() {
	// hide our user interface that shows our A2HS button
    this.showButton = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

  ngOnInit() {
    this.msgService.getPermission();
    setTimeout(() => {
      this.msgService.receiveMessage();
      this.message = this.msgService.currentMessage;
      console.log("msg pushed",this.message);
    },5000);    
  }
}
