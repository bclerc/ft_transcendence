import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayPongPagesComponent } from './play-pong-pages.component';

describe('PlayPongPagesComponent', () => {
  let component: PlayPongPagesComponent;
  let fixture: ComponentFixture<PlayPongPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayPongPagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayPongPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
