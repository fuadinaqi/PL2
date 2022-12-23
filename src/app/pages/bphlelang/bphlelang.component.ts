import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Router } from '@angular/router'
import { compareFromHighest } from '@/helpers/compare'

@Component({
  selector: 'app-bphlelang',
  templateUrl: './bphlelang.component.html',
})
export class BphLelangComponent {
  public listPeriode: Array<any>
  ngOnInit(): void {
    this.listPeriode = JSON.parse(localStorage.getItem('periode'))
    console.log(this.listPeriode)
    if (!this.listPeriode) {
      this.listPeriode = []
    }

    this.http.get(this.config.apiBaseUrl + 'api/PeriodePelaporan', this.api.generateHeader()).subscribe(
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
    this.router.navigateByUrl(`/bphlist?tahun=${tahun}`)
  }

  constructor(
    private router: Router,
    public periodeLaporan: Periode,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}
}
