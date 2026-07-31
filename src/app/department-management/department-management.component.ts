import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { DepartmentService } from '../services/department.service';
import { ToastrService } from 'ngx-toastr';

@Component({

  selector: 'app-department-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './department-management.component.html',

  styleUrls: ['./department-management.component.css']

})

export class DepartmentManagement implements OnInit {

  departments:any[] = [];
  searchTerm: string = '';
  showModal:boolean = false;
  isEditMode:boolean = false;
  selectedDepartmentId:number|null = null;
  department = {

    campusId:12,

    departmentName:'',

    remarks:'',

    status:true

  };

  constructor(

    private departmentService:DepartmentService,

    private toastr:ToastrService,
     private cdRef: ChangeDetectorRef

  ){}

  ngOnInit(){

    this.getDepartments();

  }

  // GET ALL DEPARTMENTS
  getDepartments() {
    this.departmentService
      .getDepartments()
      .subscribe({
        next: (res: any) => {
          console.log("Department List Loaded on Init:", res);
          
          this.departments = res;
          setTimeout(() => {
            this.cdRef.detectChanges();
          }, 0);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error("Failed to load departments");
        }
      });
  }

  // OPEN ADD POPUP

  openAddModal(){

    this.isEditMode = false;
    this.selectedDepartmentId = null;
    this.department = {
      campusId:12,
      departmentName:'',
      remarks:'',
      status:true
    };

    this.showModal = true;
  }

  // CLOSE POPUP

  closeModal() {
  
  setTimeout(() => {
    this.showModal = false;
    this.isEditMode = false;
    this.selectedDepartmentId = null;
    
    this.department = {
      campusId: 12,
      departmentName: '',
      remarks: '',
      status: true
    };

  this.cdRef.detectChanges();
  }, 0); 
}

  // EDIT BUTTON
  editDepartment(dept: any) {
    console.log("Edit ID:", dept.id);

    this.selectedDepartmentId = dept.id;
    this.isEditMode = true;

    this.showModal = true;
    
    setTimeout(() => {
      this.cdRef.detectChanges();
    }, 0);

  
    this.departmentService
      .getDepartmentById(dept.id)
      .subscribe({
        next: (res: any) => {
          console.log("Department Detail:", res);

          this.department.campusId = res.campusId;
          this.department.departmentName = res.departmentName;
          this.department.remarks = res.remarks;
          this.department.status = res.status;

          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.toastr.error("Failed to get department");
          
         
          this.closeModal();
        }
      });
  }
  
  get filteredDepartments() {
    if (!this.searchTerm) {
      return this.departments; 
    }
    
   
    return this.departments.filter(dept => 
      dept.departmentName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      dept.remarks?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // SAVE BUTTON

  saveDepartment(){


    if(this.isEditMode){


      this.updateDepartment();


    }
    else{


      this.addDepartment();


    }


  }


  // ADD POST API
  addDepartment() {
    const payload = {
      campusId: this.department.campusId,
      departmentName: this.department.departmentName,
      remarks: this.department.remarks,
      status: this.department.status
    };

    this.departmentService.addDepartment(payload).subscribe({
      next: (res: any) => {
        console.log("Added Response:", res);
        
      
        this.closeModal();
        this.toastr.success("Department added successfully", "Success");

       
        const newRecord = (res && typeof res === 'object' && res.id) 
          ? res 
          : { ...payload, id: res?.id || Date.now(), createdDate: new Date().toLocaleDateString() };

        
        this.departments = [newRecord, ...this.departments];
        this.cdRef.detectChanges(); 

        
        setTimeout(() => {
          this.departmentService.getDepartments().subscribe({
            next: (refreshRes: any) => {
              this.departments = refreshRes;
              this.cdRef.detectChanges();
            }
          });
        }, 1500);
      },
      error: (err) => {
        console.error("Add Error:", err);
        this.toastr.error("Add failed", "Error");
      }
    });
  }

 // UPDATE PUT API
 
  updateDepartment() {
    const payload = {
      campusId: this.department.campusId,
      departmentName: this.department.departmentName,
      remarks: this.department.remarks,
      status: this.department.status
    };

    this.departmentService
      .updateDepartment(this.selectedDepartmentId!, payload)
      .subscribe({
        next: (res: any) => {
          console.log("Updated API Response:", res);
          
          this.closeModal(); 
          
          this.toastr.success("Department updated successfully", "Success");

          
          this.departments = this.departments.map(dept => {
            if (dept.id === this.selectedDepartmentId) {
              return { ...dept, ...payload };
            }
            return dept;
          });
          this.cdRef.detectChanges(); 

        
          setTimeout(() => this.getDepartments(), 1000);
        },
        error: (err) => {
          console.error("Update Error:", err);
          const errMsg = err.error?.message || "Update failed";
          this.toastr.error(errMsg, "Error");
        }
      });
  }

}

