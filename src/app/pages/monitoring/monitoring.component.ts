import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { ActivatedRoute, Router } from '@angular/router'
import { compareFromHighest } from '@/helpers/compare'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
})
export class MonitoringComponent {
  public tahun = this.activatedRoute.snapshot.queryParams.tahun
  public title = ''
  public listPeriode: Array<any> = []
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    }

    this.http
      .get(this.config.apiBaseUrl + 'api/PeriodePelaporan/P2PK/HeaderTahun', this.api.generateHeader())
      .subscribe(
        (result: any) => {
          // const arrListPeriode = []
          // result.data.forEach((d) => {
          //   if (arrListPeriode.findIndex((l) => l.tahun === d.tahun) === -1) {
          //     arrListPeriode.push(d)
          //   }
          // })
          // this.listPeriode = arrListPeriode.sort(compareFromHighest('tahun'))
          this.dtTrigger.next()
        },
        (error) => {}
      )
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
