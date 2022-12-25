import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { v4 as uuidv4 } from 'uuid'
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'

@Component({
  selector: 'app-ksadd',
  templateUrl: './ksadd.component.html',
  styleUrls: ['./ksadd.component.scss'],
})
export class KsaddComponent implements OnInit {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term
  public parentId = this.route.snapshot.queryParams.parentId

  public id: string
  public isAddMode: boolean
  public isEditMode: boolean
  public isPreview: boolean
  public ksForm: UntypedFormGroup
  public idperiode: any
  public idpreview: any
  public bph: any
  public listTrans: Array<any>
  public trans: any = {}

  public data: any = {
    tahun: this.tahun,
    bulan: this.bulan,
    term: this.term,
    triwulan: '1',
    jumlahAwal: null,
    isiKertasSekuritiModels: [
      {
        status: 'Penambahan',
        nomorKertasSekuriti: '',
        nomorRisalahLelang: '',
        nomorLotRisalahLelang: '',
        tanggalMutasi: null,
        jumlahMutasi: 0,
      },
      {
        status: 'Penggunaan',
        nomorKertasSekuriti: '',
        nomorRisalahLelang: '',
        nomorLotRisalahLelang: '',
        tanggalMutasi: null,
        jumlahMutasi: 0,
      },
      {
        status: 'Kutipan Pengganti',
        nomorKertasSekuriti: '',
        nomorRisalahLelang: '',
        nomorLotRisalahLelang: '',
        tanggalMutasi: null,
        jumlahMutasi: 0,
      },
      {
        status: 'Rusak',
        nomorKertasSekuriti: '',
        nomorRisalahLelang: '',
        nomorLotRisalahLelang: '',
        tanggalMutasi: null,
        jumlahMutasi: 0,
      },
      {
        status: 'Hilang',
        nomorKertasSekuriti: '',
        nomorRisalahLelang: '',
        nomorLotRisalahLelang: '',
        tanggalMutasi: null,
        jumlahMutasi: 0,
      },
    ],
  }

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    this.idperiode = this.route.snapshot.params['idperiode']
    this.idpreview = this.route.snapshot.params['idpreview']
    this.isAddMode = this.idperiode ? true : false
    this.isPreview = this.idpreview ? true : false
    this.isEditMode = this.id ? true : false
    this.http
      .get(this.config.apiBaseUrl + 'api/TransaksiLelang', this.api.generateHeader())
      .subscribe((result: any) => {
        this.listTrans = result.data.map((x) => ({ ...x, nomorRisalahLelang: String(x.nomorRisalahLelang) }))

        if (this.isEditMode || this.isPreview) {
          const selectedId = this.isEditMode ? this.id : this.idpreview
          this.http
            .get(this.config.apiBaseUrl + 'api/KertasSekuriti/' + selectedId, this.api.generateHeader())
            .subscribe((res: any) => {
              const penambahan = res.data.isiKertasSekuritiModels.find((el) => el.status === 'Penambahan') || {}
              const penggunaan = res.data.isiKertasSekuritiModels.find((el) => el.status === 'Penggunaan') || {}
              const kutipanPengganti =
                res.data.isiKertasSekuritiModels.find((el) => el.status === 'Kutipan Pengganti') || {}
              const rusak = res.data.isiKertasSekuritiModels.find((el) => el.status === 'Rusak') || {}
              const hilang = res.data.isiKertasSekuritiModels.find((el) => el.status === 'Hilang') || {}

              this.data = {
                id: this.id,
                triwulan: res.data.triwulan,
                jumlahAwal: res.data.jumlahAwal,
                isiKertasSekuritiModels: [
                  {
                    id: penambahan.id,
                    status: 'Penambahan',
                    nomorKertasSekuriti: penambahan.nomorKertasSekuriti,
                    nomorRisalahLelang: penambahan.nomorRisalahLelang,
                    nomorLotRisalahLelang: penambahan.nomorLotRisalahLelang,
                    tanggalMutasi: penambahan.tanggalMutasi.split('T')[0],
                    jumlahMutasi: penambahan.jumlahMutasi,
                  },
                  {
                    id: penggunaan.id,
                    status: 'Penggunaan',
                    nomorKertasSekuriti: penggunaan.nomorKertasSekuriti,
                    nomorRisalahLelang: penggunaan.nomorRisalahLelang,
                    nomorLotRisalahLelang: penggunaan.nomorLotRisalahLelang,
                    tanggalMutasi: penggunaan.tanggalMutasi.split('T')[0],
                    jumlahMutasi: penggunaan.jumlahMutasi,
                  },
                  {
                    id: kutipanPengganti.id,
                    status: 'Kutipan Pengganti',
                    nomorKertasSekuriti: kutipanPengganti.nomorKertasSekuriti,
                    nomorRisalahLelang: kutipanPengganti.nomorRisalahLelang,
                    nomorLotRisalahLelang: kutipanPengganti.nomorLotRisalahLelang,
                    tanggalMutasi: kutipanPengganti.tanggalMutasi.split('T')[0],
                    jumlahMutasi: kutipanPengganti.jumlahMutasi,
                  },
                  {
                    id: rusak.id,
                    status: 'Rusak',
                    nomorKertasSekuriti: rusak.nomorKertasSekuriti,
                    nomorRisalahLelang: rusak.nomorRisalahLelang,
                    nomorLotRisalahLelang: rusak.nomorLotRisalahLelang,
                    tanggalMutasi: rusak.tanggalMutasi.split('T')[0],
                    jumlahMutasi: rusak.jumlahMutasi,
                  },
                  {
                    id: hilang.id,
                    status: 'Hilang',
                    nomorKertasSekuriti: hilang.nomorKertasSekuriti,
                    nomorRisalahLelang: hilang.nomorRisalahLelang,
                    nomorLotRisalahLelang: hilang.nomorLotRisalahLelang,
                    tanggalMutasi: hilang.tanggalMutasi.split('T')[0],
                    jumlahMutasi: hilang.jumlahMutasi,
                  },
                ],
              }
              console.log(this.data)
            })
        }
      })
  }
  savetransaksi() {
    if (confirm('Apakah anda sudah mengisi data dengan lengkap dan benar?')) {
      const method = this.isEditMode ? 'put' : 'post'
      const url = this.isEditMode ? `api/KertasSekuriti/${this.id}` : 'api/KertasSekuriti'
      this.http[method](this.config.apiBaseUrl + url, this.data, this.api.generateHeader()).subscribe(
        (data) => {
          console.log('post ressult ', data)
          this.toastr.info('Data Tersimpan')
          this.router.navigate(['/ksdetail/' + this.idperiode], { queryParams: { ...this.route.snapshot.queryParams } })
        },
        (error) => {
          this.toastr.error('Tidak dapat menyimpan Kertas Sekuriti, Periksa kembali isian Anda')
          console.log(error)
        }
      )
    }
  }

  onSelectRegister(id, index) {
    this.data.isiKertasSekuritiModels[index].nomorRisalahLelang = id
  }

  onSelectTriwulan(value) {
    this.data.triwulan = value
  }
}
