import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Router } from '@angular/router'
import { compareFromHighest } from '@/helpers/compare'

@Component({
  selector: 'app-kslelang',
  templateUrl: './kslelang.component.html',
})
export class KslelangComponent {
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

        this.listPeriode.forEach((el, i) => {
          this.http
            .get(
              this.config.apiBaseUrl + `api/PeriodePelaporan/KertasSekuritibyTahun/${el.tahun}`,
              this.api.generateHeader()
            )
            .subscribe((res: any) => {
              const jumlahAwal = res.data.map((el) => el.jumlahAwal).reduce((a, b) => a + b)
              const penambahan = res.data.map((el) => el.penambahan).reduce((a, b) => a + b)
              const penggunaan = res.data.map((el) => el.penggunaan).reduce((a, b) => a + b)
              const kutipanPengganti = res.data.map((el) => el.kutipanPengganti).reduce((a, b) => a + b)
              const rusak = res.data.map((el) => el.rusak).reduce((a, b) => a + b)
              const hilang = res.data.map((el) => el.hilang).reduce((a, b) => a + b)
              const sisa = res.data.map((el) => el.sisa).reduce((a, b) => a + b)
              this.listPeriode[i] = {
                ...this.listPeriode[i],
                jumlahAwal,
                penambahan,
                penggunaan,
                kutipanPengganti,
                rusak,
                hilang,
                sisa,
              }
            })
        })
      },
      (error) => {}
    )
  }

  clickDetail(data) {
    this.router.navigateByUrl(`/ksdetail/${data.id}?tahun=${data.tahun}`)
  }

  constructor(
    private router: Router,
    public periodeLaporan: Periode,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}
}
