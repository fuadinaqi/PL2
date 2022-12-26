import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { ActivatedRoute, Router } from '@angular/router'
import { compareFromHighest } from '@/helpers/compare'

@Component({
  selector: 'app-bolelang',
  templateUrl: './bolelang.component.html',
})
export class BolelangComponent {
  public type = this.activatedRoute.snapshot.params.type
  public title = ''
  public listPeriode: Array<any>
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((value) => {
      this.type = value.type

      switch (value.type) {
        case 'bojadwal':
          this.title = 'Jadwal Lelang'
          break
        case 'botrans':
          this.title = 'Transaksi Lelang'
          break
        case 'bobea':
          this.title = 'Penyetoran Bea Lelang'
          break
        case 'bobph':
          this.title = 'Penyetoran BPHTB Lelang'
          break
        case 'boks':
          this.title = 'Penggunaan Kertas Sekuriti'
          break
        default:
          this.title = ''
          break
      }
    })
    this.listPeriode = JSON.parse(localStorage.getItem('periode'))
    if (!this.listPeriode) {
      this.listPeriode = []
    }

    this.http
      .get(this.config.apiBaseUrl + 'api/PeriodePelaporan/P2PK/HeaderTahun', this.api.generateHeader())
      .subscribe(
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
    if (this.type !== 'boks') {
      this.router.navigateByUrl(`/bo/${this.type}/list?tahun=${tahun}`)
    } else {
      this.router.navigateByUrl(`/boks?tahun=${tahun}`)
    }
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public periodeLaporan: Periode,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}
}
