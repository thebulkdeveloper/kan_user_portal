import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './UI/auth/auth.component';
import { CartComponent } from './UI/cart/cart.component';
import { HomeComponent } from './UI/home/home.component';
import { PanelsComponent } from './UI/panels/panels.component';
import { PassbookComponent } from './UI/passbook/passbook.component';
import { ProfileComponent } from './UI/profile/profile.component';
import { AuthGuard, AdminGuard, RouteGuard } from './auth.guard';
import { CreatePanelComponent } from './UI/create-panel/create-panel.component';
import { PaymentComponent } from './UI/payment/payment.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ListingComponent } from './admin-dashboard/listing/listing.component';
import { MypanelsComponent } from './admin-dashboard/mypanels/mypanels.component';
import { AllusersComponent } from './admin-dashboard/allusers/allusers.component';
import { AdminProfileComponent } from './admin-dashboard/admin-profile/admin-profile.component';
import { AddBankComponent } from './admin-dashboard/add-bank/add-bank.component';
import { UserPanelsComponent } from './admin-dashboard/user-panels/user-panels.component';
import { DepositWithdrawComponent } from './UI/deposit-withdraw/deposit-withdraw.component';
import { DepositComponent } from './admin-dashboard/deposit/deposit.component';
import { ViewBankComponent } from './admin-dashboard/view-bank/view-bank.component';


const routes: Routes = [
  { path:'', component: HomeComponent},
  {path:'passbook', component:PassbookComponent, canActivate:[RouteGuard]},
  {path:'panels', component:PanelsComponent},
  {path:'cart', component:CartComponent},
  {path:'login', component:AuthComponent, canActivate: [AuthGuard]},
  {path:'profile', component:ProfileComponent},
  {path:'create-panel/:id', component:CreatePanelComponent, canActivate:[RouteGuard]},
  {path:'payment', component:PaymentComponent, canActivate:[RouteGuard]},
  {path:'deposit-withdraw/:type/:id', component:DepositWithdrawComponent, canActivate:[RouteGuard]},

  {
    path:'admin-dashboard',
    canActivate:[AdminGuard],
    component:AdminDashboardComponent,
    children: [
      { path: 'listing', component: ListingComponent },
      {path:'', component:MypanelsComponent},
      {path:'allusers', component:AllusersComponent},
      {path:'myprofile', component:AdminProfileComponent},
      {path:'add-bank', component:AddBankComponent},
      {path:'user-panels', component:UserPanelsComponent},
      {path:'deposit', component:DepositComponent},
      {path:'view-bank', component:ViewBankComponent}
    ]
  },

  { path: '**', redirectTo: '/home' }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
