import { Component, Input} from '@angular/core';
import {environment} from "../../../environments/environment.development";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-panel-card',
  templateUrl: './my-panel-card.component.html',
  styleUrls: ['./my-panel-card.component.css']
})
export class MyPanelCardComponent {
  @Input() panel: any;

  ngOnInit(){
  }

  constructor(private router:Router) {
  }

  transaction(): void {
      // this.router.navigate("/passbook")
  }

  close(): void {

  }

  protected readonly environment = environment;
}
