import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected authService = inject(AuthService);
  private router = inject(Router);

  onLogout(){
    this.authService.currentUser.set(null);
    this.router.navigate(['/login'])
  }
}
