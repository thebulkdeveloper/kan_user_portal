import { Component, Output, EventEmitter, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  
  @Output() toggleSidebar = new EventEmitter<void>();

  isLoggedIn: boolean = false;
  isSidebarOpen: boolean = false;
  isAdmin:any=false

  constructor(private authServices: AuthserviceService, private router:Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authServices.getIsLoggedIn();
    this.authServices.isLoggedInChange.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.isAdmin=this.authServices.isAdmin()
    console.log(this.isAdmin)

  }


  onToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggleSidebar.emit();
  }

  closeSidebar(){
    this.toggleSidebar.emit()
  }

  logOut() {
    this.authServices.logout();
    this.toggleSidebar.emit();
  }

  Login(){
    this.router.navigate(['/login']);
    this.toggleSidebar.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isSidebarOpen) {
      return;
    }

    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.sidebar')) {
      // Click occurred outside the div, so close it
      this.isSidebarOpen = false;
    }
  }
}

