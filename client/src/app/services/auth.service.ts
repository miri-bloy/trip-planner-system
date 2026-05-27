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

  // ניהול מצב המשתמש המחובר באמצעות Signal
  currentUser = signal<User | null>(null);

  // קבלת רשימת כל המשתמשים במערכת
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // קבלת פרטי משתמש ספציפי לפי מזהה
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // הוספת משתמש חדש (הרשמה)
  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap(newUser => {
        // עדכון אוטומטי של המשתמש המחובר לאחר הרשמה מוצלחת
        this.currentUser.set(newUser);
      })
    );
  }

  // לוגין פשוט (סימולציה מול ה-API של המשתמשים)
  login(email: string, password: string): Observable<User[]> {
    // אנו מחפשים משתמש שמתאים לאימייל ולסיסמה
    const loginUrl = `${this.apiUrl}?email=${email}&password=${password}`;
    return this.http.get<User[]>(loginUrl).pipe(
      tap(users => {
        if (users && users.length > 0) {
          // מצאנו משתמש מתאים - נשמור אותו בסיגנל המערכתי
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