import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink, Router } from "@angular/router"; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  userModel = {
    email: '',
    password: '',
  };

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);
  
    // קריאה אחודה לשרת לבדיקת המשתמש
    this.authService.login(this.userModel.email).subscribe({
      next: (users) => {
        // משוב ממוקד 1: המייל לא קיים במערכת
        if (!users || users.length === 0) {
          this.error.set('כתובת המייל שהזנת אינה רשומה במערכת. ודא שהקלדת נכון או עבור לדף הרשמה.');
          this.loading.set(false);
          return;
        }
  
        // משוב ממוקד 2: המייל קיים אך הסיסמה שגויה
        if (users[0].password !== this.userModel.password) {
          this.error.set('הסיסמה שהזנת אינה נכונה עבור מייל זה. נסה שנית.');
          this.loading.set(false);
          return;
        }

        // חיבור מוצלח
        console.log('התחבר בהצלחה!', users[0]);
        this.authService.currentUser.set(users[0]); // עדכון ה-state הגלובלי בסרוויס
        this.loading.set(false);     
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.error.set('שגיאה בתקשורת מול השרת. אנא נסה שוב מאוחר יותר.');
        this.loading.set(false);
      }
    });
  }
}