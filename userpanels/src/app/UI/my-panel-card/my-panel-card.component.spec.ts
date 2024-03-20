import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPanelCardComponent } from './my-panel-card.component';

describe('MyPanelCardComponent', () => {
  let component: MyPanelCardComponent;
  let fixture: ComponentFixture<MyPanelCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyPanelCardComponent]
    });
    fixture = TestBed.createComponent(MyPanelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
