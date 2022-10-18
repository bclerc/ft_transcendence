import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoomChatComponent } from './edit-room-chat.component';

describe('EditRoomChatComponent', () => {
  let component: EditRoomChatComponent;
  let fixture: ComponentFixture<EditRoomChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRoomChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRoomChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
