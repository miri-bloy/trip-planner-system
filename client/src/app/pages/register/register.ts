import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../modules/user.module';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  userModel: User = {
    name: '',
    email: '',
    password: '',
    isAdmin: false
  };

  verifyPassword = "";

  onSubmit() {
    // 1. בדיקת התאמת סיסמאות מקומית
    if (this.userModel.password !== this.verifyPassword) {
      this.error.set('הסיסמאות שכתבת אינן תואמות זו לזו.');
      return;
    }
    
    this.loading.set(true);
    this.error.set(null);

    // 2. בדיקה מול השרת האם המייל תפוס
    this.authService.checkUserExists(this.userModel.email).subscribe({
      next: (existingUsers) => {
        if (existingUsers.length > 0) {
          this.error.set('כתובת אימייל זו כבר רשומה במערכת. נסה להתחבר או השתמש במייל אחר.');
          this.loading.set(false);
          return;
        }

        // 3. הרשמה בפועל אם המייל פנוי
        this.authService.register(this.userModel).subscribe({
          next: (response) => {
            console.log('נרשם בהצלחה!', response);
            this.loading.set(false);
            this.userModel = { name: '', email: '', password: '', isAdmin: false };
            this.verifyPassword = "";
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error(err);
            this.error.set('תהליך ההרשמה נכשל בשרת. נסה שנית מאוחר יותר.');
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.error.set('שגיאה בתקשורת מול השרת. אנא בדוק את החיבור לרשת.');
        this.loading.set(false);
      }
    });
  }
}