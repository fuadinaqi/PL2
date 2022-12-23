import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { compareFromLowest } from '@/helpers/compare'

@Component({
  selector: 'app-bealist',
  templateUrl: './bealist.component.html',
  styleUrls: ['./bealist.component.scss'],
})
export class BealistComponent implements OnInit {
  public tahun = this.activatedRoute.snapshot.queryParams.tahun || ''
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
  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}

  ngOnInit(): void {
    this.http
      .get(this.config.apiBaseUrl + `api/PeriodePelaporan/byTahun/${this.tahun}`, this.api.generateHeader())
      .subscribe(
        (result: any) => {
          this.listJadwal = result.data.sort(compareFromLowest('term')).sort(compareFromLowest('bulan'))
        },
        (error) => {}
      )
  }
}
