import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { ActivatedRoute, Router } from '@angular/router'
import { compareFromHighest } from '@/helpers/compare'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-bousers',
  templateUrl: './bousers.component.html',
})
export class BoUsersComponent {
  public tahun = this.activatedRoute.snapshot.queryParams.tahun
  public type = this.activatedRoute.snapshot.params.type
  public title = ''
  public listPeriode: Array<any>
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    }

    this.listPeriode = JSON.parse(localStorage.getItem('periode'))
    if (!this.listPeriode) {
      this.listPeriode = []
    }

    this.http
      .get(this.config.apiBaseUrl + `api/JadwalLelang/P2PK/userPerTahun/${this.tahun}`, this.api.generateHeader())
      .subscribe(
        (result: any) => {
          this.listPeriode = result.data
          this.dtTrigger.next()
        },
        (error) => {}
      )
  }

  clickDetail(tahun: any, userId: string) {
    if (this.type !== 'boks') {
      this.router.navigateByUrl(`/bo/${this.type}/list?tahun=${tahun}&u=${userId}`)
    } else {
      this.router.navigateByUrl(`/boks?tahun=${tahun}&u=${userId}`)
    }
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
