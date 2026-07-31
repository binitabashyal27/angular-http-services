import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})


export class DepartmentService {


  private apiUrl = `${environment.apiUrl}/api/Management`;



  constructor(
    private http: HttpClient
  ) {}




  // =========================
  // GET ALL DEPARTMENTS
  // =========================

  getDepartments(){

    return this.http.get(

      `${this.apiUrl}/Departments`

    );

  }





  // =========================
  // GET DEPARTMENT BY ID
  // =========================

  getDepartmentById(id:number){


    return this.http.get(

      `${this.apiUrl}/Department/${id}`

    );


  }






  // =========================
  // ADD DEPARTMENT POST
  // =========================

  addDepartment(data:any){


    return this.http.post(

      `${this.apiUrl}/AddDepartment`,

      data

    );


  }






  // =========================
  // UPDATE DEPARTMENT PUT
  // =========================

  updateDepartment(
    id:number,
    data:any
  ){


    return this.http.put(

      `${this.apiUrl}/UpdateDepartment/${id}`,

      data

    );


  }



}