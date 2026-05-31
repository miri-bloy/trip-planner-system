import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../modules/user.module';
import { RouterLink, Router } from "@angular/router"; // הוספת Router ליבוא

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
    name: '',
    password: '',
  };

  verifyPassword = "";

  onSubmit() {
    
    this.loading.set(true);
    this.error.set(null);

    //בדיקה וטיפול במקרה של משתמש חדש
    this.authService.checkUserExists(this.userModel.name).subscribe({
      next: (existingUsers) => {
        if (existingUsers.length === 0) {
          this.error.set('שם משתמש זה אינו מוכר במערכת, הכנס שם רשום או עבור לדף הרשמה');
          this.loading.set(false);
          return;
        }

        //חיבור המשתמש 
        this.authService.login(this.userModel.name, this.userModel.password).subscribe({
          next: (response) => {
            console.log('התחבר בהצלחה!', response);
            this.loading.set(false);
            this.userModel = { name: '', password: ''};
            
            // ניווט לדף הבית לאחר חיבור מוצלח
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error(err);
            this.error.set('ההתחברות נכשלה- נא להכניס סיסמה תקינה');
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