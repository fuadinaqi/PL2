import { Component, OnDestroy, OnInit } from '@angular/core'
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
import { getMonthByNumber, getTermByNumber } from '@/helpers/date'
import pad from '@/helpers/pad'

@Component({
  selector: 'app-ksdetail',
  templateUrl: './ksdetail.component.html',
  styleUrls: ['./ksdetail.component.scss'],
})
export class KsdetailComponent implements OnInit, OnDestroy {
  public tahun = this.route.snapshot.queryParams.tahun
  public userId = this.route.snapshot.queryParams.u
  public bulan = 1
  public term = 1
  public parentId = ''
  // public bulan = this.route.snapshot.queryParams.bulan
  // public term = this.route.snapshot.queryParams.term
  // public parentId = this.route.snapshot.queryParams.parentId

  public listTrans: Array<any>
  public idjadwal: String
  public isempty: boolean = true
  public isP2pk: boolean = false
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  isWillDownload = false
  excelTitle = `Penggunaan Kertas Sekuriti ${this.tahun}`

  dataTandaTerima = {
    nomorTandaTerima: 'LKS-0001/PLII/2022',
    nama: this.AuthService.user.NamaLengkapTanpaGelar,
    nomorIzin: '',
    tanggalSubmit: new Date(),
  }
  isWillDownloadTandaTerima = false

  dataDownload = []

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    public AuthService: AuthService
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

    this.idjadwal = this.route.snapshot.params['idtrans']

    let role = this.AuthService.getRole()
    console.log(role)
    if (role.toString() == 'UserPLII') {
      this.isP2pk = false
      this.loadTransaction()
    } else {
      this.isP2pk = true
      this.loadTransaction()
    }
  }
  loadTransaction() {
    let url = this.isP2pk
      ? `api/KertasSekuriti/P2PK/byTahun/${this.tahun}/${this.userId}`
      : `api/PeriodePelaporan/KertasSekuritibyTahun/${this.tahun}`

    this.http.get(this.config.apiBaseUrl + url, this.api.generateHeader()).subscribe(
      (result: any) => {
        if (result.data) {
          console.log(this.idjadwal)
          this.listTrans = result.data.filter((d) => this.tahun == d.tahun)
          if (this.isP2pk) {
            this.listTrans = this.listTrans.filter((el) => el.statusPengiriman === 'Permohonan Dikirim')
          }
          this.dataDownload = this.listTrans.map((x) => ({ ...x }))
          // : result.data.filter((trans) => [this.parentId].includes(trans.periodeLaporanId))
          if (this.listTrans.length > 0) {
            this.isempty = false
            this.dtTrigger.next()
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

  onBack() {
    if (this.isP2pk) {
      this.router.navigate(['/bo/users/boks'], { queryParams: { tahun: this.tahun } })
    } else {
      this.router.navigate(['/kslelang'])
    }
  }

  onKirim(idtrans) {
    if (confirm('Apakah anda yakin ingin mengirim data?')) {
      console.log(idtrans)
      let url = this.isP2pk ? 'api/KertasSekuriti/P2PK/BukaAkses' : 'api/KertasSekuriti/Kirim'
      let msg = this.isP2pk ? 'Transaksi Terkirim ke Pejabat Lelang II' : 'Transaksi Terkirim ke PPPK'
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
    const API_URL = 'api/KertasSekuriti/' + id
    if (confirm('Apakah Anda yakin ingin mehapus data ini')) {
      this.http.delete(this.config.apiBaseUrl + API_URL, this.api.generateHeader()).subscribe((data) => {
        this.toastr.info('Berhasil menghapus data')
        window.location.reload()
      })
    }
  }

  exportExcel(): void {
    this.listTrans.forEach((x, i) => {
      const urlKs = this.isP2pk ? 'api/KertasSekuriti/P2PK/' : 'api/KertasSekuriti/'
      this.http.get(this.config.apiBaseUrl + urlKs + x.id, this.api.generateHeader()).subscribe((res: any) => {
        const penambahan = res.data.isiKertasSekuritiModels.find((el) => el.status === 'Penambahan') || {}
        const penggunaan = res.data.isiKertasSekuritiModels.find((el) => el.status === 'Penggunaan') || {}
        const kutipanPengganti = res.data.isiKertasSekuritiModels.find((el) => el.status === 'Kutipan Pengganti') || {}
        const rusak = res.data.isiKertasSekuritiModels.find((el) => el.status === 'Rusak') || {}
        const hilang = res.data.isiKertasSekuritiModels.find((el) => el.status === 'Hilang') || {}

        this.dataDownload[i] = {
          ...this.dataDownload[i],
          penambahanObj: {
            nomorKertasSekuriti: penambahan.nomorKertasSekuriti,
            nomorRisalahLelang: penambahan.nomorRisalahLelang,
            nomorLotRisalahLelang: penambahan.nomorLotRisalahLelang,
            tanggalMutasi: penambahan.tanggalMutasi,
          },
          penggunaanObj: {
            nomorKertasSekuriti: penggunaan.nomorKertasSekuriti,
            nomorRisalahLelang: penggunaan.nomorRisalahLelang,
            nomorLotRisalahLelang: penggunaan.nomorLotRisalahLelang,
            tanggalMutasi: penggunaan.tanggalMutasi,
          },
          kutipanPenggantiObj: {
            nomorKertasSekuriti: kutipanPengganti.nomorKertasSekuriti,
            nomorRisalahLelang: kutipanPengganti.nomorRisalahLelang,
            nomorLotRisalahLelang: kutipanPengganti.nomorLotRisalahLelang,
            tanggalMutasi: kutipanPengganti.tanggalMutasi,
          },
          rusakObj: {
            nomorKertasSekuriti: rusak.nomorKertasSekuriti,
            nomorRisalahLelang: rusak.nomorRisalahLelang,
            nomorLotRisalahLelang: rusak.nomorLotRisalahLelang,
            tanggalMutasi: rusak.tanggalMutasi,
          },
          hilangObj: {
            nomorKertasSekuriti: hilang.nomorKertasSekuriti,
            nomorRisalahLelang: hilang.nomorRisalahLelang,
            nomorLotRisalahLelang: hilang.nomorLotRisalahLelang,
            tanggalMutasi: hilang.tanggalMutasi,
          },
        }
      })
    })

    this.isWillDownload = true

    setTimeout(() => {
      // const TITLE = `Penggunaan Kertas Sekuriti ${this.bulan} ${this.tahun} - ${this.term}`
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
    }, 500)
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
            doc.save(`Tanda Terima Laporan Penatausahaan Kertas Sekuriti.pdf`)
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

    this.dataTandaTerima.nomorTandaTerima = `LKS-${pad(data.noUrutSurat)}/PLII/${this.tahun}`
    if (data.tanggalKirim) {
      this.dataTandaTerima.tanggalSubmit = new Date(data.tanggalKirim)
    }
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

  sisaFromParams({ jumlahAwal = 0, penambahan = 0, penggunaan = 0, kutipanPengganti = 0, rusak = 0, hilang = 0 }) {
    return (
      Number(jumlahAwal || 0) +
      Number(penambahan || 0) -
      Number(penggunaan || 0) -
      Number(kutipanPengganti || 0) -
      Number(rusak || 0) -
      Number(hilang || 0)
    )
  }
}
