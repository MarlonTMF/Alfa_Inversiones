import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Pipe para marcar URLs de iframes (YouTube) como seguras para Angular.
 * Angular bloquea URLs dinámicas en iframes por seguridad por defecto.
 */
@Pipe({
  name: 'noSanitize',
  standalone: true,
})
export class NoSanitizePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
