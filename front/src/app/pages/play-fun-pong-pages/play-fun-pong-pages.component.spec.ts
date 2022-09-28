import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayFunPongPagesComponent } from './play-fun-pong-pages.component';

describe('PlayFunPongPagesComponent', () => {
  let component: PlayFunPongPagesComponent;
  let fixture: ComponentFixture<PlayFunPongPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayFunPongPagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayFunPongPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
