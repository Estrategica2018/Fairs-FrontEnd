import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeetingPage } from './meeting.page';

describe('MeetingPage', () => {
  let component: MeetingPage;
  let fixture: ComponentFixture<MeetingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
