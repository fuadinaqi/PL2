import { Component, OnDestroy, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Subject } from 'rxjs'
import { compareFromLowest } from '@/helpers/compare'
import { DATA_EXECPT_JADWAL, DATA_JADWAL } from './constants'

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

    const data = this.type === 'bojadwal' ? DATA_JADWAL : DATA_EXECPT_JADWAL

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
