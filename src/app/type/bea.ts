import { Transaksi } from "./transaksi";
export interface BeaLelang {
    transaksiLelang : Transaksi
    jenisTransaksi : string
    nomorTransaksi : string
    kodeMap : string
    nomorBpn : string
    pokokLelang : string
    beaLelangPenjual : string
    beaLelangPembeli : string
    tglSetor : string
    keterangan : string
}