import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Router } from '@angular/router'
import { compareFromHighest, compareFromLowest } from '@/helpers/compare'

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
              const dataFromLowest = res.data.sort(compareFromLowest('triwulan'))

              const jumlahAwal = dataFromLowest[0].jumlahAwal
              const penambahan = res.data.map((el) => el.penambahan).reduce((a, b) => a + b)
              const penggunaan = res.data.map((el) => el.penggunaan).reduce((a, b) => a + b)
              const kutipanPengganti = res.data.map((el) => el.kutipanPengganti).reduce((a, b) => a + b)
              const rusak = res.data.map((el) => el.rusak).reduce((a, b) => a + b)
              const hilang = res.data.map((el) => el.hilang).reduce((a, b) => a + b)
              const sisa = dataFromLowest[dataFromLowest.length - 1].sisa
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

  sisaFromParams({ jumlahAwal = 0, penambahan = 0, penggunaan = 0, kutipanPengganti = 0, rusak = 0, hilang = 0 }) {
    return (
      Number(jumlahAwal || 0) +
      Number(penambahan || 0) -
      Number(penggunaan || 0) -
      Number(kutipanPengganti || 0) -
      Number(rusak || 0) -
      Number(hilang || 0)
    )
  }

  constructor(
    private router: Router,
    public periodeLaporan: Periode,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}
}
