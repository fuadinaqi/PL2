import { Component, OnDestroy, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-bphjadwal',
  templateUrl: './bphjadwal.component.html',
})
export class BphJadwalComponent implements OnInit, OnDestroy {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public parentId = this.route.snapshot.params.id

  public listJadwal: Array<any>
  public idperiode: String
  public isempty: boolean = true
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe()
  }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    }
    this.idperiode = this.route.snapshot.params['idperiode']
    this.http
      .get(
        this.config.apiBaseUrl + `api/JadwalLelang/tahunDanBulan?tahun=${this.tahun}&bulan=${this.bulan}`,
        this.api.generateHeader()
      )
      .subscribe(
        (result: any) => {
          this.listJadwal = result.data
          this.listJadwal = result.data.filter((trans) => ['Permohonan Dikirim'].includes(trans.statusPengiriman))
          console.log(result)
          if (this.listJadwal.length > 0) {
            this.isempty = false
            this.dtTrigger.next()
          }
        },
        (error) => {}
      )
  }
}
