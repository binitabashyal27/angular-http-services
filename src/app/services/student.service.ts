import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Student {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  collegeName: string;
  programName: string;
  levelName: string;
  facultyName: string;
  isVerified: boolean;
  fullName: string;
}

export interface StudentResponse {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  students: Student[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private http: HttpClient
  ) {}

  getStudents(
    page: number,
    pageSize: number,
    search: string = '' // Optional parameter for our search query
  ): Observable<StudentResponse> {

    let params = new HttpParams()
      .set('isVerified', 'true')
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // CRITICAL FIX: The backend expects the exact parameter key 'name'
    if (search && search.trim() !== '') {
      params = params.set('name', search.trim());
    }

    console.log(
      'REQUEST URL:',
      `${environment.apiUrl}/api/Student/GetAllStudentPaginated`
    );

    console.log(
      'REQUEST PARAMS:',
      params.toString()
    );

    return this.http.get<StudentResponse>(
      `${environment.apiUrl}/api/Student/GetAllStudentPaginated`,
      {
        params: params
      }
    );
  }
}
