import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid'
import { AlamatService } from '@services/alamat.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { AppConfigService } from '@/app-config.service';
@Component({
  selector: 'app-bphadd',
  templateUrl: './bphadd.component.html',
  styleUrls: ['./bphadd.component.scss']
})
export class BphaddComponent implements OnInit {
  public id: string
  public isAddMode: boolean
  public isEditMode: boolean
  public isPreview: boolean
  public bphForm: UntypedFormGroup
  public idtrans: any
  public idpreview: any
  public bph: any
  public listTrans: Array<any>
  public trans: any = {} 
  public provinsi: any = []
  public kab: any = []
  public kec: any = []
  public kel: any = []

  constructor(private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private alamatService: AlamatService,
    private api : ApiService,
    private config : AppConfigService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.idtrans = this.route.snapshot.params['idtrans'];
    this.idpreview = this.route.snapshot.params['idpreview'];
    this.isAddMode = this.idtrans ? true : false;
    this.isPreview = this.idpreview ? true : false;
    this.isEditMode = this.id ? true : false;

    this.alamatService.getAllProvinsi().subscribe((r) => { this.provinsi = r; })
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
      keterangan: new UntypedFormControl(null, Validators.required),
    });
    this.onSelectRegister(this.idtrans)

    if (this.isEditMode || this.isPreview) {
      const id = this.isEditMode ? this.id : this.idpreview
      this.http.get(this.config.apiBaseUrl+ "api/LaporanRisalahLelangPengenaanBPHTB/" + id, this.api.generateHeader()).subscribe((result: any) => {

        this.bph = result.data
        console.log("bph", this.bph)
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


      }, error => {

      });

      if (this.isPreview) {
        this.bphForm.disable()
      }
    } 

  }
  savetransaksi() {
    if (confirm("Apakah anda sudah mengisi data dengan lengkap dan benar?")) {
      this.http.post(this.config.apiBaseUrl+ "api/LaporanRisalahLelangPengenaanBPHTB", this.generateBodyReq(this.bphForm.value), this.api.generateHeader()).subscribe(data => {
        console.log("post ressult ", data);
        this.toastr.info("Data Tersimpan")
        this.router.navigate(['/bphdetail/' + this.idtrans]);

      }, error => {
        this.toastr.error("Tidak dapat menyimpan BPHTB, Periksa kembali isian Anda");
        console.log(error);
      });
    }
  }
  async selectProvinsi(id) {
    console.log("provinsi:", id)
    this.alamatService.selectProvinsi(id).subscribe((r) => { this.kab = r;  })
  }
  async selectKab(id) {
    console.log("kab:", id)
    this.alamatService.selectKab(id).subscribe((r) => { this.kec = r;  })
  }
  async selectKec(id) {
    console.log("kec:", id)
    this.alamatService.selectKec(id).subscribe((r) => { this.kel = r; })
  }
  
  onSelectRegister(id) {
    this.http.get(this.config.apiBaseUrl+ "api/TransaksiLelang/" + id, this.api.generateHeader()).subscribe((result: any) => {
      this.trans = result.data
      console.log(this.trans) 
    }, error => {  });

  } 
  generateBodyReq(formValue: any) {
    let id = this.id === "" ? uuidv4() : this.id
    let bodyreq = {
      transaksiLelangId: this.idtrans,
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
