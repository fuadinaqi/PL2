import { Component, OnDestroy, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { AuthService } from '@services/auth.service'
import { Subject } from 'rxjs'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import { getMonthByNumber, getTermByNumber } from '@/helpers/date'
import { FormBuilder, FormControl } from '@angular/forms'
import pad from '@/helpers/pad'

@Component({
  selector: 'app-transaksidetail',
  templateUrl: './transaksidetail.component.html',
  styleUrls: ['./transaksidetail.component.scss'],
})
export class TransaksidetailComponent implements OnInit, OnDestroy {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term
  public parentId = this.route.snapshot.queryParams.parentId
  public userId = this.route.snapshot.queryParams.u

  public listTrans: Array<any>
  public idjadwal: String
  public isempty: boolean = true
  public isP2pk: boolean = false
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  isWillDownload = false
  excelTitle = `Transaksi Lelang ${getMonthByNumber(this.bulan)} ${this.tahun} - ${getTermByNumber(this.term)} (${
    new Date().toISOString().split('T')[0]
  })`

  dataTandaTerima = {
    nomorTandaTerima: 'TL-0001/PLII/2022',
    nama: this.AuthService.user.NamaLengkapTanpaGelar,
    nomorIzin: '',
    tanggalSubmit: new Date(),
  }
  isWillDownloadTandaTerima = false

  form = this.fb.group({
    countRequest: new FormControl(0),
  })
  get drafts() {
    if (!this?.listTrans?.length) return []
    return this.listTrans.filter((el) => el.statusPengiriman == 'Draft Permohonan')
  }

  onKirimAll() {
    if (confirm('Apakah anda yakin ingin mengirim data ke PPPK?')) {
      this.drafts.forEach(({ id }) => {
        this.http
          .put(
            this.config.apiBaseUrl + 'api/TransaksiLelang/Kirim' + '?id=' + id,
            null,
            this.api.generateHeaderWithParams({ id })
          )
          .subscribe(
            (data) => {
              console.log('post ressult ', data)
              this.toastr.info('Transaksi Terkirim ke PPPK')
              this.form.patchValue({
                countRequest: this.form.value.countRequest + 1,
              })
            },
            (error) => {
              this.toastr.error('Tidak dapat mengirim data, Periksa kembali data Anda')
              this.form.patchValue({
                countRequest: this.form.value.countRequest + 1,
              })
              console.log(error)
            }
          )
      })
    }
  }

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    public AuthService: AuthService,
    private fb: FormBuilder
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

    this.idjadwal = this.route.snapshot.params['idjadwal']

    let role = this.AuthService.getRole()
    console.log(role)
    if (role.toString() == 'UserPLII') {
      this.isP2pk = false
      this.loadTransaction()
    } else {
      this.isP2pk = true
      this.loadTransaction()
    }

    this.form.valueChanges.subscribe((v) => {
      if (v.countRequest >= this.drafts.length) {
        window.location.reload()
      }
    })
  }
  loadTransaction() {
    let url = this.isP2pk ? `/P2PK/byTahun/${this.tahun}/${this.userId}` : ''

    this.http.get(this.config.apiBaseUrl + 'api/TransaksiLelang' + url, this.api.generateHeader()).subscribe(
      (result: any) => {
        if (result.data) {
          if (this.isP2pk) {
            this.http
              .get(
                this.config.apiBaseUrl +
                  `api/PeriodePelaporan/P2PK/WithParam?Tahun=${this.tahun}&Bulan=${this.bulan}&UserId=${this.userId}`,
                this.api.generateHeader()
              )
              .subscribe((r: any) => {
                const jadwalIds = []
                r.data.forEach((x) => {
                  x.jadwalLelangModels.forEach((j) => {
                    jadwalIds.push(j.id)
                  })
                })
                this.listTrans = result.data.filter((trans) => jadwalIds.indexOf(trans.jadwalLelangId) !== -1)
                if (this.listTrans.length > 0) {
                  this.isempty = false
                  this.dtTrigger.next()
                }
              })
          } else {
            this.listTrans = this.isP2pk
              ? result.data
              : result.data.filter((trans) => [this.idjadwal].includes(trans.jadwalLelangId))
            if (this.listTrans.length > 0) {
              this.isempty = false
              this.dtTrigger.next()
            }
          }
        }
        console.log(result)
      },
      (error) => {}
    )
  }
  formatStatus(status) {
    switch (status) {
      case 'Draft Permohonan':
        return 'Draft'
        break
      case 'Permohonan Dikirim':
        return 'Terkirim'
        break
    }
  }
  onKirim(idtrans) {
    if (confirm('Apakah anda yakin ingin mengirim data?')) {
      console.log(idtrans)
      let url = this.isP2pk ? 'api/TransaksiLelang/P2PK/BukaAkses' : 'api/TransaksiLelang/Kirim'
      let msg = this.isP2pk ? 'Terkirim ke Pejabat Lelang II' : 'Transaksi Terkirim ke PPPK'
      this.http.put(this.config.apiBaseUrl + url + '?id=' + idtrans, null, this.api.generateHeader()).subscribe(
        (data) => {
          console.log('post ressult ', data)
          this.toastr.info(msg)
          window.location.reload()
          // this.loadTransaction()
        },
        (error) => {
          this.toastr.error('Tidak dapat mengirim data, coba kembali nanti')
          console.log(error)
        }
      )
    }
  }

  onHapus(id) {
    const API_URL = 'api/TransaksiLelang/' + id
    if (confirm('Apakah Anda yakin ingin mehapus data ini')) {
      this.http.delete(this.config.apiBaseUrl + API_URL, this.api.generateHeader()).subscribe((data) => {
        this.toastr.info('Berhasil menghapus data')
        window.location.reload()
      })
    }
  }

  exportExcel(): void {
    this.isWillDownload = true

    setTimeout(() => {
      // const TITLE = `Transaksi Lelang ${this.bulan} ${this.tahun} - ${this.term}`
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

  hanldeCetakTandaTerima(data) {
    const send = () => {
      const doc = new jsPDF('l', 'mm', [297, 210])
      this.isWillDownloadTandaTerima = true
      setTimeout(() => {
        var elementHTML: any = document.querySelector('#tanda-terima')

        doc.html(elementHTML, {
          callback: (doc) => {
            // Save the PDF
            doc.save(`Tanda Terima Laporan Transaksi Lelang.pdf`)
          },
          margin: [10, 10, 0, 10],
          autoPaging: 'text',
          x: 0,
          y: 0,
          width: 277, //target width in the PDF document
          windowWidth: 675, //window width in CSS pixels
        })

        this.isWillDownloadTandaTerima = false
      }, 0)
    }

    this.dataTandaTerima.nomorTandaTerima = `TL-${pad(data.noUrutSurat)}/PLII/${this.tahun}`

    if (data.tanggalKirimBO) {
      this.dataTandaTerima.tanggalSubmit = new Date(data.tanggalKirimBO)
    }
    if (!this.isP2pk) {
      this.dataTandaTerima.nama = this.AuthService.user.NamaLengkapTanpaGelar
      send()
    } else {
      this.http
        .get(this.config.apiBaseUrl + `api/JadwalLelang/P2PK/userPerTahun/${this.tahun}`, this.api.generateHeader())
        .subscribe((result: any) => {
          const user = result.data.find((el) => el.userId === this.userId) || {}
          this.dataTandaTerima.nama = user.namaLengkapTanpaGelar || ''
          send()
        })
    }
  }
}
