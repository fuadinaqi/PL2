import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { MainComponent } from '@modules/main/main.component'
import { BlankComponent } from '@pages/blank/blank.component'
import { LoginComponent } from '@modules/login/login.component'
import { ProfileComponent } from '@pages/profile/profile.component'
import { RegisterComponent } from '@modules/register/register.component'
import { DashboardComponent } from '@pages/dashboard/dashboard.component'
import { PeriodeComponent } from '@pages/periode/periode.component'
import { JadwallistComponent } from '@pages/jadwallist/jadwallist.component'
import { JadwalDetailComponent } from '@pages/jadwaldetail/jadwaldetail.component'
import { JadwaladdComponent } from '@pages/jadwaladd/jadwaladd.component'
import { AuthGuard } from '@guards/auth.guard'
import { NonAuthGuard } from '@guards/non-auth.guard'
import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component'
import { RecoverPasswordComponent } from '@modules/recover-password/recover-password.component'
import { PrivacyPolicyComponent } from '@modules/privacy-policy/privacy-policy.component'
import { MainMenuComponent } from '@pages/main-menu/main-menu.component'
import { SubMenuComponent } from '@pages/main-menu/sub-menu/sub-menu.component'
import { TransaksilistComponent } from '@pages/transaksilist/transaksilist.component'
import { TransaksidetailComponent } from '@pages/transaksidetail/transaksidetail.component'
import { TransaksiaddComponent } from '@pages/transaksiadd/transaksiadd.component'
import { BealistComponent } from '@pages/bealist/bealist.component'
import { BeadetailComponent } from '@pages/beadetail/beadetail.component'
import { BeatambahComponent } from '@pages/beatambah/beatambah.component'
import { TransaksilandingComponent } from '@pages/transaksilanding/transaksilanding.component'
import { BphlistComponent } from '@pages/bphlist/bphlist.component'
import { BphdetailComponent } from '@pages/bphdetail/bphdetail.component'
import { BphaddComponent } from '@pages/bphadd/bphadd.component'
import { BealandingComponent } from '@pages/bealanding/bealanding.component'
import { KslistComponent } from '@pages/kslist/kslist.component'
import { KsdetailComponent } from '@pages/ksdetail/ksdetail.component'
import { KsaddComponent } from '@pages/ksadd/ksadd.component'
import { BolandingComponent } from '@pages/bo/bolanding/bolanding.component'
import { BphlandingComponent } from '@pages/bphlanding/bphlanding.component'
import { BoperiodeComponent } from '@pages/bo/boperiode/boperiode.component'
import { KslandingComponent } from '@pages/kslanding/kslanding.component'
import { PeriodelistComponent } from '@pages/periodelist/periodelist.component'

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'blank',
        component: BlankComponent,
      },
      {
        path: 'sub-menu-1',
        component: SubMenuComponent,
      },
      {
        path: 'sub-menu-2',
        component: BlankComponent,
      },
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'periode',
        component: PeriodeComponent,
      },
      {
        path: 'periodelist',
        component: PeriodelistComponent,
      },
      {
        path: 'jadwallist',
        component: JadwallistComponent,
      },
      {
        path: 'jadwaldetail/:idperiode',
        component: JadwalDetailComponent,
      },
      {
        path: 'jadwaladd/periode/:idperiode',
        component: JadwaladdComponent,
      },
      {
        path: 'jadwaladd/preview/:idpreview',
        component: JadwaladdComponent,
      },
      {
        path: 'jadwaladd/:id',
        component: JadwaladdComponent,
      },
      {
        path: 'transaksi/:idperiode',
        component: TransaksilandingComponent,
      },

      {
        path: 'transaksilist',
        component: TransaksilistComponent,
      },

      {
        path: 'transaksidetail/:idjadwal',
        component: TransaksidetailComponent,
      },

      {
        path: 'transaksiadd/jadwal/:idjadwal',
        component: TransaksiaddComponent,
      },
      {
        path: 'transaksiadd/preview/:idpreview',
        component: TransaksiaddComponent,
      },
      {
        path: 'transaksiadd/:id',
        component: TransaksiaddComponent,
      },
      {
        path: 'bea/:idperiode',
        component: BealandingComponent,
      },
      {
        path: 'bealist',
        component: BealistComponent,
      },
      {
        path: 'beadetail/:idtrans',
        component: BeadetailComponent,
      },
      {
        path: 'beatambah/trans/:idtrans',
        component: BeatambahComponent,
      },
      {
        path: 'beatambah/:id',
        component: BeatambahComponent,
      },
      {
        path: 'beatambah/preview/:idpreview',
        component: BeatambahComponent,
      },
      {
        path: 'bphlist',
        component: BphlistComponent,
      },
      {
        path: 'bphdetail/:idtrans',
        component: BphdetailComponent,
      },
      {
        path: 'bphadd/trans/:idtrans',
        component: BphaddComponent,
      },
      {
        path: 'bphadd/:id',
        component: BphaddComponent,
      },
      {
        path: 'bphadd/preview/:idpreview',
        component: BphaddComponent,
      },
      {
        path: 'bphlanding/:idperiode',
        component: BphlandingComponent,
      },
      {
        path: 'kslist',
        component: KslistComponent,
      },
      {
        path: 'kslanding/:idperiode',
        component: KslandingComponent,
      },
      {
        path: 'ksdetail/:idtrans',
        component: KsdetailComponent,
      },
      {
        path: 'ksadd/periode/:idperiode',
        component: KsaddComponent,
      },
      {
        path: 'dash-bo',
        component: BolandingComponent,
      },
      {
        path: 'boperiode/:idjadwal',
        component: BoperiodeComponent,
      },
      {
        path: 'botrans',
        component: TransaksidetailComponent,
      },
      {
        path: 'bobea',
        component: BeadetailComponent,
      },
      {
        path: 'bobph',
        component: BphdetailComponent,
      },
      {
        path: 'bojadwal',
        component: BolandingComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NonAuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NonAuthGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [NonAuthGuard],
  },
  {
    path: 'recover-password',
    component: RecoverPasswordComponent,
    canActivate: [NonAuthGuard],
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    canActivate: [NonAuthGuard],
  },
  { path: '**', redirectTo: '' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
