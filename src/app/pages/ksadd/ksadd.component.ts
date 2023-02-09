import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { v4 as uuidv4 } from 'uuid'
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { AuthService } from '@services/auth.service'
import { Location } from '@angular/common'

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
  public userId = this.route.snapshot.queryParams.u

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
    tahun: Number(this.tahun),
    bulan: Number(this.bulan),
    term: Number(this.term),
    triwulan: '1',
    jumlahAwal: 0,
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
  public isP2pk: boolean
  public dataKertas: any = {
    1: { sisa: 0 },
    2: { sisa: 0 },
    3: { sisa: 0 },
    4: { sisa: 0 },
  }

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    private AuthService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // console.log(this.router.routerState.snapshot.root)
    const dataKertas = this.location.getState()['dataKertas'] || []

    this.dataKertas[1] = dataKertas.find((el) => el.triwulan === 1) || { sisa: 0 }
    this.dataKertas[2] = dataKertas.find((el) => el.triwulan === 2) || { sisa: 0 }
    this.dataKertas[3] = dataKertas.find((el) => el.triwulan === 3) || { sisa: 0 }
    this.dataKertas[4] = dataKertas.find((el) => el.triwulan === 4) || { sisa: 0 }

    console.log(this.dataKertas)

    let role = this.AuthService.getRole()
    if (role.toString() == 'UserPLII') {
      this.isP2pk = false
    } else {
      this.isP2pk = true
    }

    this.id = this.route.snapshot.params['id']
    this.idperiode = this.route.snapshot.params['idperiode']
    this.idpreview = this.route.snapshot.params['idpreview']
    this.isAddMode = this.idperiode ? true : false
    this.isPreview = this.idpreview ? true : false
    this.isEditMode = this.id ? true : false

    const urlTrans = this.isP2pk
      ? `api/TransaksiLelang/P2PK/byTahun/${this.tahun}/${this.userId}`
      : `api/TransaksiLelang?tahun=${this.tahun}`

    this.http.get(this.config.apiBaseUrl + urlTrans, this.api.generateHeader()).subscribe((result: any) => {
      this.listTrans = [
        { value: '', label: '-Pilih-' },
        ...result.data
          // .filter((x) => x.tahun == this.tahun)
          .map((x) => ({ value: String(x.nomorRisalahLelang), label: `${x.nomorRisalahLelang} - ${x.namaPenjual}` })),
      ]

      if (this.isEditMode || this.isPreview) {
        const selectedId = this.isEditMode ? this.id : this.idpreview
        const urlKs = this.isP2pk ? 'api/KertasSekuriti/P2PK/' : 'api/KertasSekuriti/'
        this.http.get(this.config.apiBaseUrl + urlKs + selectedId, this.api.generateHeader()).subscribe((res: any) => {
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

  onBack() {
    if (this.isP2pk) {
      this.router.navigate(['/boks'], { queryParams: { tahun: this.tahun, u: this.userId } })
    } else {
      const id = this.idperiode || this.id || this.idpreview
      this.router.navigate(['/ksdetail/' + id], {
        queryParams: { tahun: this.tahun, bulan: this.bulan, term: this.term, parentId: this.parentId },
      })
    }
  }

  savetransaksi() {
    if (this.sisa < 0) {
      return this.toastr.error('Jumlah akhir minimal 0')
    }

    if (confirm('Apakah anda sudah mengisi data dengan lengkap dan benar?')) {
      const method = this.isEditMode ? 'put' : 'post'
      const url = this.isEditMode ? `api/KertasSekuriti/${this.id}` : 'api/KertasSekuriti'
      this.http[method](
        this.config.apiBaseUrl + url,
        { ...this.data, jumlahAkhir: this.sisa },
        this.api.generateHeader()
      ).subscribe(
        (data) => {
          console.log('post ressult ', data)
          this.toastr.info('Data Tersimpan')
          this.onBack()
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
    if (value > 1) {
      this.data.jumlahAwal = this.dataKertas[value - 1].sisa
    } else {
      this.data.jumlahAwal = 0
    }
  }

  get sisa() {
    return (
      Number(this.data.jumlahAwal) +
      Number(this.data.isiKertasSekuritiModels[0].jumlahMutasi) -
      Number(this.data.isiKertasSekuritiModels[1].jumlahMutasi) -
      Number(this.data.isiKertasSekuritiModels[2].jumlahMutasi) -
      Number(this.data.isiKertasSekuritiModels[3].jumlahMutasi) -
      Number(this.data.isiKertasSekuritiModels[4].jumlahMutasi)
    )
  }
}
