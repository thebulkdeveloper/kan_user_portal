import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-panelcomponent',
  templateUrl: './panelcomponent.component.html',
  styleUrls: ['./panelcomponent.component.css']
})
export class PanelcomponentComponent {
  @Input() panel: any;
  textToCopy='Text to copy';
}
