import { Jadwal } from "./jadwal";
export interface Transaksi {
    jadwalLelang : Jadwal
    statusTransaksi : string
    nomorRisalah : string
    tglRisalah : string
    nikPenjual : string
    alamatPenjual : string
    npwpPenjual : string
    namaPembeli : string
    nikPembeli : string
    alamatPembeli : string
    npwpPembeli : string
    jumlahPeserta : string
    sifatBarang : string
    tipeBarang : string
    uraianBarang : string
    jaminanLelang : string
    nilaiLimit : string
    pokokLelang : string
    beaPenjual : string
    beaPembeli: string
    tglKutipanRisalah: string
    imbalanJasa: string
    keterangan: string
    noRegPembatalan: string
    beaBatal: string
    alasanBatal: string
}