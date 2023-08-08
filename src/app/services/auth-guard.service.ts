import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.isLoggedIn().pipe(
      tap((userIsLoggesIn) => {
        if (!userIsLoggesIn) this.router.navigate(['/']);
      })
    );
  }
}
