import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { ActivatedRoute, Router } from '@angular/router'
import { compareFromHighest } from '@/helpers/compare'
import { Subject } from 'rxjs'
import * as XLSX from 'xlsx'
import { getMonthByNumber } from '@/helpers/date'

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
})
export class MonitoringComponent {
  public tahun = this.activatedRoute.snapshot.queryParams.tahun
  public title = ''
  public listPeriode: Array<any> = []
  public listMonth = [
    {
      value: 1,
      label: 'Januari'
    },
    {
      value: 2,
      label: 'Februari'
    },
    {
      value: 3,
      label: 'Maret'
    },
    {
      value: 4,
      label: 'April'
    },
    {
      value: 5,
      label: 'Mei'
    },
    {
      value: 6,
      label: 'Juni'
    },
    {
      value: 7,
      label: 'Juli'
    },
    {
      value: 8,
      label: 'Agustus'
    },
    {
      value: 9,
      label: 'September'
    },
    {
      value: 10,
      label: 'Oktober'
    },
    {
      value: 11,
      label: 'November'
    },
    {
      value: 12,
      label: 'Desember'
    },
  ]
  month = 1
  onChangeMonth(val) {
    this.month = val
    this.initData()
  }

  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  masterFO = []
  masterData = []
  data = []

  isWillDownload = false
  excelTitle = `Monitoring ${getMonthByNumber(this.month)} ${this.tahun} (${new Date().toISOString().split('T')[0]})`

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    }

    this.http
      .get(this.config.apiBaseUrl + 'api/Monitoring/getAllFO', this.api.generateHeader())
      .subscribe(
        (resultAllFO: any) => {
          this.http
          .get(this.config.apiBaseUrl + `api/Monitoring/index/${this.tahun}`, this.api.generateHeader())
          .subscribe((resultData: any) => {
              this.masterFO = resultAllFO.data.map(x => ({
                ...x,
                nomorIzin: Math.round(Math.random() * 72324),
                nomorKMK: `KMK-${Math.round(Math.random() * 72324)}`
              }))
              this.masterData = resultData.data
              this.initData()
              this.dtTrigger.next()
            })
        },
        (error) => {}
      )
  }

  initData() {
    const getFilteredMapByBulanByUserId = (userId) => {
      return this.masterData.find(d => d.userId === userId && d.bulan == this.month) || {}
    }

    this.data = this.masterFO.map(el => ({
      ...el,
      ...getFilteredMapByBulanByUserId(el.id)
    }))
  }

  exportExcel(): void {
    this.isWillDownload = true

    setTimeout(() => {
      // const TITLE = `BPHTB Lelang ${this.bulan} ${this.tahun} - ${this.term}`
      /* pass here the table id */
      let element = document.getElementById('table-download')
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

      /* save to file */
      XLSX.writeFile(wb, `${this.excelTitle}.xlsx`)
      this.isWillDownload = false
      window.location.reload()
    }, 100)
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe()
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public periodeLaporan: Periode,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}
}
