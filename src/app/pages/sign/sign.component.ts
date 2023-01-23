import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { PatientSign } from 'src/app/model/patientSign';
import { ActivatedRoute } from '@angular/router';
import { SignService } from 'src/app/service/sign.service';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {
  patientSigns : PatientSign[] = [];
  displayedColumns: string[] = ['patientIdPatient','patientFirstName','patientLastName','idVitalSign', 'signDate','temperature','pulse','respiratory', 'actions'];
  patient: Patient;
  dataSource: MatTableDataSource<PatientSign>;

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

  totalElements: number;

  constructor(
    private route: ActivatedRoute,
    private patientSignService: SignService,
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.patientSignService.findAll().subscribe(data => {
      this.createTable(data);
      console.log(data);

      //this.patientSigns = data;
    })
    /*this.patientSignService.getPatientSignChange().subscribe(data => {
      //this.patientSigns = data;
      this.createTable(data);
      console.log(data);
    });



    this.patientSignService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2000, verticalPosition: "top", horizontalPosition: "right" });
    });

    this.patientSignService.listPageable(0, 2).subscribe(data => {
     // this.createTable(data);
      console.log(data);
    });

    this.patientSignService.findAll().subscribe(data => {
      this.createTable(data);
      console.log(data);
    });*/
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  delete(idPatientSign: number){
    this.patientSignService.findPatientById(idPatientSign).subscribe((data) => {
      //this.patientControl.setValue( data);
      console.log('selected id patient' );

      console.log(data.idPatient);

      this.patient = data;
      console.log(this.patient);
    });

    alert('delete');
    let nroSignDelete = this.patient.signs.findIndex(el =>
      el.idVitalSign === idPatientSign
    );
    this.patient.signs.splice(nroSignDelete,1);
    this.patientService.update(this.patient).pipe(switchMap( ()=> {
      return this.patientSignService.findAll();
    }))
    .subscribe(data => {
      this.patientSignService.setPatientSignChange(data);
      this.patientSignService.setMessageChange('DELETED!');
    });


  }

  createTable(data: any){

    this.dataSource = new MatTableDataSource(data);

    //this.dataSource.paginator = this.paginator;
    this.totalElements = data.totalElements;

  }

  checkChildren(): boolean{
    return this.route.children.length != 0;
  }

  showMore(e: any){
    this.patientSignService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.createTable(data);
    });
  }
}
