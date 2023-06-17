import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTHPipe',
  pure: false,
})
export class DateTHPipe implements PipeTransform {
  transform(date: Date | string, format: String = 'dt'): string {
    const eve = new Date(date)
    if (date) {
      //console.log('วันที่', new Date(date).toTimeString());
      if (format == 'dt') {
        return new Date(date).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        });
      } else if (format == 'day') {
        return new Date(date).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

      } else if (format == 'time') {
        return new Date(date).toLocaleTimeString('th-TH');
      } else if (format == 'dn') {
        let setFormat = 'yyyy-mm-dd';
        let getDate = new Date(date);
        const map = {
          mm:
            getDate.getMonth() + 1 <= 9
              ? '0' + (getDate.getMonth() + 1)
              : getDate.getMonth() + 1,
          dd:
            getDate.getDate() <= 9
              ? '0' + getDate.getDate()
              : getDate.getDate(),
          yyyy: getDate.getFullYear(),
        };
        return setFormat.replace(/mm|dd|yyyy/gi, (matched) => map[matched]);
      }

    }
    return '-';
  }
}
