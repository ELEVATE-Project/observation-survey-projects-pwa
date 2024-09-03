import { PipeTransform, Pipe } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
    name: "sanitizeUrl"
})
export class SanitizeUrlPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) { }

    transform(v: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustResourceUrl(v);
    }
}