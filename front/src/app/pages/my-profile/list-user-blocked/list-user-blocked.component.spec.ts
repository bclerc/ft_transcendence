import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserBlockedComponent } from './list-user-blocked.component';

describe('ListUserBlockedComponent', () => {
  let component: ListUserBlockedComponent;
  let fixture: ComponentFixture<ListUserBlockedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUserBlockedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUserBlockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
