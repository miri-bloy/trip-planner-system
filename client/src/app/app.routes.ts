import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { AllTrips } from './pages/all-trips/all-trips';
import { TripDetails } from './pages/trip-details/trip-details';
import { MyTrips } from './pages/my-trips/my-trips';
import { Welcome } from './components/welcome/welcome';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    {
        path: '',
        component: Home,
        children: [
            { path: 'home', component: Welcome },
            { path: 'all-trips', component: AllTrips },
            { path: 'all-trips/:id', component: TripDetails },
            { path: 'my-trips', component: MyTrips },
            { path: 'my-trips/:id', component: TripDetails },
        ]
    },
];
