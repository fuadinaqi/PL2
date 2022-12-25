import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { compareFromLowest } from '@/helpers/compare'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-kslist',
  templateUrl: './kslist.component.html',
  styleUrls: ['./kslist.component.scss'],
})
export class KslistComponent implements OnInit {
  public tahun = this.activatedRoute.snapshot.queryParams.tahun || ''
  public listJadwal: Array<any>

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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe()
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    }

    this.http
      .get(this.config.apiBaseUrl + `api/PeriodePelaporan/byTahun/${this.tahun}`, this.api.generateHeader())
      .subscribe(
        (result: any) => {
          this.listJadwal = result.data.sort(compareFromLowest('term')).sort(compareFromLowest('bulan'))
          this.dtTrigger.next()
        },
        (error) => {}
      )
  }
}
