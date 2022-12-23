import { Component,OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiService } from '@services/api.service';
import { AppConfigService } from '@/app-config.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-bolanding',
  templateUrl: './bolanding.component.html',
  styleUrls: ['./bolanding.component.scss']
})
export class BolandingComponent implements OnInit {

  public listJadwal: Array<any>
  public idperiode: String
  public isempty: boolean = true

  dtOptions: DataTables.Settings = {}; 
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private toastr: ToastrService,
      private route: ActivatedRoute,
      private router: Router,
      private http: HttpClient,
      private api:ApiService,
      private config:AppConfigService) {

  }
  ngOnInit(): void {
    this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10
      };

      this.idperiode = this.route.snapshot.params['idperiode'];
     this.loadJadwal()
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  loadJadwal(){
      this.http.get(this.config.apiBaseUrl+ "api/JadwalLelang/P2PK/", this.api.generateHeader()).subscribe((result: any) => {

          this.listJadwal = result.data 
          this.listJadwal = this.listJadwal.filter(trans => ["Permohonan Dikirim"].includes(trans.statusPengiriman))
          console.log(result)
          if (this.listJadwal.length > 0) {
              this.isempty = false
              this.dtTrigger.next();

          }
      }, error => { });
  }
 
  formatStatus(status){
      switch (status){
          case 'Draft Permohonan':return'Draft';break;
          case 'Permohonan Dikirim':return'Terkirim ke BO';break;
      }
  }
   
  onKirim(idjadwal) {
      console.log(idjadwal);
      if (confirm("Apakah anda yakin ingin Buka Akses?")) {
          console.log(idjadwal);
          const bodyreq = { id: idjadwal }
          this.http.put(this.config.apiBaseUrl+ "api/JadwalLelang/P2PK/BukaAkses/", null,this.api.generateHeaderWithParams(bodyreq)).subscribe(data => {
              console.log("post ressult ", data);
              this.toastr.info("Jadwal Terkirim ke P2PK")
              this.router.navigate(['/dash-bo/']);
              this.loadJadwal()

          }, error => {
              this.toastr.error("Tidak dapat mengirim data, Periksa kembali data Anda");
              console.log(error);
          });
      }
  }
}
