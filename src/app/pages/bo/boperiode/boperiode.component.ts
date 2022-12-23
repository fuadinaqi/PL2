import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiService } from '@services/api.service';
import { AppConfigService } from '@/app-config.service';

@Component({
  selector: 'app-boperiode',
  templateUrl: './boperiode.component.html',
  styleUrls: ['./boperiode.component.scss']
})
export class BoperiodeComponent implements OnInit {

  public listTrans: Array<any>
  public idjadwal: String
  public isempty: boolean = true
  constructor(private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config : AppConfigService) {

  }

  ngOnInit(): void {
    this.idjadwal = this.route.snapshot.params['idjadwal']
    this.loadTransaction()

  }
  loadTransaction() {
    this.http.get(this.config.apiBaseUrl+"api/TransaksiLelang/P2PK", this.api.generateHeader()).subscribe((result: any) => {
      if (result.data) {
        this.listTrans = result.data.filter(trans => [this.idjadwal].includes(trans.jadwalLelangId))
        if (this.listTrans.length > 0) {
          this.isempty = false
        }
      }
      console.log(result)

    }, error => { });

  }
  formatStatus(status) {
    switch (status) {
      case 'Draft Permohonan': return 'Draft'; break;
      case 'Permohonan Dikirim': return 'Terkirim ke BO'; break;
    }
  }
  onKirim(idtrans) {
    if (confirm("Apakah anda yakin ingin Buka Akses?")) {
      console.log(idtrans);
      this.http.put(this.config.apiBaseUrl+"api/TransaksiLelang/P2PK/BukaAkses?id=" + idtrans, null, this.api.generateHeader()).subscribe(data => {
        console.log("post ressult ", data);
        this.toastr.info("Transaksi Terkirim ke Back Office PPPK")
        this.loadTransaction()

      }, error => {
        this.toastr.error("Tidak dapat mengirim data, coba kembali nanti")
        console.log(error);
      });
    }
  }

}
