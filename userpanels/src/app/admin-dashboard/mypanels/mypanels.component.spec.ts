import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MypanelsComponent } from './mypanels.component';

describe('MypanelsComponent', () => {
  let component: MypanelsComponent;
  let fixture: ComponentFixture<MypanelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MypanelsComponent]
    });
    fixture = TestBed.createComponent(MypanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
