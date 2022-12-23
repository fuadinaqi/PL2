import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid' 
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { AppConfigService } from '@/app-config.service';


@Component({
  selector: 'app-ksadd',
  templateUrl: './ksadd.component.html',
  styleUrls: ['./ksadd.component.scss']
})
export class KsaddComponent implements OnInit {
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
  constructor(private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api : ApiService,
    private config : AppConfigService
    ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.idperiode = this.route.snapshot.params['idperiode'];
    this.idpreview = this.route.snapshot.params['idpreview'];
    this.isAddMode = this.idperiode ? true : false;
    this.isPreview = this.idpreview ? true : false;
    this.isEditMode = this.id ? true : false;
    this.http.get(this.config.apiBaseUrl+"api/TransaksiLelang", this.api.generateHeader()).subscribe((result: any) => {
      this.listTrans = result.data
      console.log(result) 
    }, error => { });
    this.ksForm = new UntypedFormGroup({
      ksdetail: new UntypedFormArray([], Validators.required),
      kelurahan: new UntypedFormControl(null, Validators.required),
      //periodeLaporanId: new UntypedFormControl(null, Validators.required),
      triwulan:new UntypedFormControl(null, Validators.required),
      jumlahAwal: new UntypedFormControl(null, Validators.required),
   
    })
    console.log("token 1: ", localStorage.getItem('token'));
    //"Harap input seperti contoh : 'Penambahan', 'Penggunaan', 'Kutipan Pengganti', 'Rusak', 'Hilang'."
    this.generateKSDetail()

  }
  generateKSDetail(){
   let  Penambahan = new UntypedFormGroup({
      status: new UntypedFormControl(null, Validators.required),
      nomorKertasSekuriti: new UntypedFormControl(null, Validators.required),
      nomorRisalahLelang: new UntypedFormControl(null, Validators.required),
      nomorLotRisalahLelang: new UntypedFormControl(null, Validators.required),
      tanggalMutasi: new UntypedFormControl(null, Validators.required),
    }),
    Penggunaan = new UntypedFormGroup({
      status: new UntypedFormControl(null, Validators.required),
      nomorKertasSekuriti: new UntypedFormControl(null, Validators.required),
      nomorRisalahLelang: new UntypedFormControl(null, Validators.required),
      nomorLotRisalahLelang: new UntypedFormControl(null, Validators.required),
      tanggalMutasi: new UntypedFormControl(null, Validators.required),
    }),
    Pengganti = new UntypedFormGroup({
      status: new UntypedFormControl(null, Validators.required),
      nomorKertasSekuriti: new UntypedFormControl(null, Validators.required),
      nomorRisalahLelang: new UntypedFormControl(null, Validators.required),
      nomorLotRisalahLelang: new UntypedFormControl(null, Validators.required),
      tanggalMutasi: new UntypedFormControl(null, Validators.required),
    }),
    Rusak = new UntypedFormGroup({
      status: new UntypedFormControl(null, Validators.required),
      nomorKertasSekuriti: new UntypedFormControl(null, Validators.required),
      nomorRisalahLelang: new UntypedFormControl(null, Validators.required),
      nomorLotRisalahLelang: new UntypedFormControl(null, Validators.required),
      tanggalMutasi: new UntypedFormControl(null, Validators.required),
    }),
    Hilang = new UntypedFormGroup({
      status: new UntypedFormControl(null, Validators.required),
      nomorKertasSekuriti: new UntypedFormControl(null, Validators.required),
      nomorRisalahLelang: new UntypedFormControl(null, Validators.required),
      nomorLotRisalahLelang: new UntypedFormControl(null, Validators.required),
      tanggalMutasi: new UntypedFormControl(null, Validators.required),
    })
    const ksdetail = this.ksForm.get('ksdetail') as UntypedFormArray
    ksdetail.push(Penambahan)
    ksdetail.push(Penggunaan)
    ksdetail.push(Pengganti)
    ksdetail.push(Rusak)
    ksdetail.push(Hilang)

  }
  savetransaksi() {
    if (confirm("Apakah anda sudah mengisi data dengan lengkap dan benar?")) {
      this.http.post(this.config.apiBaseUrl+"/api/KertasSekuriti", this.generateBodyReq(this.ksForm.value), this.api.generateHeader()).subscribe(data => {
        console.log("post ressult ", data);
        this.toastr.info("Data Tersimpan")
        this.router.navigate(['/kslanding/' + this.idperiode]);

      }, error => {
        this.toastr.error("Tidak dapat menyimpan Kertas Sekuriti, Periksa kembali isian Anda");
        console.log(error);
      });
    }
  }
 
  onSelectRegister(id) {
    this.http.get(this.config.apiBaseUrl+"api/TransaksiLelang/" + id, this.api.generateHeader()).subscribe((result: any) => {
      this.trans = result.data
      console.log(this.trans) 
    }, error => {  });

  } 
  generateBodyReq(formValue: any) {
    let id = this.id === "" ? uuidv4() : this.id
    let bodyreq = {
      transaksiLelangId: formValue.transaksiLelangId,
      lot: parseInt(formValue.lot),
      letaktanahBangunanLong: formValue.letaktanahBangunanLong,
      letaktanahBangunanLat: formValue.letaktanahBangunanLat,
      statusHakAtasTanah: formValue.statusHakAtasTanah,
      luasTanah: parseInt(formValue.luasTanah),
      luasBangunan: parseInt(formValue.luasBangunan),
      njopnop: Number(formValue.njopnop.replace(/[^0-9.-]+/g,"")),
      pokokLelang:Number(this.trans.pokokLelang),
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
