import { Component, OnDestroy, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Subject } from 'rxjs'
import { compareFromLowest } from '@/helpers/compare'

@Component({
  selector: 'app-bolist',
  templateUrl: './bolist.component.html',
})
export class BolistComponent implements OnInit, OnDestroy {
  public tahun = this.activatedRoute.snapshot.queryParams.tahun || ''
  public userId = this.activatedRoute.snapshot.queryParams.u || ''
  public type = this.activatedRoute.snapshot.params.type || ''
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

    const data = [
      {
        id: 1,
        bulan: 1,
        term: 1,
      },
      {
        id: 1,
        bulan: 1,
        term: 2,
      },
      {
        id: 1,
        bulan: 2,
        term: 1,
      },
      {
        id: 1,
        bulan: 2,
        term: 2,
      },
      {
        id: 1,
        bulan: 3,
        term: 1,
      },
      {
        id: 1,
        bulan: 3,
        term: 2,
      },
      {
        id: 1,
        bulan: 4,
        term: 1,
      },
      {
        id: 1,
        bulan: 4,
        term: 2,
      },
      {
        id: 1,
        bulan: 5,
        term: 1,
      },
      {
        id: 1,
        bulan: 5,
        term: 2,
      },
      {
        id: 1,
        bulan: 6,
        term: 1,
      },
      {
        id: 1,
        bulan: 6,
        term: 2,
      },
      {
        id: 1,
        bulan: 7,
        term: 1,
      },
      {
        id: 1,
        bulan: 7,
        term: 2,
      },
      {
        id: 1,
        bulan: 8,
        term: 1,
      },
      {
        id: 1,
        bulan: 8,
        term: 2,
      },
      {
        id: 1,
        bulan: 9,
        term: 1,
      },
      {
        id: 1,
        bulan: 9,
        term: 2,
      },
      {
        id: 1,
        bulan: 10,
        term: 1,
      },
      {
        id: 1,
        bulan: 10,
        term: 2,
      },
      {
        id: 1,
        bulan: 11,
        term: 1,
      },
      {
        id: 1,
        bulan: 11,
        term: 2,
      },
      {
        id: 1,
        bulan: 12,
        term: 1,
      },
      {
        id: 1,
        bulan: 12,
        term: 2,
      },
    ]

    this.listJadwal = data.sort(compareFromLowest('term')).sort(compareFromLowest('bulan'))
    this.dtTrigger.next()
  }

  onClickDetail(data) {
    // const getUrl = () => {
    //   switch (this.type) {
    //     case 'botrans':
    //       return ''
    //     default:
    //       return ''
    //   }
    // }
    // if (getUrl()) {
    // }
    // this.router.navigateByUrl(`/${this.type}?tahun=${this.tahun}&bulan=${data.bulan}&term=${data.term}`)
    this.router.navigate([`/${this.type}/`], {
      queryParams: { tahun: this.tahun, bulan: data.bulan, term: data.term, u: this.userId },
    })
  }

  onBack() {
    this.router.navigate(['/bo/users/', this.type], { queryParams: { tahun: this.tahun } })
  }
}
