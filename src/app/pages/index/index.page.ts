import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FairsService } from 'src/app/api/fairs.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  fair: any;

  constructor(private fairsService: FairsService,
    private router: Router) { }

  ngOnInit() {
    this.fairsService.getCurrentFair().then((fair) => {
      this.fair = fair;
      console.log(this.fair.redirectTo);
      this.redirectTo(this.fair.redirectTo);
    });

  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/overflow', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }
}
