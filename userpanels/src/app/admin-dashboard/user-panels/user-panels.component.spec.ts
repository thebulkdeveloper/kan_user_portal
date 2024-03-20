import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelsComponent } from './user-panels.component';

describe('UserPanelsComponent', () => {
  let component: UserPanelsComponent;
  let fixture: ComponentFixture<UserPanelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPanelsComponent]
    });
    fixture = TestBed.createComponent(UserPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
