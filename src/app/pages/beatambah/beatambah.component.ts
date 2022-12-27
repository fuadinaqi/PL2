import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms'
import { v4 as uuidv4 } from 'uuid'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { FileUploadService } from '@services/fileupload.service'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { AuthService } from '@services/auth.service'

@Component({
  selector: 'app-beatambah',
  templateUrl: './beatambah.component.html',
  styleUrls: ['./beatambah.component.scss'],
})
export class BeatambahComponent implements OnInit {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term
  public idperiode = this.route.snapshot.queryParams.idperiode
  public idtrans: any
  public isP2pk: boolean

  public id: string
  public isAddMode: boolean
  public isEditMode: boolean
  public isPreview: boolean
  public beaForm: UntypedFormGroup
  public idpreview: any
  public bea: any
  public listTrans: Array<any>
  public trans: any = {}
  public fileUpload: any
  public prog: number
  public responseUpload: any
  constructor(
    private toastr: ToastrService,
    public route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private uploadService: FileUploadService,
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
    this.idtrans = this.route.snapshot.params['idtrans']
    this.idpreview = this.route.snapshot.params['idpreview']
    this.isAddMode = this.idtrans ? true : false
    this.isPreview = this.idpreview ? true : false
    this.isEditMode = this.id ? true : false
    //kurang
    this.beaForm = new UntypedFormGroup({
      tanggalLelang: new UntypedFormControl(null, Validators.required),
      tanggalPenyerahanKutipanRisalahLelang: new UntypedFormControl(null, Validators.required),
      beaLelangPenjual: new UntypedFormControl(null, Validators.required),
      beaLelangPembeli: new UntypedFormControl(null, Validators.required),
      transaksiLelangId: new UntypedFormControl(null, Validators.required),
      pokokLelang: new UntypedFormControl(null, Validators.required),
      jenisTransaksi: new UntypedFormControl(null, Validators.required),
      nomorTransaksi: new UntypedFormControl(null, Validators.required),
      fileJenisTransaksi: new UntypedFormControl(null, Validators.required),
      nomorBPN: new UntypedFormControl(null, Validators.required),
      kodeMAP: new UntypedFormControl(null, Validators.required),
      tanggalPenyetoran: new UntypedFormControl(null, Validators.required),
      keterangan: new UntypedFormControl(null, Validators.required),
    })

    if (this.isEditMode || this.isPreview) {
      const id = this.isEditMode ? this.id : this.idpreview
      const url = this.isP2pk ? 'api/LaporanPenyetoranBeaLelang/P2PK/' : 'api/LaporanPenyetoranBeaLelang/'
      this.http.get(this.config.apiBaseUrl + url + id, this.api.generateHeader()).subscribe(
        (result: any) => {
          this.bea = result.data
          console.log('bea', this.bea)
          this.idtrans = this.bea.transaksiLelangId
          this.beaForm.patchValue({
            transaksiLelangId: this.bea.transaksiLelangId,
            pokokLelang: this.bea.pokokLelang,
            jenisTransaksi: this.bea.jenisTransaksi,
            nomorTransaksi: this.bea.nomorTransaksi,
            //fileJenisTransaksi: this.bea.fileJenisTransaksi,
            nomorBPN: this.bea.nomorBPN,
            kodeMAP: this.bea.kodeMAP,
            tanggalPenyetoran: this.bea.tanggalPenyetoran.split('T')[0],
            keterangan: this.bea.keterangan,
          })
          this.trans = result.data
          this.responseUpload = { data: this.bea.fileJenisTransaksi }
        },
        (error) => {}
      )

      if (this.isPreview) {
        this.beaForm.disable()
      }
    }

    this.loadTrans()
  }

  loadTrans() {
    if (!this.idtrans) return
    this.http.get(this.config.apiBaseUrl + 'api/TransaksiLelang/' + this.idtrans, this.api.generateHeader()).subscribe(
      (result: any) => {
        this.trans = result.data
        console.log(this.trans)
      },
      (error) => {}
    )
  }

  onBack() {
    const id = this.idtrans || this.id || this.idpreview
    this.router.navigate(['/beadetail/' + id], {
      queryParams: { ...this.route.snapshot.queryParams },
    })
  }

  savetransaksi() {
    if (confirm('Apakah anda sudah mengisi data dengan lengkap dan benar?')) {
      this.http
        .post(
          this.config.apiBaseUrl + 'api/LaporanPenyetoranBeaLelang',
          this.generateBodyReq(this.beaForm.value),
          this.api.generateHeader()
        )
        .subscribe(
          (data) => {
            console.log('post ressult ', data)
            this.toastr.info('Data Tersimpan')
            this.onBack()
          },
          (error) => {
            this.toastr.error('Tidak dapat menyimpan Bea lelang, Periksa kembali isian Anda')
            console.log(error)
          }
        )
    }
  }

  generateBodyReq(formValue: any) {
    let id = this.id === '' ? uuidv4() : this.id
    let bodyreq = {
      transaksiLelangId: this.idtrans,
      pokokLelang: formValue.pokokLelang,
      jenisTransaksi: formValue.jenisTransaksi,
      nomorTransaksi: formValue.nomorTransaksi,
      fileJenisTransaksi: this.responseUpload?.data,
      nomorBPN: formValue.nomorBPN,
      kodeMAP: formValue.kodeMAP,
      tanggalPenyetoran: formValue.tanggalPenyetoran,
      keterangan: formValue.keterangan,
    }
    console.log(bodyreq)
    return bodyreq
  }
  submitFile() {
    this.uploadService
      .submitFile(this.config.apiBaseUrl + 'api/LaporanPenyetoranBeaLelang/uploadDokumen', this.fileUpload)
      .subscribe((r) => {
        this.prog = r[1]
        this.responseUpload = r[0]
      })
  }
  uploadFile(event: any) {
    const file = event.target.files ? event.target.files[0] : ''
    var blob = event.target.files[0].slice(0, event.target.files[0].size, file.type)
    const newFile = new File([blob], file.name, { type: file.type })
    console.log('file :', event.target.getAttribute('formControlName'))

    this.fileUpload = file

    let control = event.target
    this.beaForm.patchValue({
      fileUpload: file.name,
    })
  }
}
