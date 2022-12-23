import { Component, OnDestroy, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-transaksilist',
  templateUrl: './transaksilist.component.html',
  styleUrls: ['./transaksilist.component.scss'],
})
export class TransaksilistComponent implements OnInit, OnDestroy {
  public listJadwal: Array<any>
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()
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

    this.http.get(this.config.apiBaseUrl + 'api/PeriodePelaporan', this.api.generateHeader()).subscribe(
      (result: any) => {
        this.listJadwal = result.data
        console.log(result)
        this.dtTrigger.next()
      },
      (error) => {}
    )
  }
}
