import { Component } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Subject } from 'rxjs'
import * as XLSX from 'xlsx'
import { AuthService } from '@/services/auth.service'
import jsPDF from 'jspdf'
@Component({
  selector: 'app-jadwaldetail',
  templateUrl: './jadwaldetail.component.html',
  styleUrls: ['./jadwaldetail.component.scss'],
})
export class JadwalDetailComponent {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term

  public listJadwal: Array<any>
  public idperiode: String
  public isempty: boolean = true
  public nihil: boolean = true
  public isP2pk: boolean = false

  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  isWillDownload = false

  dataTandaTerima = {
    nomorTandaTerima: 'LJL-0001/PLII/2022',
    nama: this.authService.user.NamaLengkapTanpaGelar,
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
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    }
    this.idperiode = this.route.snapshot.params['idperiode']
    let role = this.authService.getRole()
    if (role.toString() == 'UserPLII') {
      this.isP2pk = false
      this.loadJadwal()
    } else {
      this.isP2pk = true
      this.loadJadwal()
    }
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe()
  }
  loadJadwal() {
    const url = this.isP2pk
      ? `api/JadwalLelang/P2PK/byTahun/${this.tahun}`
      : `api/JadwalLelang/AllPerPeriode/${this.idperiode}`

    this.http.get(this.config.apiBaseUrl + url, this.api.generateHeader()).subscribe(
      (result: any) => {
        if (this.isP2pk) {
          this.http
            .get(
              this.config.apiBaseUrl +
                `api/PeriodePelaporan/P2PK/WithParam?Tahun=${this.tahun}&Bulan=${this.bulan}&Term=${this.term}`,
              this.api.generateHeader()
            )
            .subscribe((r: any) => {
              const periodeIds = []
              r.data.forEach((x) => {
                periodeIds.push(x.id)
              })
              this.listJadwal = result.data.filter((jadwal) => periodeIds.indexOf(jadwal.periodeLaporanId) !== -1)
              if (this.listJadwal.length > 0) {
                this.isempty = false
                this.dtTrigger.next()
              }
            })
        } else {
          this.listJadwal = result.data
          console.log(result)
          if (this.listJadwal.length > 0) {
            this.isempty = false
            this.dtTrigger.next()
          }
        }
      },
      (error) => {}
    )

    if (!this.isP2pk) {
      this.http
        .get(this.config.apiBaseUrl + 'api/PeriodePelaporan/' + this.idperiode, this.api.generateHeader())
        .subscribe(
          (result: any) => {
            this.tahun = result.data.tahun
            this.nihil = result.data.nihil
          },
          (error) => {}
        )
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

  onLoadSamePage() {
    this.router.navigate(['/jadwaldetail/' + this.idperiode], {
      queryParams: { tahun: this.tahun, bulan: this.bulan, term: this.term },
    })
  }

  onKirim(idjadwal) {
    console.log(idjadwal)
    if (confirm('Apakah anda yakin ingin mengirim data ke PPPK?')) {
      console.log(idjadwal)
      let url = this.isP2pk ? 'api/JadwalLelang/P2PK/BukaAkses' : 'api/JadwalLelang/Kirim'
      let msg = this.isP2pk ? 'Jadwal Terkirim ke Pejabat Lelang II' : 'Jadwal Terkirim ke P2PK'
      const bodyreq = { id: idjadwal }
      this.http
        .put(this.config.apiBaseUrl + url + '?id=' + idjadwal, null, this.api.generateHeaderWithParams(bodyreq))
        .subscribe(
          (data) => {
            console.log('post ressult ', data)
            this.toastr.info(msg)
            this.onLoadSamePage()
            this.loadJadwal()
          },
          (error) => {
            this.toastr.error('Tidak dapat mengirim data, Periksa kembali data Anda')
            console.log(error)
          }
        )
    }
  }

  onChangeNihil(event) {
    this.nihil = event.target.checked
  }

  onSubmitNihil() {
    const CONFIRM_MSG = this.nihil
      ? 'Apakah Anda yakin ingin membuat periode ini Nihil?'
      : 'Apakah Anda yakin ingin membuat periode ini tidak Nihil?'
    if (confirm(CONFIRM_MSG)) {
      const bodyreq = { id: this.idperiode, nihil: this.nihil }
      this.http
        .post(
          this.config.apiBaseUrl + 'api/PeriodePelaporan/nihil',
          bodyreq,
          this.api.generateHeaderWithParams(bodyreq)
        )
        .subscribe((data) => {
          const SUCCESS_MSG = this.nihil ? 'Berhasil membuat periode Nihil' : 'Berhasil membuat periode tidak Nihil'
          this.toastr.info(SUCCESS_MSG)
          this.onLoadSamePage()
          this.loadJadwal()
        })
    }
  }

  onHapus(id) {
    const API_URL = 'api/JadwalLelang/' + id
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
      const TITLE = `Jadwal Lelang ${this.bulan} ${this.tahun} - ${this.term}`
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
          doc.save(`Tanda Terima Laporan Jadwal Lelang.pdf`)
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
