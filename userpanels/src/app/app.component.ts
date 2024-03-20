import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mykanapp';
  isSidebarOpen = false;
  isAdminRoute: boolean = false;
  isPanelRoute:boolean=false;
  isCreatePaymentRoute:boolean=false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  constructor(private router: Router) {}

  ngOnInit() {
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminRoute = event.url.includes('/admin');
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCreatePaymentRoute = event.url.includes('/create-panel') || event.url.includes('/payment');
      }
    });


  }

  
}


