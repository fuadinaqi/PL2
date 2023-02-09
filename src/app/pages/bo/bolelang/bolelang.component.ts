import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { ActivatedRoute, Router } from '@angular/router'
import { compareFromHighest } from '@/helpers/compare'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-bolelang',
  templateUrl: './bolelang.component.html',
})
export class BolelangComponent {
  public type = this.activatedRoute.snapshot.params.type
  public title = ''
  public listPeriode: Array<any>
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [0, 'desc'],
    }

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
        case 'bomonitoring':
          this.title = 'Monitoring'
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
          this.dtTrigger.next()
        },
        (error) => {}
      )
  }

  clickDetail(tahun: number) {
    if (this.type === 'bomonitoring') {
      this.router.navigateByUrl(`/bomonitoring?tahun=${tahun}`)
    } else {
      this.router.navigateByUrl(`/bo/users/${this.type}?tahun=${tahun}`)
    }
    // if (this.type === 'boks') {
    //   this.router.navigateByUrl(`/boks?tahun=${tahun}`)
    // } else if (this.type === 'bomonitoring') {
    //   this.router.navigateByUrl(`/bomonitoring?tahun=${tahun}&type=${this.type}`)
    // } else {
    //   this.router.navigateByUrl(``)
    //   this.router.navigateByUrl(`/bo/${this.type}/list?tahun=${tahun}`)
    // }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe()
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
