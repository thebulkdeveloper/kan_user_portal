import { HostListener, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './UI/home/home.component';
import { AuthComponent } from './UI/auth/auth.component';
import { CartComponent } from './UI/cart/cart.component';
import { FooterComponent } from './UI/footer/footer.component';
import { NavbarComponent } from './UI/navbar/navbar.component';
import { PanelsComponent } from './UI/panels/panels.component';
import { PassbookComponent } from './UI/passbook/passbook.component';
import { SidebarComponent } from './UI/sidebar/sidebar.component';
import {CommonModule, HashLocationStrategy, LocationStrategy, NgOptimizedImage} from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth.interceptor';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { ProfileComponent } from './UI/profile/profile.component';
import { PanelcomponentComponent } from './UI/panelcomponent/panelcomponent.component';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION} from 'ngx-ui-loader';
import { CopyTextDirective } from './copy-text.directive';
import { CreatePanelComponent } from './UI/create-panel/create-panel.component';
import { PaymentComponent } from './UI/payment/payment.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ListingComponent } from './admin-dashboard/listing/listing.component';
import { MypanelsComponent } from './admin-dashboard/mypanels/mypanels.component';
import { AllusersComponent } from './admin-dashboard/allusers/allusers.component';
import { AdminProfileComponent } from './admin-dashboard/admin-profile/admin-profile.component';
import { MyPanelCardComponent } from './UI/my-panel-card/my-panel-card.component';
import { SpecialHeaderComponent } from './SpecialComponent/special-header/special-header.component';
import { AddBankComponent } from './admin-dashboard/add-bank/add-bank.component';
import { UserPanelsComponent } from './admin-dashboard/user-panels/user-panels.component';
import { MatMenuModule } from '@angular/material/menu';
import { DepositWithdrawComponent } from './UI/deposit-withdraw/deposit-withdraw.component';
import { DepositComponent } from './admin-dashboard/deposit/deposit.component';
import { BankDetailsComponent } from './admin-dashboard/bank-details/bank-details.component';
import { ViewBankComponent } from './admin-dashboard/view-bank/view-bank.component';
import { DialogComponent } from './dialog/dialog.component';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  // bgsColor: 'rgba(255,255,255,0.8)',
  fgsColor: 'rgb(255,185,12)',
  // bgsPosition: POSITION.centerCenter,
  fgsType: SPINNER.cubeGrid,
  bgsOpacity:5,
  fgsSize: 50,
  // pbDirection: PB_DIRECTION.leftToRight,
  // pbThickness: 3,
  hasProgressBar:false,

};



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    CartComponent,
    FooterComponent,
    NavbarComponent,
    PanelsComponent,
    PassbookComponent,
    SidebarComponent,
    ProfileComponent,
    PanelcomponentComponent,
    CopyTextDirective,
    CreatePanelComponent,
    PaymentComponent,
    AdminDashboardComponent,
    ListingComponent,
    MypanelsComponent,
    AllusersComponent,
    AdminProfileComponent,
    MyPanelCardComponent,
    SpecialHeaderComponent,
    AddBankComponent,
    UserPanelsComponent,
    DepositWithdrawComponent,
    DepositComponent,
    BankDetailsComponent,
    ViewBankComponent,
    DialogComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
            timeOut: 3500,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
        }),
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgxUiLoaderHttpModule.forRoot({
            showForeground: true,
        }),
        ReactiveFormsModule,
        NgOptimizedImage,
        MatMenuModule,
        MatDialogModule

    ],
  providers: [
    {provide: LocationStrategy, useClass:HashLocationStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
