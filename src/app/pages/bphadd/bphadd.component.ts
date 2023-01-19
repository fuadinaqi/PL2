import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { v4 as uuidv4 } from 'uuid'
import { AlamatService } from '@services/alamat.service'
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { AuthService } from '@services/auth.service'

@Component({
  selector: 'app-bphadd',
  templateUrl: './bphadd.component.html',
  styleUrls: ['./bphadd.component.scss'],
})
export class BphaddComponent implements OnInit {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term
  public parentId = this.route.snapshot.queryParams.parentId
  public idperiode = this.route.snapshot.queryParams.idperiode
  public idtrans: any
  public isP2pk: boolean

  public id: string
  public isAddMode: boolean
  public isEditMode: boolean
  public isPreview: boolean
  public bphForm: UntypedFormGroup
  public idpreview: any
  public bph: any
  public listTrans: Array<any>
  public trans: any = {}
  public provinsi: any = []
  public kab: any = []
  public kec: any = []
  public kel: any = []

  public provinsiPenjual: string = ''
  public kabPenjual: string = ''
  public kecPenjual: string = ''
  public kelPenjual: string = ''

  public provinsiPembeli: string = ''
  public kabPembeli: string = ''
  public kecPembeli: string = ''
  public kelPembeli: string = ''

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private alamatService: AlamatService,
    private api: ApiService,
    private config: AppConfigService,
    private AuthService: AuthService
  ) {}

  ngOnInit(): void {
    let role = this.AuthService.getRole()
    if (role.toString() == 'UserPLII') {
      this.isP2pk = false
    } else {
      this.isP2pk = true
    }

    this.id = this.route.snapshot.params['id']
    this.idtrans = this.route.snapshot.params['idtrans'] || this.route.snapshot.queryParams['idtrans'] || ''
    this.idpreview = this.route.snapshot.params['idpreview']
    this.isAddMode = this.idtrans ? true : false
    this.isPreview = this.idpreview ? true : false
    this.isEditMode = this.id ? true : false

    this.alamatService.getAllProvinsi().subscribe((r) => {
      this.provinsi = r
    })
    this.bphForm = new UntypedFormGroup({
      lot: new UntypedFormControl(null, Validators.required),
      letaktanahBangunanLong: new UntypedFormControl(null, Validators.required),
      letaktanahBangunanLat: new UntypedFormControl(null, Validators.required),
      statusHakAtasTanah: new UntypedFormControl(null, Validators.required),
      luasTanah: new UntypedFormControl(null, Validators.required),
      luasBangunan: new UntypedFormControl(null, Validators.required),
      njopnop: new UntypedFormControl(null, Validators.required),
      pokokLelang: new UntypedFormControl(null, Validators.required),
      nomorSSB: new UntypedFormControl(null, Validators.required),
      tanggalSSB: new UntypedFormControl(null, Validators.required),
      nomorSSP: new UntypedFormControl(null, Validators.required),
      tanggalSSP: new UntypedFormControl(null, Validators.required),
      tanggalPenyampaianPetikanRisalahRapat: new UntypedFormControl(null, Validators.required),
      keterangan: new UntypedFormControl(null),
    })
    this.onSelectRegister(this.idtrans)

    if (this.isEditMode || this.isPreview) {
      const id = this.isEditMode ? this.id : this.idpreview
      const url = this.isP2pk
        ? 'api/LaporanRisalahLelangPengenaanBPHTB/P2PK/'
        : 'api/LaporanRisalahLelangPengenaanBPHTB/'
      this.http.get(this.config.apiBaseUrl + url + id, this.api.generateHeader()).subscribe(
        (result: any) => {
          this.bph = result.data

          this.idtrans = this.bph.transaksiLelangId
          this.bphForm.patchValue({
            lot: this.bph.lot,
            letaktanahBangunanLong: this.bph.letaktanahBangunanLong,
            letaktanahBangunanLat: this.bph.letaktanahBangunanLat,
            statusHakAtasTanah: this.bph.statusHakAtasTanah,
            luasTanah: this.bph.luasTanah,
            luasBangunan: this.bph.luasBangunan,
            njopnop: this.bph.njopnop,
            pokokLelang: this.bph.pokokLelang,
            nomorSSB: this.bph.nomorSSB,
            tanggalSSB: this.bph.tanggalSSB.split('T')[0],
            nomorSSP: this.bph.nomorSSP,
            tanggalSSP: this.bph.tanggalSSP.split('T')[0],
            tanggalPenyampaianPetikanRisalahRapat: this.bph.tanggalPenyampaianPetikanRisalahRapat.split('T')[0],
            keterangan: this.bph.keterangan,
          })
        },
        (error) => {}
      )

      if (this.isPreview) {
        this.bphForm.disable()
      }
    }
  }

  onBack() {
    // if (this.isP2pk) {
    //   this.router.navigate(['/bobph/'])
    // } else {
    //   const id = this.idtrans || this.id || this.idpreview
    //   this.router.navigate(['/bphdetail/' + id], {
    //     queryParams: { ...this.route.snapshot.queryParams },
    //   })
    // }
    const id = this.idtrans || this.id || this.idpreview
    this.router.navigate(['/bphdetail/' + id], {
      queryParams: { ...this.route.snapshot.queryParams },
    })
  }

  savetransaksi() {
    if (confirm('Apakah anda sudah mengisi data dengan lengkap dan benar?')) {
      console.log(this.id)
      const method = this.isEditMode ? 'put' : 'post'
      const url = this.isEditMode
        ? `api/LaporanRisalahLelangPengenaanBPHTB/${this.id}`
        : 'api/LaporanRisalahLelangPengenaanBPHTB'
      const sendBody = this.isEditMode ? { ...this.bphForm.value, id: this.id } : this.bphForm.value
      this.http[method](
        this.config.apiBaseUrl + url,
        this.generateBodyReq(sendBody),
        this.api.generateHeader()
      ).subscribe(
        (data) => {
          console.log('post ressult ', data)
          this.toastr.info('Data Tersimpan')
          this.onBack()
        },
        (error) => {
          this.toastr.error('Tidak dapat menyimpan BPHTB, Periksa kembali isian Anda')
          console.log(error)
        }
      )
    }
  }
  async selectProvinsi(id) {
    console.log('provinsi:', id)
    this.alamatService.selectProvinsi(id).subscribe((r) => {
      this.kab = r
    })
  }
  async selectKab(id) {
    console.log('kab:', id)
    this.alamatService.selectKab(id).subscribe((r) => {
      this.kec = r
    })
  }
  async selectKec(id) {
    console.log('kec:', id)
    this.alamatService.selectKec(id).subscribe((r) => {
      this.kel = r
    })
  }

  onSelectRegister(id) {
    if (!id) return
    this.http.get(this.config.apiBaseUrl + 'api/TransaksiLelang/' + id, this.api.generateHeader()).subscribe(
      (result: any) => {
        this.trans = result.data
        console.log(this.trans)

        this.bphForm.patchValue({
          pokokLelang: this.trans.pokokLelang,
        })

        this.alamatService.getAllProvinsi().subscribe((r: any) => {
          this.provinsiPenjual = r.find((x) => x.id == result.data.provinsiPenjual)?.name || ''
          this.provinsiPembeli = r.find((x) => x.id == result.data.provinsiPembeli)?.name || ''
        })

        this.alamatService.selectProvinsi(result.data.provinsiPenjual).subscribe((r: any) => {
          this.kabPenjual = r.find((x) => x.id == result.data.kabupatenKotaPenjual)?.name || ''
        })
        this.alamatService.selectProvinsi(result.data.provinsiPembeli).subscribe((r: any) => {
          this.kabPembeli = r.find((x) => x.id == result.data.kabupatenKotaPembeli)?.name || ''
        })

        this.alamatService.selectKab(result.data.kabupatenKotaPenjual).subscribe((r: any) => {
          this.kecPenjual = r.find((x) => x.id == result.data.kecamatanPenjual)?.name || ''
        })
        this.alamatService.selectKab(result.data.kabupatenKotaPembeli).subscribe((r: any) => {
          this.kecPembeli = r.find((x) => x.id == result.data.kecamatanPembeli)?.name || ''
        })

        this.alamatService.selectKec(result.data.kecamatanPenjual).subscribe((r: any) => {
          this.kelPenjual = r.find((x) => x.id == result.data.kelurahanPenjual)?.name || ''
        })
        this.alamatService.selectKec(result.data.kecamatanPembeli).subscribe((r: any) => {
          this.kelPembeli = r.find((x) => x.id == result.data.kelurahanPembeli)?.name || ''
        })
      },
      (error) => {}
    )
  }
  generateBodyReq(formValue: any) {
    let id = this.id === '' ? uuidv4() : this.id
    const modifiedNjopnop = () => {
      const n = formValue.njopnop
      if (typeof n === 'number') return n
      if (typeof n === 'string') return Number(formValue.njopnop.replace(/[^0-9.-]+/g, ''))
      return null
    }
    let bodyreq = {
      id,
      transaksiLelangId: this.idtrans,
      lot: parseInt(formValue.lot),
      letaktanahBangunanLong: formValue.letaktanahBangunanLong,
      letaktanahBangunanLat: formValue.letaktanahBangunanLat,
      statusHakAtasTanah: formValue.statusHakAtasTanah,
      luasTanah: parseInt(formValue.luasTanah),
      luasBangunan: parseInt(formValue.luasBangunan),
      njopnop: modifiedNjopnop(),
      pokokLelang: Number(this.trans.pokokLelang),
      nomorSSB: Number(formValue.nomorSSB),
      tanggalSSB: formValue.tanggalSSB,
      nomorSSP: Number(formValue.nomorSSP),
      tanggalSSP: formValue.tanggalSSP,
      tanggalPenyampaianPetikanRisalahRapat: formValue.tanggalPenyampaianPetikanRisalahRapat,
      keterangan: formValue.keterangan,
    }
    console.log(bodyreq)
    return bodyreq
  }
}
