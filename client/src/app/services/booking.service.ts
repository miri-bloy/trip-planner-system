import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from '../modules/booking.module';

@Injectable({
  providedIn: 'root'
})

// ~~~~~~~~~~~~~~~שירות לניהול הזמנות במערכת~~~~~~~~~~~~~~~~

export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/bookings';

  // קבלת רשימת כל ההזמנות במערכת
  getBookings(): Observable<Booking[]> {
    console.log(this.apiUrl);
    return this.http.get<Booking[]>(this.apiUrl);
  }

  // יצירת הזמנה חדשה לטיול
  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  // ביטול הזמנה קיימת לפי מזהה הזמנה
  cancelBooking(bookingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookingId}`);
  }

  //פונקציות אלו לא עובדות בפועל:
  //  לאחר סדיקה התברר שיש בעיה בתרגום של ה QUARY (המרה בין מחרוזת למספר)
  //   //קבלת כל ההזמנות ע"פ מזהה משתמש
  //   getBookingsByUserId(userId: string | undefined): Observable<Booking[]> {
  //     return this.http.get<Booking[]>(`${this.apiUrl}?userId=${userId}`);
  //   }
  //   //קבלת כל ההזמנות ע"פ מזהה טיול
  //   getBookingsByTripId(tripId: string | undefined): Observable<Booking[]> {
  //   return this.http.get<Booking[]>(`${this.apiUrl}?tripId=${tripId}`);
  //   }

  //  //קבלת כל ההזמנות ע"פ מזהה טיול ומזהה משתמש
  //  getBookingsByUserIdAndTripId(userId: string | undefined, tripId: string): Observable<Booking[]> {
  //     return this.http.get<Booking[]>(`${this.apiUrl}?userId=${userId}&tripId=${tripId}`);
  //  }

}