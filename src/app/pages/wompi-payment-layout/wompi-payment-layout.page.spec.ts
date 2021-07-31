import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WompiPaymentLayoutPage } from './wompi-payment-layout.page';

describe('WompiPaymentLayoutPage', () => {
  let component: WompiPaymentLayoutPage;
  let fixture: ComponentFixture<WompiPaymentLayoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WompiPaymentLayoutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WompiPaymentLayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
