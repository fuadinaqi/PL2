import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Router } from '@angular/router'
import { compareFromHighest } from '@/helpers/compare'
import { AuthService } from '@services/auth.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public listPeriode: Array<any>

  public isP2pk: boolean = false

  ngOnInit(): void {
    let role = this.AuthService.getRole()
    console.log(role)
    if (role.toString() == 'UserPLII') {
      this.isP2pk = false
    } else {
      this.isP2pk = true
    }

    this.listPeriode = JSON.parse(localStorage.getItem('periode'))
    console.log(this.listPeriode)
    if (!this.listPeriode) {
      this.listPeriode = []
    }

    const url = this.isP2pk ? 'api/PeriodePelaporan/P2PK/HeaderTahun' : 'api/PeriodePelaporan'

    this.http.get(this.config.apiBaseUrl + url, this.api.generateHeader()).subscribe(
      (result: any) => {
        const arrListPeriode = []
        result.data.forEach((d) => {
          if (arrListPeriode.findIndex((l) => l.tahun === d.tahun) === -1) {
            arrListPeriode.push(d)
          }
        })
        this.listPeriode = arrListPeriode.sort(compareFromHighest('tahun'))
      },
      (error) => {}
    )
  }

  clickDetail(tahun: number) {
    this.router.navigateByUrl(`/detail?tahun=${tahun}`)
  }

  constructor(
    private router: Router,
    public periodeLaporan: Periode,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    private AuthService: AuthService
  ) {}
}
