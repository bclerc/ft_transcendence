import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendListComponent } from './add-friend-list.component';

describe('AddFriendListComponent', () => {
  let component: AddFriendListComponent;
  let fixture: ComponentFixture<AddFriendListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFriendListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFriendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
