import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMyFriendComponent } from './list-my-friend.component';

describe('ListMyFriendComponent', () => {
  let component: ListMyFriendComponent;
  let fixture: ComponentFixture<ListMyFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMyFriendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMyFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
