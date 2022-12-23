import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { compareFromLowest } from '@/helpers/compare'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboarddetail.component.html',
})
export class DashboardDetailComponent {
  public tahun = this.activatedRoute.snapshot.queryParams.tahun || ''
  public listPeriode: Array<any>
  ngOnInit(): void {
    this.listPeriode = JSON.parse(localStorage.getItem('periode'))
    console.log(this.listPeriode)
    if (!this.listPeriode) {
      this.listPeriode = []
    }

    this.http
      .get(this.config.apiBaseUrl + `api/PeriodePelaporan/byTahun/${this.tahun}`, this.api.generateHeader())
      .subscribe(
        (result: any) => {
          this.listPeriode = result.data.sort(compareFromLowest('term')).sort(compareFromLowest('bulan'))
        },
        (error) => {}
      )
  }
  constructor(
    public periodeLaporan: Periode,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    private activatedRoute: ActivatedRoute
  ) {}
}
