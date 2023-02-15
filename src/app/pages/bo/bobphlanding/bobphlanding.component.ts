import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'

@Component({
  selector: 'app-bobphlanding',
  templateUrl: './bobphlanding.component.html',
  styleUrls: ['./bobphlanding.component.scss'],
})
export class BoBphlandingComponent implements OnInit {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term
  public userId = this.route.snapshot.queryParams.u

  public listTrans: Array<any>
  public idperiode: String
  public isempty: boolean = true
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}

  ngOnInit(): void {
    this.idperiode = this.route.snapshot.params['idperiode']

    this.http
      .get(
        this.config.apiBaseUrl + `api/TransaksiLelang/P2PK/byTahun/${this.tahun}/${this.userId}`,
        this.api.generateHeader()
      )
      .subscribe(
        (result: any) => {
          if (result.data) {
            this.http
              .get(
                this.config.apiBaseUrl +
                  `api/PeriodePelaporan/P2PK/WithParam?Tahun=${this.tahun}&Bulan=${this.bulan}&UserId=${this.userId}`,
                this.api.generateHeader()
              )
              .subscribe((r: any) => {
                const jadwalIds = []
                r.data.forEach((x) => {
                  x.jadwalLelangModels.forEach((j) => {
                    jadwalIds.push(j.id)
                  })
                })
                this.listTrans = result.data.filter((trans) => jadwalIds.indexOf(trans.jadwalLelangId) !== -1)
                this.listTrans = this.listTrans.filter((trans) =>
                  ['Tanah', 'Tanah dan Bangunan'].includes(trans.tipeBarang)
                )
                this.listTrans = this.listTrans.filter((trans) =>
                  ['TAP', 'Laku', 'Ditahan', 'Wan Prestasi'].includes(trans.status)
                )
                if (this.listTrans.length > 0) {
                  this.isempty = false
                }
              })
          }
        },
        (error) => {}
      )
  }
}
