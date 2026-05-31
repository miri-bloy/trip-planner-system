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
  users = signal<User[]>([]);
  error = signal<string | null>(null);

  userModel: User = {
    name: '',
    email: '',
    password: '',
    isAdmin: false
  };

  verifyPassword = "";

  onSubmit() {

    //בדיקת תקינות הטופס-אימות סיסמה
    if (this.userModel.password !== this.verifyPassword) {
      this.error.set('הסיסמאות שכתבת אינן תואמות זו לזו.');
      return;
    }
    
    this.loading.set(true);
    this.error.set(null);

    //בדיקה וטיפול במקרה של הרשמה למשתמש קיים
    this.authService.checkUserExists(this.userModel.email).subscribe({
      next: (existingUsers) => {
        if (existingUsers.length > 0) {
          this.error.set('מייל זה כבר מוכר במערכת, בחר שם אחר או עבור לדף כניסה');
          this.loading.set(false);
          return;
        }

        //הרשמת המשתמש החדש במערכת
        this.authService.register(this.userModel).subscribe({
          next: (response) => {
            console.log('נרשם בהצלחה!', response);
            this.loading.set(false);
            this.userModel = { name: '', email: '', password: '', isAdmin: false };
            this.verifyPassword = "";
            // ניווט לדף הבית לאחר הרשמה מוצלחת
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error(err);
            this.error.set('ההרשמה נכשלה.');
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