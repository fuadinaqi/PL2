import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-jadwallist',
  templateUrl: './jadwallist.component.html',
  styleUrls: ['./jadwallist.component.scss'],
})
export class JadwallistComponent {
  public listJadwal: Array<any>
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
    private route: ActivatedRoute,
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

    this.http.get(this.config.apiBaseUrl + 'api/PeriodePelaporan', this.api.generateHeader()).subscribe(
      (result: any) => {
        this.listJadwal = result.data
        console.log(result)
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
