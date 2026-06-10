import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../modules/user.module';

@Injectable({
  providedIn: 'root'
})

// ~~~~~~~~~~~~~~~שירות לניהול הזדהות ופרטי משתמש במערכת~~~~~~~~~~~~~~~~~

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

  // בדיקת תקינות - האם המשתמש כבר קיים (משמש בעיקר לרגיסטר)
  checkUserExists(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`);
  }

  // הרשמה למערכת
  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap(newUser => {
        this.currentUser.set(newUser);
      })
    );
  }

  // התחברות למערכת - מחזיר את המשתמש המלא אם הכל תקין
  login(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`);
  }

  // התנתקות מהמערכת
  logout(): void {
    this.currentUser.set(null);
  }
}