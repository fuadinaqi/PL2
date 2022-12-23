import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'termToLabel' })
export class TermToLabelPipe implements PipeTransform {
  transform(v: number | string): string {
    let value = v
    if (typeof v === 'string') {
      value = Number(v)
    }
    switch (value) {
      case 1:
        return 'Awal'
      case 2:
        return 'Akhir'
      default:
        return ''
    }
  }
}
