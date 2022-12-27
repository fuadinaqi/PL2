export const getMonthByNumber = (v: number | string): string => {
  const value = typeof v === 'number' ? v : Number(v)
  switch (value) {
    case 0:
      return '-'
    case 1:
      return 'Januari'
    case 2:
      return 'Februari'
    case 3:
      return 'Maret'
    case 4:
      return 'April'
    case 5:
      return 'Mei'
    case 6:
      return 'Juni'
    case 7:
      return 'Juli'
    case 8:
      return 'Agustus'
    case 9:
      return 'September'
    case 10:
      return 'Oktober'
    case 11:
      return 'November'
    case 12:
      return 'Desember'
    default:
      return '-'
  }
}

export const getTermByNumber = (v: number | string): string => {
  const value = typeof v === 'number' ? v : Number(v)
  switch (value) {
    case 1:
      return 'Awal'
    case 2:
      return 'Akhir'
    default:
      return ''
  }
}
