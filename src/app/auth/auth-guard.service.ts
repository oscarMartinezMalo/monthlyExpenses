import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
                private router: Router,
                private snackBar: MatSnackBar) { }

    canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        // return !!this.authService.user;
        return this.authService.user.pipe(
            take(1),
            map(user => !!user),
            tap(loggedIn => {
                if (!loggedIn) {
                    console.log('Access denied');
                    this.snackBar.open('Sign In Please', 'X', {
                        duration: 3000,
                    });
                    this.router.navigate(['/signin']);
                }
            })
        );
    }

}
