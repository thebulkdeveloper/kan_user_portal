import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelcomponentComponent } from './panelcomponent.component';

describe('PanelcomponentComponent', () => {
  let component: PanelcomponentComponent;
  let fixture: ComponentFixture<PanelcomponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelcomponentComponent]
    });
    fixture = TestBed.createComponent(PanelcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
