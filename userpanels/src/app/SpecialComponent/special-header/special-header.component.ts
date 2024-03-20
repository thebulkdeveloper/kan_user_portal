import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-special-header',
  templateUrl: './special-header.component.html',
  styleUrls: ['./special-header.component.css']
})
export class SpecialHeaderComponent {
     
  constructor(private router:Router){}
   
   @Input() title:string=''
}
