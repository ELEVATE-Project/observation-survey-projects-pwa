import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortUrl'
})
export class ShortUrlPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    // Simple example to shorten URL
    if (!value) return value;
    return value.length > 20 ? `${value.substr(0, 20)}...` : value;
  }

}