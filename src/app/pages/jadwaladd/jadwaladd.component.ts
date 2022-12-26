import { Component, OnInit } from '@angular/core'
import { Periode } from '@/type/periode'
import { Jadwal } from '@/type/jadwal'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { UntypedFormGroup, UntypedFormControl, UntypedFormArray, Validators, ReactiveFormsModule } from '@angular/forms'
import { v4 as uuidv4 } from 'uuid'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { AuthService } from '@services/auth.service'

@Component({
  selector: 'app-jadwaladd',
  templateUrl: './jadwaladd.component.html',
  styleUrls: ['./jadwaladd.component.scss'],
})
export class JadwaladdComponent implements OnInit {
  tahun = this.route.snapshot.queryParams.tahun
  bulan = this.route.snapshot.queryParams.bulan
  term = this.route.snapshot.queryParams.term

  public id: string
  public isAddMode: boolean
  public isEditMode: boolean
  public isPreview: boolean
  public jadwalForm: UntypedFormGroup
  public idperiode: any
  public idpreview: any
  public jadwal: Jadwal
  public isP2pk: boolean = false
  // public tahun: number
  // public term: number
  // public bulan: number
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    this.idperiode = this.route.snapshot.params['idperiode']
    this.idpreview = this.route.snapshot.params['idpreview']
    this.isAddMode = this.idperiode ? true : false
    this.isPreview = this.idpreview ? true : false
    this.isEditMode = this.id ? true : false

    let role = this.authService.getRole()
    if (role.toString() == 'UserPLII') {
      this.isP2pk = false
    } else {
      this.isP2pk = true
    }

    console.log('token 1: ', localStorage.getItem('token'))
    this.jadwalForm = new UntypedFormGroup({
      nomerRegistrasi: new UntypedFormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      tanggalLelang: new UntypedFormControl(null, Validators.required),
      namaPenjual: new UntypedFormControl(null, Validators.required),
      klasifikasiPenjual: new UntypedFormControl(null, Validators.required),
      nomorSuratPermohonan: new UntypedFormControl(null, Validators.required),
      tanggalSuratPermohonan: new UntypedFormControl(null, Validators.required),
      tempatLelang: new UntypedFormControl(null, Validators.required),
      sifatLelang: new UntypedFormControl(null, Validators.required),
      nomorSuratPenetapanJadwalLelang: new UntypedFormControl(null, Validators.required),
      tanggalSuratPenetapanJadwalLelang: new UntypedFormControl(null, Validators.required),
    })

    if (this.isEditMode || this.isPreview) {
      const idperiode = this.isEditMode ? this.id : this.idpreview
      const url = this.isP2pk ? 'api/JadwalLelang/P2PK/' : 'api/JadwalLelang/'

      this.http.get(this.config.apiBaseUrl + url + idperiode, this.api.generateHeader()).subscribe(
        (result: any) => {
          this.jadwal = result.data
          console.log(result)
          this.idperiode = this.jadwal.periodeLaporanId
          this.jadwalForm.patchValue({
            nomerRegistrasi: this.jadwal.nomerRegistrasi,
            tanggalRegistrasi: this.jadwal.tanggalRegistrasi.split('T')[0],
            tanggalLelang: this.jadwal.tanggalLelang.split('T')[0],
            namaPenjual: this.jadwal.namaPenjual,
            klasifikasiPenjual: this.jadwal.klasifikasiPenjual,
            nomorSuratPermohonan: this.jadwal.nomorSuratPermohonan,
            tanggalSuratPermohonan: this.jadwal.tanggalSuratPermohonan.split('T')[0],
            tempatLelang: this.jadwal.tempatLelang,
            sifatLelang: this.jadwal.sifatLelang,
            nomorSuratPenetapanJadwalLelang: this.jadwal.nomorSuratPenetapanJadwalLelang,
            tanggalSuratPenetapanJadwalLelang: this.jadwal.tanggalSuratPenetapanJadwalLelang.split('T')[0],
          })
        },
        (error) => {}
      )

      if (this.isPreview) {
        this.jadwalForm.disable()
      }
    } else {
      const idperiode = this.idperiode
      this.http.get(this.config.apiBaseUrl + 'api/PeriodePelaporan/' + idperiode, this.api.generateHeader()).subscribe(
        (result: any) => {
          console.log(result)
          // this.tahun = result.data.tahun
          // this.term = result.data.term
          // this.bulan = result.data.bulan
        },
        (error) => {}
      )
    }
  }
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public periodeLaporan: Periode,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    private authService: AuthService
  ) {}
  isValid(a: string) {
    let control = this.jadwalForm.get(a)
    return (control.errors?.['required'] || control.invalid) && (control.dirty || control.touched)
  }
  generateBodyReq(formValue: any) {
    let id = this.id === '' ? uuidv4() : this.id
    let bodyreq = {
      id: this.id,
      periodeLaporanId: this.idperiode,
      tahun: this.tahun,
      term: this.term,
      bulan: this.bulan,
      nomerRegistrasi: formValue.nomerRegistrasi,
      tanggalRegistrasi: formValue.tanggalRegistrasi,
      tanggalLelang: formValue.tanggalLelang,
      namaPenjual: formValue.namaPenjual,
      klasifikasiPenjual: formValue.klasifikasiPenjual,
      nomorSuratPermohonan: formValue.nomorSuratPermohonan,
      tanggalSuratPermohonan: formValue.tanggalSuratPermohonan,
      tempatLelang: formValue.tempatLelang,
      sifatLelang: formValue.sifatLelang,
      nomorSuratPenetapanJadwalLelang: formValue.nomorSuratPenetapanJadwalLelang,
      tanggalSuratPenetapanJadwalLelang: formValue.tanggalSuratPenetapanJadwalLelang,
    }
    console.log(bodyreq)
    return bodyreq
  }

  onSubmit() {
    if (confirm('Apakah anda sudah mengisi data dengan lengkap dan benar?')) {
      let url = this.config.apiBaseUrl + 'api/JadwalLelang/'
      if (this.isAddMode) {
        this.http.post(url, this.generateBodyReq(this.jadwalForm.value), this.api.generateHeader()).subscribe(
          (data) => {
            console.log('post ressult ', data)
            this.toastr.info('Data Tersimpan')
            this.onBack()
          },
          (error) => {
            this.toastr.error('Tidak dapat menyimpan jadwal, Periksa kembali isian Anda')
            console.log(error)
          }
        )
      } else {
        this.http.put(url + this.id, this.generateBodyReq(this.jadwalForm.value), this.api.generateHeader()).subscribe(
          (data) => {
            console.log('post ressult ', data)
            this.toastr.info('Data Dirubah')
            this.onBack()
          },
          (error) => {
            this.toastr.error('Tidak dapat menyimpan jadwal, Periksa kembali isian Anda')
            console.log(error)
          }
        )
      }
    }
  }

  onBack() {
    const id = this.idperiode || this.id || this.idpreview
    this.router.navigate(['/jadwaldetail/' + id], {
      queryParams: { tahun: this.tahun, bulan: this.bulan, term: this.term },
    })
  }
}
