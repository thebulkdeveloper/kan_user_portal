import { Directive, HostListener, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from './services/alert.service';

@Directive({
  selector: '[appCopyText]'
})
export class CopyTextDirective {
  @Input('appCopyText') textToCopy:any

  constructor(private toastr:ToastrService, private alert:AlertService) { }

  @HostListener('click')
  onClick() {
    this.copyTextToClipboard(this.textToCopy);
  }

  copyTextToClipboard(text: string) {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    this.alert.copied('Text copied to clipboard!');
  }
}
