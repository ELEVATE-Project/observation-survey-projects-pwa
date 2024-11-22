import { Directive, Input, TemplateRef, ViewContainerRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appResponsive]',
})
export class ResponsiveDirective {
  private currentMode: 'mobile' | 'desktop' | null = null;

  @Input('appResponsive') mode!: 'mobile' | 'desktop';

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {}

  ngOnInit(): void {
    this.updateView();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateView();
  }

  private updateView(): void {
    const isMobile = window.innerWidth <= 768;
    const shouldRender = (this.mode === 'mobile' && isMobile) || (this.mode === 'desktop' && !isMobile);

    if (shouldRender && this.currentMode !== this.mode) {
      this.vcr.clear();
      this.vcr.createEmbeddedView(this.tpl);
      this.currentMode = this.mode;
    } else if (!shouldRender && this.currentMode === this.mode) {
      this.vcr.clear();
      this.currentMode = null;
    }
  }
}
