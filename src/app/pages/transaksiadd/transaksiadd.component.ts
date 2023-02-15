import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms'
import { Jadwal } from '@/type/jadwal'

import { v4 as uuidv4 } from 'uuid'
import { AlamatService } from '@services/alamat.service'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Location } from '@angular/common'
import { AuthService } from '@services/auth.service'

@Component({
  selector: 'app-transaksiadd',
  templateUrl: './transaksiadd.component.html',
  styleUrls: ['./transaksiadd.component.scss'],
})
export class TransaksiaddComponent implements OnInit {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term
  public parentId = this.route.snapshot.queryParams.parentId

  public jadwal: any = {}

  public isP2pk: boolean
  public isAddMode: boolean
  public isEditMode: boolean
  public isPreview: boolean
  public idjadwal: any
  public idpreview: any

  public id: String
  public transaksiForm: UntypedFormGroup
  public isBatal: boolean = false
  public provinsi: any = []
  public kab: any = []
  public kec: any = []
  public kel: any = []
  public provinsi1: any = []
  public kab1: any = []
  public kec1: any = []
  public kel1: any = []
  public isUangJaminan: boolean = false
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private alamatService: AlamatService,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    private location: Location,
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
    this.idjadwal = this.route.snapshot.params['idjadwal']
    this.idpreview = this.route.snapshot.params['idpreview']
    this.isAddMode = this.idjadwal ? true : false
    this.isPreview = this.idpreview ? true : false
    this.isEditMode = this.id ? true : false
    this.alamatService.getAllProvinsi().subscribe((r) => {
      this.provinsi = r
      this.provinsi1 = r
    })

