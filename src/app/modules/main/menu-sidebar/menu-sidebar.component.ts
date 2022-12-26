import { AppState } from '@/store/state'
import { UiState } from '@/store/ui/state'
import { Component, HostBinding, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AuthService } from '@services/auth.service'
import { Observable } from 'rxjs'

const BASE_CLASSES = 'main-sidebar elevation-4'
@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss'],
})
export class MenuSidebarComponent implements OnInit {
  @HostBinding('class') classes: string = BASE_CLASSES
  public ui: Observable<UiState>
  public user
  public menu = []

  constructor(public AuthService: AuthService, private store: Store<AppState>) {}

  ngOnInit() {
    this.ui = this.store.select('ui')
    this.ui.subscribe((state: UiState) => {
      this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`
    })
    this.user = this.AuthService.user
    let role = this.AuthService.getRole()
    console.log(this.menu, this.user)
    if (role.toString() == 'UserPLII') {
      this.menu = [
        {
          name: 'Home',
          iconClasses: 'fas fa-home',
          path: ['/'],
        },

        {
          name: 'Jadwal Lelang',
          iconClasses: 'fas fa-calendar',
          path: ['/jadwallelang'],
        },

        {
          name: 'Transaksi Lelang',
          iconClasses: 'fas fa-book',
          path: ['/transaksilelang'],
        },
        {
          name: 'Penyetoran Bea',
          iconClasses: 'fas fa-credit-card',
          path: ['/bealelang'],
        },
        {
          name: 'Penyetoran BPHTB',
          iconClasses: 'fas fa-building',
          path: ['/bphlelang'],
        },
        {
          name: 'Kertas Sekuriti',
          iconClasses: 'fas fa-lock ',
          path: ['/kslelang'],
        },
      ]
    } else if (role.toString() == 'P2PK' || role.toString() == 'Plain' || role instanceof Array) {
      this.menu = [
        {
          name: 'Back Office',
          iconClasses: 'fas fa-briefcase ',
          path: ['/dash-bo'],
        },

        {
          name: 'Jadwal',
          iconClasses: 'far fa-address-book',
          path: ['/bo/bojadwal'],
        },
        {
          name: 'Transaksi',
          iconClasses: 'fas fa-book',
          path: ['/bo/botrans'],
        },
        {
          name: 'Penyetoran Bea',
          iconClasses: 'fas fa-credit-card',
          path: ['/bo/bobea'],
        },
        {
          name: 'Penyetoran BPHTB',
          iconClasses: 'fas fa-building',
          path: ['/bo/bobph'],
        },
        {
          name: 'Kertas Sekuriti',
          iconClasses: 'fas fa-lock',
          path: ['/bo/boks'],
        },
      ]
    }
  }
}
