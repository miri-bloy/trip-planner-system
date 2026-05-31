import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../modules/user.module';
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
  users = signal<User[]>([]);
  error = signal<string | null>(null);

  userModel = {
    email: '',
    password: '',
  };

  verifyPassword = "";

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);
  
    // בדיקה האם המשתמש קיים במערכת
    this.authService.checkUserExists(this.userModel.email).subscribe({
      next: (existingUsers) => {
        if (existingUsers.length === 0) {
          this.error.set('שם משתמש זה אינו מוכר במערכת, הכנס שם רשום או עבור לדף הרשמה');
          this.loading.set(false);
          return;
        }
  
        // חיבור המשתמש בפועל
        this.authService.login(this.userModel.email, this.userModel.password).subscribe({
          next: (response) => {
            if (response && response.length > 0) {
              console.log('התחבר בהצלחה!', response);
              this.loading.set(false);     
              this.router.navigate(['/home']);
            } 
            else {
              this.error.set('הסיסמה שהזנת אינה תואמת לכתובת המייל.');
              this.loading.set(false);
            }
          },
          error: (err) => {
            console.error(err);
            this.error.set('ההתחברות נכשלה - נא להכניס סיסמה תקינה');
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.error.set('שגיאה בתקשורת מול השרת.');
        this.loading.set(false);
      }
    });
  }
}