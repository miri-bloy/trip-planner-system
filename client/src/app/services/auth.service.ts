import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../modules/user.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';

  // משתמש נוכחי שמחובר למערכת
  currentUser = signal<User | null>(null);

  // קבלת רשימת כל המשתמשים במערכת
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // קבלת פרטי משתמש ספציפי לפי מזהה
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // בדיקה תקינות- האם המשתמש כבר קיים
  checkUserExists(name: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?name=${name}`);
  }

  // הרשמה למערכת
  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap(newUser => {
        this.currentUser.set(newUser);
      })
    );
  }

  // התחברות למערכת
  login(email: string, password: string): Observable<User[]> {
    const loginUrl = `${this.apiUrl}?email=${email}&password=${password}`;
    return this.http.get<User[]>(loginUrl).pipe(
      tap(users => {
        if (users && users.length > 0) {
          this.currentUser.set(users[0]);
        }
      })
    );
  }

  // התנתקות מהמערכת
  logout(): void {
    this.currentUser.set(null);
  }
}