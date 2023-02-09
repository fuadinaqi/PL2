import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { AuthService } from '@services/auth.service'
import * as XLSX from 'xlsx'
import { Subject } from 'rxjs'
import jsPDF from 'jspdf'
import { getMonthByNumber, getTermByNumber } from '@/helpers/date'
import { FormBuilder, FormControl } from '@angular/forms'
import pad from '@/helpers/pad'

@Component({
  selector: 'app-bphdetail',
  templateUrl: './bphdetail.component.html',
  styleUrls: ['./bphdetail.component.scss'],
})
export class BphdetailComponent implements OnInit {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term
  public parentId = this.route.snapshot.queryParams.parentId
  public idperiode = this.route.snapshot.queryParams.idperiode
  public userId = this.route.snapshot.queryParams.u

  public listTrans: Array<any>
  public idtrans: String
  public isempty: boolean = true
  public isP2pk: boolean = false

  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  isWillDownload = false
  excelTitle = `BPHTB Lelang ${getMonthByNumber(this.bulan)} ${this.tahun} (${new Date().toISOString().split('T')[0]})`

  dataTandaTerima = {
    nomorTandaTerima: 'PB-0001/PLII/2022',
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
            this.config.apiBaseUrl + 'api/LaporanRisalahLelangPengenaanBPHTB/Kirim' + '?id=' + id,
            null,
            this.api.generateHeaderWithParams({ id })
          )
          .subscribe(
            (data) => {
              console.log('post ressult ', data)
              this.toastr.info('BPHTB Terkirim ke Back Office PPPK')
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

    this.idtrans = this.route.snapshot.params['idtrans']
    let role = this.AuthService.getRole()
    console.log(role)
    if (role.toString() == 'UserPLII') {
      this.isP2pk = false
      this.onLoadData()
    } else {
      this.isP2pk = true
      this.onLoadData()
    }

    this.form.valueChanges.subscribe((v) => {
      if (v.countRequest >= this.drafts.length) {
        window.location.reload()
      }
    })
  }
  onLoadData() {
    let url = this.isP2pk ? '/P2PK' : ''
    this.http
      .get(this.config.apiBaseUrl + 'api/LaporanRisalahLelangPengenaanBPHTB' + url, this.api.generateHeader())
      .subscribe(
        (result: any) => {
          //this.listTrans = result.data
          this.listTrans = result.data.filter((trans) => [this.idtrans].includes(trans.transaksiLelangId))
          console.log(result)
          if (this.listTrans.length > 0) {
            this.isempty = false
            this.dtTrigger.next()
          }
        },
        (error) => {}
      )
  }
  onKirim(idtrans) {
    if (confirm('Apakah anda yakin ingin mengirim data?')) {
      console.log(idtrans)
      let url = this.isP2pk
        ? 'api/LaporanRisalahLelangPengenaanBPHTB/P2PK/BukaAkses'
        : 'api/LaporanRisalahLelangPengenaanBPHTB/Kirim'
      let msg = this.isP2pk ? 'BPHTB Terkirim ke Pejabat Lelang II' : 'BPHTB Terkirim ke Back Office PPPK'
      this.http.put(this.config.apiBaseUrl + url + '?id=' + idtrans, null, this.api.generateHeader()).subscribe(
        (data) => {
          console.log('post ressult ', data)
          this.toastr.info(msg)
          window.location.reload()
          // this.onLoadData()
        },
        (error) => {
          this.toastr.error('Tidak dapat mengirim data, coba kembali nanti')
          console.log(error)
        }
      )
    }
  }

  onHapus(id) {
    const API_URL = 'api/LaporanRisalahLelangPengenaanBPHTB/' + id
    if (confirm('Apakah Anda yakin ingin mehapus data ini')) {
      this.http.delete(this.config.apiBaseUrl + API_URL, this.api.generateHeader()).subscribe((data) => {
        this.toastr.info('Berhasil menghapus data')
        window.location.reload()
      })
    }
  }

  formatStatus(status) {
    switch (status) {
      case 'Draft Permohonan':
        return 'Draft'
        break
      case 'Permohonan Dikirim':
        return 'Terkirim ke BO'
        break
    }
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

  hanldeCetakTandaTerima(data) {
    this.dataTandaTerima.nomorTandaTerima = `PB-${pad(data.noUrutSurat)}/PLII/${this.tahun}`
    const doc = new jsPDF('l', 'mm', [297, 210])
    this.isWillDownloadTandaTerima = true
    setTimeout(() => {
      var elementHTML: any = document.querySelector('#tanda-terima')

      doc.html(elementHTML, {
        callback: (doc) => {
          // Save the PDF
          doc.save(`Tanda Terima Laporan Risalah Lelang untuk Penyetoran BPHTB.pdf`)
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
}
