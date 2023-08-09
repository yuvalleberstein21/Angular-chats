import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat/app';
import { DEFAULT_USER, User } from '../models/user.interface';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private userDetails$: Subject<User> = new Subject<User>();
  private userId: string = '';

  constructor(
    private NgFireStore: AngularFirestore,
    private NgFireAuth: AngularFireAuth,
    private router: Router
  ) {
    const saveUserString = localStorage.getItem('user');
    if (saveUserString !== null) {
      this.isLoggedIn$.next(true);
    }

    NgFireAuth.authState.subscribe((user) => {
      if (!!user) {
        this.userDetails$.next(user as User);
        const userString: string = JSON.stringify(user);
        localStorage.setItem('user', userString);
        this.isLoggedIn$.next(true);
        this.userId = user.uid;
      } else {
        localStorage.removeItem('user');
        this.isLoggedIn$.next(false);
      }
    });
  }

  public signInWithGoogle() {
    this.authLogin(new firebase.default.auth.GoogleAuthProvider());
  }
  public signOut(): Promise<void> {
    return this.NgFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
      this.userDetails$.next(DEFAULT_USER);
    });
  }

  public getUserData(): Observable<User> {
    return this.userDetails$.asObservable();
  }

  public getUserId(): string {
    return this.userId;
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  private authLogin(provider: firebase.default.auth.AuthProvider) {
    return this.NgFireAuth.signInWithPopup(provider).then((res) => {
      this.isLoggedIn$.next(true);
      this.setUserData(res.user as User);
      this.router.navigate(['/chat']);
    });
  }

  private setUserData(user?: User): Promise<void> | void {
    if (!user) return;
    const userRef: AngularFirestoreDocument<User> = this.NgFireStore.doc<User>(
      `user/${user.uid}`
    );

    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    return userRef.set(userData, {
      merge: true,
    });
  }
}
