import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    const token = this.router.url.split('/')[4];
    if (token) {
      localStorage.setItem('trans', token);
    }
    console.log(token);
    this.snackBar.open('You are successfully logged', 'OK');
    this.router.navigate(['/private/dashboard']);
  }

}
