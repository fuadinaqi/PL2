import { Component, OnDestroy, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Subject } from 'rxjs'
import { compareFromLowest } from '@/helpers/compare'

@Component({
  selector: 'app-transaksilist',
  templateUrl: './transaksilist.component.html',
  styleUrls: ['./transaksilist.component.scss'],
})
export class TransaksilistComponent implements OnInit, OnDestroy {
  public tahun = this.activatedRoute.snapshot.queryParams.tahun || ''
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

    this.http
      .get(
        this.config.apiBaseUrl + `api/PeriodePelaporan/TransaksiLelangbyTahun/${this.tahun}`,
        this.api.generateHeader()
      )
      .subscribe(
        (result: any) => {
          const sorted = result.data.sort(compareFromLowest('term')).sort(compareFromLowest('bulan'))
          const results = []
          sorted.forEach((el) => {
            const indexR = results.findIndex((r) => r.bulan === el.bulan)
            if (indexR === -1) {
              results.push(el)
            } else {
              results[indexR] = {
                ...results[indexR],
                jumlahLelang: results[indexR].jumlahLelang + el.jumlahLelang,
                laporanTransaksi: results[indexR].laporanTransaksi + el.laporanTransaksi,
                lisan: results[indexR].lisan + el.lisan,
                tertulis: results[indexR].tertulis + el.tertulis,
                email: results[indexR].email + el.email,
                closed: results[indexR].closed + el.closed,
                terbuka: results[indexR].terbuka + el.terbuka,
              }
            }
          })
          this.listJadwal = results
          this.dtTrigger.next()
        },
        (error) => {}
      )
  }
}
