import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Subject } from 'rxjs'
import { compareFromLowest } from '@/helpers/compare'

@Component({
  selector: 'app-jadwallist',
  templateUrl: './jadwallist.component.html',
  styleUrls: ['./jadwallist.component.scss'],
})
export class JadwallistComponent {
  public tahun = this.activatedRoute.snapshot.queryParams.tahun || ''
  public listJadwal: Array<any> = []
  public months = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  public terms = ['', 'Awal', 'Akhir']
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()
  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    }

    this.http
      .get(this.config.apiBaseUrl + `api/PeriodePelaporan/JadwalLelangbyTahun/${this.tahun}`, this.api.generateHeader())
      .subscribe(
        (result: any) => {
          this.listJadwal = result.data.sort(compareFromLowest('term')).sort(compareFromLowest('bulan'))
          this.initJadwal()
        },
        (error) => {
          this.initJadwal()
        }
      )
  }

  initJadwal() {
    this.http.get(this.config.apiBaseUrl + 'api/PeriodePelaporan', this.api.generateHeader()).subscribe(
      (result: any) => {
        const arrJadwal = this.listJadwal.map((el) => ({ ...el }))
        result.data
          .filter((x) => x.tahun == this.tahun)
          .forEach((d) => {
            if (arrJadwal.findIndex((l) => l.id === d.id) === -1) {
              arrJadwal.push(d)
            }
          })
        this.listJadwal = arrJadwal.sort(compareFromLowest('term')).sort(compareFromLowest('bulan'))
        this.dtTrigger.next()
      },
      (error) => {}
    )
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe()
  }
}
