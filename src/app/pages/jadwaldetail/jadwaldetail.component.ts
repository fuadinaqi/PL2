import { Component } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Subject } from 'rxjs'
import * as XLSX from 'xlsx'
import { AuthService } from '@/services/auth.service'
import jsPDF from 'jspdf'
import { getMonthByNumber, getTermByNumber } from '@/helpers/date'
import { FormBuilder, FormControl } from '@angular/forms'
import pad from '@/helpers/pad'
@Component({
  selector: 'app-jadwaldetail',
  templateUrl: './jadwaldetail.component.html',
  styleUrls: ['./jadwaldetail.component.scss'],
})
export class JadwalDetailComponent {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term
  public userId = this.route.snapshot.queryParams.u

  public listJadwal: Array<any>
  public idperiode: String
  public isempty: boolean = true
  public nihil: boolean = false
  public isP2pk: boolean = false

  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  isWillDownload = false
  excelTitle = `Jadwal Lelang ${getMonthByNumber(this.bulan)} ${this.tahun} - ${getTermByNumber(this.term)} (${
    new Date().toISOString().split('T')[0]
  })`

  dataTandaTerima = {
    nomorTandaTerima: 'LJL-0001/PLII/2022',
    nama: this.authService.user.NamaLengkapTanpaGelar,
    nomorIzin: '',
    tanggalSubmit: new Date(),
  }
  isWillDownloadTandaTerima = false

  form = this.fb.group({
    countRequest: new FormControl(0),
  })

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    private authService: AuthService,
    private fb: FormBuilder
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
    this.form.valueChanges.subscribe((v) => {
      if (v.countRequest >= this.drafts.length) {
        window.location.reload()
      }
    })
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe()
  }
  loadJadwal() {
    const url = this.isP2pk
      ? `api/JadwalLelang/P2PK/byTahun/${this.tahun}/${this.userId}`
      : `api/JadwalLelang/AllPerPeriode/${this.idperiode}`

    this.http.get(this.config.apiBaseUrl + url, this.api.generateHeader()).subscribe(
      (result: any) => {
        if (this.isP2pk) {
          this.http
            .get(
              this.config.apiBaseUrl +
                `api/PeriodePelaporan/P2PK/WithParam?Tahun=${this.tahun}&Bulan=${this.bulan}&Term=${this.term}&UserId=${this.userId}`,
              this.api.generateHeader()
            )
            .subscribe((r: any) => {
              const periodeIds = []
              r.data.forEach((x) => {
                periodeIds.push(x.id)
              })
              this.nihil = r.data?.[0]?.nihil || false
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
        return 'Terkirim'
        break
    }
  }

  onLoadSamePage() {
    this.router.navigate(['/jadwaldetail/' + this.idperiode], {
      queryParams: { tahun: this.tahun, bulan: this.bulan, term: this.term },
    })
  }

  get drafts() {
    if (!this?.listJadwal?.length) return []
    return this.listJadwal.filter((el) => el.statusPengiriman == 'Draft Permohonan')
  }

  onKirimAll() {
    if (confirm('Apakah anda yakin ingin mengirim data ke PPPK?')) {
      this.drafts.forEach(({ id }) => {
        this.http
          .put(
            this.config.apiBaseUrl + 'api/JadwalLelang/Kirim' + '?id=' + id,
            null,
            this.api.generateHeaderWithParams({ id })
          )
          .subscribe(
            (data) => {
              console.log('post ressult ', data)
              this.toastr.info('Jadwal Terkirim ke P2PK')
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
            window.location.reload()
            // this.onLoadSamePage()
            // this.loadJadwal()
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
      this.http.delete(this.config.apiBaseUrl + API_URL, this.api.generateHeader()).subscribe((data) => {
        this.toastr.info('Berhasil menghapus data')
        window.location.reload()
      })
    }
  }

  exportExcel(): void {
    this.isWillDownload = true

    setTimeout(() => {
      // const TITLE = `Jadwal Lelang ${this.bulan} ${this.tahun} - ${this.term}`
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

    this.dataTandaTerima.nomorTandaTerima = `LJL-${pad(data.noUrutSurat)}/PLII/${data.tahun}`
    if (data.tanggalKirimBO) {
      this.dataTandaTerima.tanggalSubmit = new Date(data.tanggalKirimBO)
    }
    if (!this.isP2pk) {
      this.dataTandaTerima.nama = this.authService.user.NamaLengkapTanpaGelar
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
