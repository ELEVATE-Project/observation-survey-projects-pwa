import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements AfterViewInit {
  @Input() svgPath!: string;
  @Input() fillColor?: string;
  @ViewChild('svgContainer', { static: false }) svgContainer!: ElementRef;

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.loadSvg();
  }

  private getCSSVariableValue(variableName: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }

  loadSvg() {
    if (!this.svgPath) return;

    this.http.get(this.svgPath, { responseType: 'text' }).subscribe(svgData => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgData, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (svgElement) {
        const styleElement = svgElement.querySelector('style');
        if (styleElement) styleElement.remove();

        const fillColor = this.fillColor || this.getCSSVariableValue('--color-primary');

        svgElement.querySelectorAll('.st0, .cls-1').forEach(el => {
          this.renderer.setStyle(el, 'fill', fillColor);
        });

        this.svgContainer.nativeElement.innerHTML = '';
        this.svgContainer.nativeElement.appendChild(svgElement);
      }
    });
  }
}