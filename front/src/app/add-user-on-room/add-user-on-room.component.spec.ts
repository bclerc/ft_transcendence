import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserOnRoomComponent } from './add-user-on-room.component';

describe('AddUserOnRoomComponent', () => {
  let component: AddUserOnRoomComponent;
  let fixture: ComponentFixture<AddUserOnRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserOnRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserOnRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
