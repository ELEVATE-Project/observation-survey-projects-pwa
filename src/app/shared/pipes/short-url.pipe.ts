import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortUrl'
})
export class ShortUrlPipe implements PipeTransform {

  transform(value: string, trimLength: number = 160): string {
    if (!value) return value;
    return value.length > trimLength ? `${value.substr(0, trimLength)}...` : value;
  }

}