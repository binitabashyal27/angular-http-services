import {
  Student,
  StudentResponse,
  StudentService
} from '../services/student.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs'; 
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; 

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit, OnDestroy {

  students: Student[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  loading = false;
  message = '';

  // RxJS Search Elements
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private studentService: StudentService,
    private cdRef: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    console.log("Student Component Loaded");
    this.loadStudents();

    // Reactive Live API Search Setup
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),        // Wait 400ms for user to stop typing
      distinctUntilChanged()   // Only trigger if text is actually different
    ).subscribe((query: string) => {
      this.searchQuery = query;
      this.currentPage = 1;     // Always reset page count to 1 for new search filtering
      this.loadStudents();      
    });
  }

  onSearchChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.searchSubject.next(element.value);
  }

  loadStudents(){
    this.loading = true;
    this.studentService
    .getStudents(
      this.currentPage,
      this.pageSize,
      this.searchQuery // Passes search string directly to our updated service
    )
    .subscribe({
      next:(response: StudentResponse)=>{
        console.log(
          "FULL RESPONSE:",
          response
        );

        console.log(
          "STUDENTS:",
          response.students
        );

        this.students = response.students || [];
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalRecords = response.totalRecords;
        this.loading = false;

        setTimeout(() => {
          this.cdRef.detectChanges();
        }, 0);

        console.log(
          "FINAL STUDENTS ARRAY:",
          this.students
        );
      },
      error:(error)=>{
        console.log(
          "API ERROR:",
          error
        );
        this.students = [];
        this.loading = false;
        setTimeout(() => {
          this.cdRef.detectChanges();
        }, 0);
      }
    });
  }

  nextPage(){
    if(this.currentPage < this.totalPages){
      this.currentPage++;
      this.loadStudents();
    }
  }

  previousPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.loadStudents();
    }
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