    this.transaksiForm = new UntypedFormGroup({
      jadwalLelangId: new UntypedFormControl(null, Validators.required),
      status: new UntypedFormControl(null, Validators.required),
      nomorRisalahLelang: new UntypedFormControl(null, Validators.required),
      tanggalRisalahLelang: new UntypedFormControl(null, Validators.required),
      nikPenjual: new UntypedFormControl(null, Validators.required),
      alamatPenjual: new UntypedFormControl(null, Validators.required),
      rtPenjual: new UntypedFormControl(null, Validators.required),
      rwPenjual: new UntypedFormControl(null, Validators.required),
      provinsiPenjual: new UntypedFormControl(null, Validators.required),
      kabupatenKotaPenjual: new UntypedFormControl(null, Validators.required),
      kecamatanPenjual: new UntypedFormControl(null, Validators.required),
      kelurahanPenjual: new UntypedFormControl(null, Validators.required),
      kodeposPenjual: new UntypedFormControl(null, Validators.required),
      npwpPenjual: new UntypedFormControl(null, Validators.required),
      namaPembeli: new UntypedFormControl(null, Validators.required),
      nikPembeli: new UntypedFormControl(null, Validators.required),
      alamatPembeli: new UntypedFormControl(null, Validators.required),
      rtPembeli: new UntypedFormControl(null, Validators.required),
      rwPembeli: new UntypedFormControl(null, Validators.required),
      provinsiPembeli: new UntypedFormControl(null, Validators.required),
      kabupatenKotaPembeli: new UntypedFormControl(null, Validators.required),
      kecamatanPembeli: new UntypedFormControl(null, Validators.required),
      kelurahanPembeli: new UntypedFormControl(null, Validators.required),
      kodeposPembeli: new UntypedFormControl(null, Validators.required),
      npwpPembeli: new UntypedFormControl(null, Validators.required),
      jumlahPesertaLelang: new UntypedFormControl(null, Validators.required),
      sifatBarang: new UntypedFormControl(null, Validators.required),
      tipeBarang: new UntypedFormControl(null, Validators.required),
      uraianBarang: new UntypedFormControl(null, Validators.required),
      jaminanLelang: new UntypedFormControl(null, Validators.required),
      jaminanLelangBerupaUang: new UntypedFormControl(null, Validators.required),
      jaminanLelangBankGaransi: new UntypedFormControl(null, Validators.required),
      nilaiLimit: new UntypedFormControl(null, Validators.required),
      pokokLelang: new UntypedFormControl(null, Validators.required),
      beaLelangPenjual: new UntypedFormControl(null, Validators.required),
      beaLelangPembeli: new UntypedFormControl(null, Validators.required),
      tanggalPenyerahanKutipanRisalahLelang: new UntypedFormControl(null, Validators.required),
      imbalanJasa: new UntypedFormControl(null, Validators.required),
      keterangan: new UntypedFormControl(null, Validators.required),
      nomorRegisterPembatalan: new UntypedFormControl(null, Validators.required),
      beaLelangBatal: new UntypedFormControl(null, Validators.required),
      alasanPembatalan: new UntypedFormControl(null, Validators.required),
    })
    if (this.idjadwal) {
      this.http.get(this.config.apiBaseUrl + 'api/JadwalLelang/' + this.idjadwal, this.api.generateHeader()).subscribe(
        (result: any) => {
          this.jadwal = result.data
          console.log(this.jadwal)
        },
        (error) => {}
      )
    }
    if (this.isAddMode) {
      this.http.get(this.config.apiBaseUrl + 'api/TransaksiLelang', this.api.generateHeader()).subscribe(
        (result: any) => {
          if (result.data) {
            const dataLast = result.data.filter((trans) => [this.idjadwal].includes(trans.jadwalLelangId))
            if (dataLast[0]) {
              this.selectProvinsi(dataLast[0].provinsiPenjual, 'kab')
              this.selectKab(dataLast[0].kabupatenKotaPenjual, 'kec')
              this.selectKec(dataLast[0].kecamatanPenjual, 'kel')
              this.transaksiForm.patchValue({
                namaPenjual: dataLast[0].namaPenjual,
                klasifikasiPenjual: dataLast[0].klasifikasiPenjual,
                nikPenjual: dataLast[0].nikPenjual,
                alamatPenjual: dataLast[0].alamatPenjual,
                rtPenjual: dataLast[0].rtPenjual,
                rwPenjual: dataLast[0].rwPenjual,
                provinsiPenjual: dataLast[0].provinsiPenjual,
                kabupatenKotaPenjual: dataLast[0].kabupatenKotaPenjual,
                kecamatanPenjual: dataLast[0].kecamatanPenjual,
                kelurahanPenjual: dataLast[0].kelurahanPenjual,
                kodeposPenjual: dataLast[0].kodeposPenjual,
                npwpPenjual: dataLast[0].npwpPenjual,
              })
            }
          }
        },
        (error) => {}
      )
    } else if (this.isEditMode || this.isPreview) {
      const idperiode = this.isEditMode ? this.id : this.idpreview

      const URL = this.isP2pk ? 'api/TransaksiLelang/P2PK/' : 'api/TransaksiLelang/'

      this.http.get(this.config.apiBaseUrl + URL + idperiode, this.api.generateHeader()).subscribe(
        (result: any) => {
          this.jadwal = result.data
          console.log(result)
          this.selectProvinsi(result.data.provinsiPenjual, 'kab')
          this.selectProvinsi(result.data.provinsiPembeli, 'kab1')
          this.selectKab(result.data.kabupatenKotaPenjual, 'kec')
          this.selectKab(result.data.kabupatenKotaPembeli, 'kec1')
          this.selectKec(result.data.kecamatanPenjual, 'kel')
          this.selectKec(result.data.kecamatanPembeli, 'kel1')

          this.onJaminan(result.data.jaminanLelang)
          this.onBatal(result.data.status)

          this.idjadwal = this.jadwal.jadwalLelangId
          this.transaksiForm.patchValue({
            nomerRegistrasi: this.jadwal.nomerRegistrasi,
            tanggalRegistrasi: this.jadwal.tanggalRegistrasi,
            tanggalLelang: this.jadwal.tanggalLelang,
            namaPenjual: this.jadwal.namaPenjual,
            klasifikasiPenjual: this.jadwal.klasifikasiPenjual,
            nomorSuratPermohonan: this.jadwal.nomorSuratPermohonan,
            tanggalSuratPermohonan: this.jadwal.tanggalSuratPermohonan,
            tempatLelang: this.jadwal.tempatLelang,
            sifatLelang: this.jadwal.sifatLelang,
            nomorSuratPenetapanJadwalLelang: this.jadwal.nomorSuratPenetapanJadwalLelang,
            tanggalSuratPenetapanJadwalLelang: this.jadwal.tanggalSuratPenetapanJadwalLelang,
            jadwalLelangId: this.jadwal.jadwalLelangId,
            status: this.jadwal.status,
            nomorRisalahLelang: this.jadwal.nomorRisalahLelang,
            tanggalRisalahLelang: this.jadwal.tanggalRisalahLelang.split('T')[0],
            nikPenjual: this.jadwal.nikPenjual,
            alamatPenjual: this.jadwal.alamatPenjual,
            rtPenjual: this.jadwal.rtPenjual,
            rwPenjual: this.jadwal.rwPenjual,
            provinsiPenjual: this.jadwal.provinsiPenjual,
            kabupatenKotaPenjual: this.jadwal.kabupatenKotaPenjual,
            kecamatanPenjual: this.jadwal.kecamatanPenjual,
            kelurahanPenjual: this.jadwal.kelurahanPenjual,
            kodeposPenjual: this.jadwal.kodeposPenjual,
            npwpPenjual: this.jadwal.npwpPenjual,
            namaPembeli: this.jadwal.namaPembeli,
            nikPembeli: this.jadwal.nikPembeli,
            alamatPembeli: this.jadwal.alamatPembeli,
            rtPembeli: this.jadwal.rtPembeli,
            rwPembeli: this.jadwal.rwPembeli,
            provinsiPembeli: this.jadwal.provinsiPembeli,
            kabupatenKotaPembeli: this.jadwal.kabupatenKotaPembeli,
            kecamatanPembeli: this.jadwal.kecamatanPembeli,
            kelurahanPembeli: this.jadwal.kelurahanPembeli,
            kodeposPembeli: this.jadwal.kodeposPembeli,
            npwpPembeli: this.jadwal.npwpPembeli,
            jumlahPesertaLelang: isNaN(this.jadwal.jumlahPesertaLelang) ? 0 : this.jadwal.jumlahPesertaLelang,
            sifatBarang: this.jadwal.sifatBarang,
            tipeBarang: this.jadwal.tipeBarang,
            uraianBarang: this.jadwal.uraianBarang,
            jaminanLelang: this.jadwal.jaminanLelang,
            jaminanLelangBerupaUang: isNaN(this.jadwal.jaminanLelangBerupaUang)
              ? 0
              : this.jadwal.jaminanLelangBerupaUang,
            jaminanLelangBankGaransi: this.jadwal.jaminanLelangBankGaransi,
            nilaiLimit: isNaN(this.jadwal.nilaiLimit) ? 0 : String(this.jadwal.nilaiLimit),
            pokokLelang: isNaN(this.jadwal.pokokLelang) ? 0 : String(this.jadwal.pokokLelang),
            beaLelangPenjual: isNaN(this.jadwal.beaLelangPenjual) ? 0 : String(this.jadwal.beaLelangPenjual),
            beaLelangPembeli: isNaN(this.jadwal.beaLelangPembeli) ? 0 : String(this.jadwal.beaLelangPembeli),
            tanggalPenyerahanKutipanRisalahLelang: this.jadwal.tanggalPenyerahanKutipanRisalahLelang.split('T')[0],
            imbalanJasa: isNaN(this.jadwal.imbalanJasa) ? 0 : String(this.jadwal.imbalanJasa),
            keterangan: this.jadwal.keterangan,
            nomorRegisterPembatalan: this.jadwal.nomorRegisterPembatalan,
            beaLelangBatal: this.jadwal.beaLelangBatal,
            alasanPembatalan: this.jadwal.alasanPembatalan,
          })
        },
        (error) => {}
      )

      if (this.isPreview) {
        this.transaksiForm.disable()
      }
    }
  }
  async selectProvinsi(id, key: string, isReset?: boolean) {
    console.log('provinsi:', id)
    this.alamatService.selectProvinsi(id).subscribe((r) => {
      this[key] = r
      if (isReset) {
        if (key === 'kab') {
          this.kec = []
          this.kel = []
          this.transaksiForm.get('kecamatanPenjual').patchValue(null)
          this.transaksiForm.get('kelurahanPenjual').patchValue(null)
        } else {
          this.kec1 = []
          this.kel1 = []
          this.transaksiForm.get('kecamatanPembeli').patchValue(null)
          this.transaksiForm.get('kelurahanPembeli').patchValue(null)
        }
      }
    })
  }
  async selectKab(id, key: string, isReset?: boolean) {
    console.log('kab:', id)
    this.alamatService.selectKab(id).subscribe((r) => {
      this[key] = r
      if (isReset) {
        if (key === 'kec') {
          this.kel = []
          this.transaksiForm.get('kelurahanPenjual').patchValue(null)
        } else {
          this.kel1 = []
          this.transaksiForm.get('kelurahanPembeli').patchValue(null)
        }
      }
    })
  }
  async selectKec(id, key: string, isReset?: boolean) {
    console.log('kec:', id)
    this.alamatService.selectKec(id).subscribe((r) => {
      this[key] = r
    })
  }

  onBatal(value) {
    this.isBatal = value == 'Batal' ? true : false
  }
  onJaminan(value) {
    this.isUangJaminan = value == 'Uang Jaminan' ? true : false
  }

  onBack() {
    if (this.isP2pk) {
      this.router.navigate(['/botrans/'], { queryParams: { ...this.route.snapshot.queryParams } })
    } else {
      const id = this.idjadwal || this.id || this.idpreview
      this.router.navigate(['/transaksidetail/' + id], {
        queryParams: { tahun: this.tahun, bulan: this.bulan, term: this.term, parentId: this.parentId },
      })
    }
  }

  savetransaksi() {
    const tglRisalah = this.transaksiForm?.value?.tanggalRisalahLelang || ''
    const tglLelang = this.jadwal?.tanggalLelang?.split('T')?.[0] || ''

    if (tglLelang > tglRisalah) {
      return this.toastr.error('Tanggal Lelang tidak boleh melebihi tanggal Risalah Lelang')
    }

    const jaminanLelangBerupaUang = this.transaksiForm?.value?.jaminanLelangBerupaUang || 0
    const nilaiLimit = this.transaksiForm?.value?.nilaiLimit || 0

    if (jaminanLelangBerupaUang > nilaiLimit) {
      return this.toastr.error('Uang Jaminan tidak boleh melebihi limit')
    }

    if (confirm('Apakah anda sudah mengisi data dengan lengkap dan benar?')) {
      let url = this.config.apiBaseUrl + 'api/TransaksiLelang/'
      if (this.isAddMode) {
        this.http.post(url, this.generateBodyReq(this.transaksiForm.value), this.api.generateHeader()).subscribe(
          (data) => {
            console.log('post ressult ', data)
            this.toastr.info('Data Tersimpan')
            this.onBack()
          },
          (error) => {
            this.toastr.error('Tidak dapat menyimpan transaksi, Periksa kembali isian Anda')
            console.log(error)
          }
        )
      } else {
        this.http
          .put(url + this.id, this.generateBodyReq(this.transaksiForm.value), this.api.generateHeader())
          .subscribe(
            (data) => {
              console.log('post ressult ', data)
              this.toastr.info('Data Dirubah')
              this.onBack()
            },
            (error) => {
              this.toastr.error('Tidak dapat menyimpan transaksi, Periksa kembali isian Anda')
              console.log(error)
            }
          )
      }
    }
  }
  formatDate(dtstring) {
    return dtstring.split('T')[0]
  }
  generateBodyReq(formValue: any) {
    let id = this.id === '' ? uuidv4() : this.id

    console.log(formValue)

    // if (formValue.tanggalRisalahLelang > formValue.tanggalRisalahLelang)
    let bodyreq = {
      id: this.id,
      periodeLaporanId: this.jadwal.periodeLaporanId,
      jadwalLelangId: this.idjadwal,
      status: formValue.status,
      nomorRisalahLelang: formValue.nomorRisalahLelang,
      tanggalRisalahLelang: formValue.tanggalRisalahLelang,
      nikPenjual: formValue.nikPenjual,
      alamatPenjual: formValue.alamatPenjual,
      rtPenjual: formValue.rtPenjual,
      rwPenjual: formValue.rwPenjual,
      provinsiPenjual: formValue.provinsiPenjual,
      kabupatenKotaPenjual: formValue.kabupatenKotaPenjual,
      kecamatanPenjual: formValue.kecamatanPenjual,
      kelurahanPenjual: formValue.kelurahanPenjual,
      kodeposPenjual: formValue.kodeposPenjual,
      npwpPenjual: formValue.npwpPenjual,
      namaPembeli: formValue.namaPembeli,
      nikPembeli: formValue.nikPembeli,
      alamatPembeli: formValue.alamatPembeli,
      rtPembeli: formValue.rtPembeli,
      rwPembeli: formValue.rwPembeli,
      provinsiPembeli: formValue.provinsiPembeli,
      kabupatenKotaPembeli: formValue.kabupatenKotaPembeli,
      kecamatanPembeli: formValue.kecamatanPembeli,
      kelurahanPembeli: formValue.kelurahanPembeli,
      kodeposPembeli: formValue.kodeposPembeli,
      npwpPembeli: formValue.npwpPembeli,
      jumlahPesertaLelang: isNaN(formValue.jumlahPesertaLelang) ? 0 : formValue.jumlahPesertaLelang,
      sifatBarang: formValue.sifatBarang,
      tipeBarang: formValue.tipeBarang,
      uraianBarang: formValue.uraianBarang,
      jaminanLelang: formValue.jaminanLelang,
      jaminanLelangBerupaUang: Number(formValue.jaminanLelangBerupaUang),
      jaminanLelangBankGaransi: formValue.jaminanLelangBankGaransi,
      nilaiLimit: Number(formValue.nilaiLimit),
      pokokLelang: Number(formValue.pokokLelang),
      beaLelangPenjual: Number(formValue.beaLelangPenjual),
      beaLelangPembeli: Number(formValue.beaLelangPembeli),
      tanggalPenyerahanKutipanRisalahLelang: formValue.tanggalPenyerahanKutipanRisalahLelang,
      imbalanJasa: Number(formValue.imbalanJasa),
      keterangan: formValue.keterangan,
      nomorRegisterPembatalan: formValue.nomorRegisterPembatalan,
      beaLelangBatal: formValue.beaLelangBatal,
      alasanPembatalan: formValue.alasanPembatalan,
    }
    if (formValue.jaminanLelang === 'Bank Garansi Jaminan') {
      // delete bodyreq.jaminanLelangBankGaransi
      delete bodyreq.jaminanLelangBerupaUang
    }
    if (formValue.jaminanLelang === 'Uang Jaminan') {
      delete bodyreq.jaminanLelangBankGaransi
    }
    if (formValue.status === 'Batal') {
      delete bodyreq.namaPembeli
      delete bodyreq.nikPembeli
      delete bodyreq.alamatPembeli
      delete bodyreq.rtPembeli
      delete bodyreq.rwPembeli
      delete bodyreq.provinsiPembeli
      delete bodyreq.kabupatenKotaPembeli
      delete bodyreq.kecamatanPembeli
      delete bodyreq.kelurahanPembeli
      delete bodyreq.kodeposPembeli
      delete bodyreq.npwpPembeli
      delete bodyreq.pokokLelang
      delete bodyreq.beaLelangPenjual
      delete bodyreq.beaLelangPembeli
    }
    Object.entries(bodyreq).forEach(([key, value]) => {
      if (!value && typeof value !== 'number') delete bodyreq[key]
    })
    console.log(bodyreq)
    return bodyreq
  }
}
