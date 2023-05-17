import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Periode } from '@/type/periode'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { ActivatedRoute, Router } from '@angular/router'
import { compareFromHighest } from '@/helpers/compare'
import { Subject } from 'rxjs'
import * as XLSX from 'xlsx'
import { TITLES, type TitleType } from './constants'
import { ToastrService } from 'ngx-toastr'
import { UserService } from '@services/user.service'

@Component({
  selector: 'app-bousers',
  templateUrl: './bousers.component.html',
})
export class BoUsersComponent {
  public tahun = this.activatedRoute.snapshot.queryParams.tahun
  public type = this.activatedRoute.snapshot.params.type
  public listPeriode: Array<any>
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  isWillDownload = false
  excelTitle = `File ${this.tahun} (${new Date().toISOString().split('T')[0]})`
  listDownload = []
  titleListDownload: TitleType = []

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    }

    this.listPeriode = JSON.parse(localStorage.getItem('periode'))
    if (!this.listPeriode) {
      this.listPeriode = []
      this.user.users = []
      localStorage.setItem('usersx', '[]')
    }

    this.http
      .get(this.config.apiBaseUrl + `api/JadwalLelang/P2PK/userPerTahun/${this.tahun}`, this.api.generateHeader())
      .subscribe(
        (result: any) => {
          this.listPeriode = result.data
          this.user.users = result.data
          localStorage.setItem('usersx', JSON.stringify(result.data))
          this.dtTrigger.next()
        },
        (error) => {}
      )
  }

  get title(): string {
    switch (this.type) {
      case 'bojadwal': {
        return `Jadwal Lelang per User Periode ${this.tahun}`
      }
      case 'botrans': {
        return `Transaksi Lelang per User Periode ${this.tahun}`
      }
      case 'bobea': {
        return `Bea Lelang per User Periode ${this.tahun}`
      }
      case 'bobph': {
        return `BPHTB Lelang per User Periode ${this.tahun}`
      }
      case 'boks': {
        return `Kertas Sekuriti per User Periode ${this.tahun}`
      }
      default: {
        return ''
      }
    }
  }

  clickDetail(tahun: any, userId: string) {
    if (this.type !== 'boks') {
      this.router.navigateByUrl(`/bo/${this.type}/list?tahun=${tahun}&u=${userId}`)
    } else {
      this.router.navigateByUrl(`/boks?tahun=${tahun}&u=${userId}`)
    }
  }

  exportExcel({ namaLengkapTanpaGelar, userId }): void {
    const getDownload = (timeout = 100) => {
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
        // window.location.reload()
      }, timeout)
    }

    const getExcelTitle = () => {
      switch (this.type) {
        case 'bojadwal': {
          this.excelTitle = `Jadwal Lelang ${this.tahun} (${new Date().toISOString().split('T')[0]})`
          break
        }
        case 'botrans': {
          this.excelTitle = `Transaksi Lelang ${this.tahun} (${new Date().toISOString().split('T')[0]})`
          break
        }
        case 'bobea': {
          this.excelTitle = `Bea Lelang ${this.tahun} (${new Date().toISOString().split('T')[0]})`
          break
        }
        case 'bobph': {
          this.excelTitle = `BPHTB Lelang ${this.tahun} (${new Date().toISOString().split('T')[0]})`
          break
        }
        case 'boks': {
          this.excelTitle = `Kertas Sekuriti ${this.tahun} (${new Date().toISOString().split('T')[0]})`
          break
        }
        default: {
          this.excelTitle = ''
          break
        }
      }
    }

    const getListDownload = () => {
      switch (this.type) {
        case 'bojadwal': {
          this.titleListDownload = TITLES.jadwal
          this.http
            .get(
              this.config.apiBaseUrl + `api/JadwalLelang/P2PK/byTahun/${this.tahun}/${userId}`,
              this.api.generateHeader()
            )
            .subscribe(
              (result: any) => {
                this.http
                  .get(
                    this.config.apiBaseUrl + `api/PeriodePelaporan/P2PK/WithParam?Tahun=${this.tahun}&UserId=${userId}`,
                    this.api.generateHeader()
                  )
                  .subscribe(
                    (r: any) => {
                      const periodeIds = []
                      r.data.forEach((x) => {
                        periodeIds.push(x.id)
                      })
                      this.listDownload = result.data
                        .filter((jadwal) => periodeIds.indexOf(jadwal.periodeLaporanId) !== -1)
                        .map((el) => ({ ...el, namaLengkapTanpaGelar }))
                      getDownload()
                    },
                    (error) => {
                      if (error.status === 404) {
                        this.toastr.info('Belum ada data di tahun ini')
                      }
                    }
                  )
              },
              (error) => {
                if (error.status === 404) {
                  this.toastr.info('Belum ada data di tahun ini')
                }
              }
            )
          break
        }
        case 'botrans': {
          this.titleListDownload = TITLES.transaksiLelang

          this.http
            .get(
              this.config.apiBaseUrl + 'api/TransaksiLelang' + `/P2PK/byTahun/${this.tahun}/${userId}`,
              this.api.generateHeader()
            )
            .subscribe(
              (result: any) => {
                if (result.data) {
                  this.http
                    .get(
                      this.config.apiBaseUrl +
                        `api/PeriodePelaporan/P2PK/WithParam?Tahun=${this.tahun}&UserId=${userId}`,
                      this.api.generateHeader()
                    )
                    .subscribe(
                      (r: any) => {
                        const jadwalIds = []
                        r.data.forEach((x) => {
                          x.jadwalLelangModels.forEach((j) => {
                            jadwalIds.push(j.id)
                          })
                        })
                        this.listDownload = result.data
                          .filter((trans) => jadwalIds.indexOf(trans.jadwalLelangId) !== -1)
                          .map((el) => ({ ...el, namaLengkapTanpaGelar }))
                        getDownload()
                      },
                      (error) => {
                        if (error.status === 404) {
                          this.toastr.info('Belum ada data di tahun ini')
                        }
                      }
                    )
                }
              },
              (error) => {
                if (error.status === 404) {
                  this.toastr.info('Belum ada data di tahun ini')
                }
              }
            )
          break
        }
        case 'bobea': {
          this.titleListDownload = TITLES.beaLelang

          this.http
            .get(
              this.config.apiBaseUrl + `api/LaporanPenyetoranBeaLelang/P2PK/byTahun/${this.tahun}/${userId}`,
              this.api.generateHeader()
            )
            .subscribe(
              (result: any) => {
                this.listDownload = result.data
                  .filter((d) => d.userId === userId)
                  .map((el) => ({ ...el, namaLengkapTanpaGelar }))
                getDownload()
              },
              (error) => {
                if (error.status === 404) {
                  this.toastr.info('Belum ada data di tahun ini')
                }
              }
            )
          break
        }
        case 'bobph': {
          this.titleListDownload = TITLES.bphtb

          this.http
            .get(
              this.config.apiBaseUrl + `api/LaporanRisalahLelangPengenaanBPHTB/P2PK/byTahun/${this.tahun}/${userId}`,
              this.api.generateHeader()
            )
            .subscribe(
              (result: any) => {
                this.listDownload = result.data
                  .filter((d) => d.userId === userId)
                  .map((el) => ({ ...el, namaLengkapTanpaGelar }))
                getDownload()
              },
              (error) => {
                if (error.status === 404) {
                  this.toastr.info('Belum ada data di tahun ini')
                }
              }
            )
          break
        }
        case 'boks': {
          this.titleListDownload = TITLES.ks

          this.http
            .get(
              this.config.apiBaseUrl + `api/KertasSekuriti/P2PK/byTahun/${this.tahun}/${userId}`,
              this.api.generateHeader()
            )
            .subscribe(
              (result: any) => {
                if (result.data) {
                  this.listDownload = result.data
                    .filter((d) => this.tahun == d.tahun)
                    .map((el) => ({ ...el, namaLengkapTanpaGelar }))
                  this.listDownload.forEach((x, i) => {
                    this.http
                      .get(this.config.apiBaseUrl + 'api/KertasSekuriti/P2PK/' + x.id, this.api.generateHeader())
                      .subscribe((res: any) => {
                        const penambahan =
                          res.data.isiKertasSekuritiModels.find((el) => el.status === 'Penambahan') || {}
                        const penggunaan =
                          res.data.isiKertasSekuritiModels.find((el) => el.status === 'Penggunaan') || {}
                        const kutipanPengganti =
                          res.data.isiKertasSekuritiModels.find((el) => el.status === 'Kutipan Pengganti') || {}
                        const rusak = res.data.isiKertasSekuritiModels.find((el) => el.status === 'Rusak') || {}
                        const hilang = res.data.isiKertasSekuritiModels.find((el) => el.status === 'Hilang') || {}

                        this.listDownload[i] = {
                          ...this.listDownload[i],
                          penambahan_nomorKertasSekuriti: penambahan.nomorKertasSekuriti,
                          penambahan_nomorRisalahLelang: penambahan.nomorRisalahLelang,
                          penambahan_nomorLotRisalahLelang: penambahan.nomorLotRisalahLelang,
                          penambahan_tanggalMutasi: penambahan.tanggalMutasi,

                          penggunaan_nomorKertasSekuriti: penggunaan.nomorKertasSekuriti,
                          penggunaan_nomorRisalahLelang: penggunaan.nomorRisalahLelang,
                          penggunaan_nomorLotRisalahLelang: penggunaan.nomorLotRisalahLelang,
                          penggunaan_tanggalMutasi: penggunaan.tanggalMutasi,

                          kutipanPengganti_nomorKertasSekuriti: kutipanPengganti.nomorKertasSekuriti,
                          kutipanPengganti_nomorRisalahLelang: kutipanPengganti.nomorRisalahLelang,
                          kutipanPengganti_nomorLotRisalahLelang: kutipanPengganti.nomorLotRisalahLelang,
                          kutipanPengganti_tanggalMutasi: kutipanPengganti.tanggalMutasi,

                          rusak_nomorKertasSekuriti: rusak.nomorKertasSekuriti,
                          rusak_nomorRisalahLelang: rusak.nomorRisalahLelang,
                          rusak_nomorLotRisalahLelang: rusak.nomorLotRisalahLelang,
                          rusak_tanggalMutasi: rusak.tanggalMutasi,

                          hilang_nomorKertasSekuriti: hilang.nomorKertasSekuriti,
                          hilang_nomorRisalahLelang: hilang.nomorRisalahLelang,
                          hilang_nomorLotRisalahLelang: hilang.nomorLotRisalahLelang,
                          hilang_tanggalMutasi: hilang.tanggalMutasi,
                        }
                      })
                  })
                  getDownload(500)
                }
              },
              (error) => {
                if (error.status === 404) {
                  this.toastr.info('Belum ada data di tahun ini')
                }
              }
            )
          break
        }
        default: {
          this.listDownload = []
          break
        }
      }
    }

    getExcelTitle()
    getListDownload()
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
    private config: AppConfigService,
    private toastr: ToastrService,
    private user: UserService
  ) {}
}
