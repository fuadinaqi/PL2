import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { compareFromLowest } from '@/helpers/compare'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { ActivatedRoute } from '@angular/router'
import { dataPeriode } from './dummy'
import { AuthService } from '@services/auth.service'

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboarddetail.component.html',
})
export class DashboardDetailComponent {
  public tahun = this.activatedRoute.snapshot.queryParams.tahun || ''
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

    if (this.isP2pk) {
      this.listPeriode = dataPeriode
    } else {
      this.http
        .get(this.config.apiBaseUrl + `api/PeriodePelaporan/byTahun/${this.tahun}`, this.api.generateHeader())
        .subscribe(
          (result: any) => {
            this.listPeriode = result.data.sort(compareFromLowest('term')).sort(compareFromLowest('bulan'))
          },
          (error) => {}
        )
    }
  }
  constructor(
    public periodeLaporan: Periode,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    private activatedRoute: ActivatedRoute,
    private AuthService: AuthService
  ) {}
}
