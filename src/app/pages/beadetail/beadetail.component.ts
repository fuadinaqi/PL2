import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { AuthService } from '@services/auth.service'
import { Subject } from 'rxjs'
import { Location } from '@angular/common'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

@Component({
  selector: 'app-beadetail',
  templateUrl: './beadetail.component.html',
  styleUrls: ['./beadetail.component.scss'],
})
export class BeadetailComponent implements OnInit {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term
  public idperiode = this.route.snapshot.queryParams.idperiode

  public listTrans: Array<any>
  public idtrans: String
  public isempty: boolean = true
  public isP2pk: boolean = false

  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  isWillDownload = false

  dataTandaTerima = {
    nomorTandaTerima: 'PBL-0001/PLII/2022',
    nama: this.AuthService.user.NamaLengkapTanpaGelar,
    nomorIzin: '',
    tanggalSubmit: new Date(),
  }
  isWillDownloadTandaTerima = false
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    public AuthService: AuthService,
    public location: Location
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
  }
  onLoadData() {
    let url = this.isP2pk ? '/P2PK' : ''
    this.http.get(this.config.apiBaseUrl + 'api/LaporanPenyetoranBeaLelang' + url, this.api.generateHeader()).subscribe(
      (result: any) => {
        //this.listTrans = result.data
        this.listTrans = result.data.filter((trans) => [this.idtrans].includes(trans.transaksiLelangId))
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
      let url = this.isP2pk ? 'api/LaporanPenyetoranBeaLelang/P2PK/BukaAkses' : 'api/LaporanPenyetoranBeaLelang/Kirim'
      let msg = this.isP2pk ? 'Bea Terkirim ke Pejabat Lelang II' : 'Bea Terkirim ke Back Office PPPK'
      this.http.put(this.config.apiBaseUrl + url + '?id=' + idtrans, null, this.api.generateHeader()).subscribe(
        (data) => {
          console.log('post ressult ', data)
          this.toastr.info(msg)
          this.onLoadData()
        },
        (error) => {
          this.toastr.error('Tidak dapat mengirim data, coba kembali nanti')
          console.log(error)
        }
      )
    }
  }

  onHapus(id) {
    const API_URL = 'api/LaporanPenyetoranBeaLelang/' + id
    if (confirm('Apakah Anda yakin ingin mehapus data ini')) {
      this.http.delete(this.config.apiBaseUrl + API_URL).subscribe((data) => {
        this.toastr.info('Berhasil menghapus data')
        window.location.reload()
      })
    }
  }

  exportExcel(): void {
    this.isWillDownload = true

    setTimeout(() => {
      const TITLE = `Bea Lelang ${this.bulan} ${this.tahun} - ${this.term}`
      /* pass here the table id */
      let element = document.getElementById('table-download')
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

      /* save to file */
      XLSX.writeFile(wb, `${TITLE}.xlsx`)
      this.isWillDownload = false
      window.location.reload()
    }, 100)
  }

  hanldeCetakTandaTerima(data) {
    const doc = new jsPDF('l', 'mm', [297, 210])
    this.isWillDownloadTandaTerima = true
    setTimeout(() => {
      var elementHTML: any = document.querySelector('#tanda-terima')

      doc.html(elementHTML, {
        callback: (doc) => {
          // Save the PDF
          doc.save(`Tanda Terima Laporan Penyetoran Bea Lelang.pdf`)
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
