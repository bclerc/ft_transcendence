<<<<<<< HEAD
import { TestBed } from '@angular/core/testing';
import { PlayPongPagesComponent } from './play-pong-pages.component';

describe('PlayPongPagesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PlayPongPagesComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(PlayPongPagesComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'front'`, () => {
    const fixture = TestBed.createComponent(PlayPongPagesComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('front');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(PlayPongPagesComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('front app is running!');
=======
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
>>>>>>> merge
  });
});
