import { Component, OnDestroy, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Subject } from 'rxjs'
import { AuthService } from '@services/auth.service'

@Component({
  selector: 'app-beajadwal',
  templateUrl: './beajadwal.component.html',
})
export class BeaJadwalComponent implements OnInit, OnDestroy {
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
    private config: AppConfigService,
    private authService: AuthService
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

          const isUserPL2 = this.authService.getRole() === "UserPLII"
          const id = this.authService?.user?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || ''
          if (isUserPL2) {
            this.listJadwal = this.listJadwal.filter(j => j.userId === id)
          }

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
