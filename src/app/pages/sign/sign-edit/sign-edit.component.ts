import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientSign } from 'src/app/model/patientSign';
import { SignService } from 'src/app/service/sign.service';
import { map, Observable, switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
@Component({
  selector: 'app-sign-edit',
  templateUrl: './sign-edit.component.html',
  styleUrls: ['./sign-edit.component.css']
})
export class SignEditComponent implements OnInit {
  id: number;
  isEdit: boolean;
  form: FormGroup;
  patientControl: FormControl = new FormControl();
  patients: Patient[];
  patientsFiltered$: Observable<Patient[]>;
  constructor(
    private signService: SignService,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      'patient': this.patientControl,
      'idVitalSign' : new FormControl(0),
      'signDate' : new FormControl(''),
      'temperature': new FormControl(''),
      'pulse' : new FormControl(''),
      'respiratory': new FormControl(''),
    });

    this.loadInitialData();
    this.patientsFiltered$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));
    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

    initForm() {
    if (this.isEdit) {

      this.signService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({

          idVitalSign : new FormControl(data.idVitalSign),
          signDate : new FormControl(data.signDate),
          temperature : new FormControl(data.temperature),
          pulse : new FormControl(data.pulse),
          respiratory : new FormControl(data.respiratory)
        })




        });
      this.signService.findPatientById(this.id).subscribe((data) => {
        //this.patientControl.setValue( data);
        console.log('selected id patient' );

        console.log(data.idPatient);
        this.patientControl.setValue(data) ;
       this.patientsFiltered$ = this.patientControl.valueChanges.pipe(map(val =>this.filterPatients(data)));
      });
    }

  }

  filterPatients(val: any){
    console.log('into filterPatients');
    if (val?.idPatient > 0) {
      if (this.isEdit) {
        return this.patients.filter(el =>
          el.idPatient === val.idPatient
        )
      }
      else{
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) || el.lastName.toLowerCase().includes(val.lastName.toLowerCase()) || el.dni.includes(val)

        )
      }

    } else {
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val?.toLowerCase()) || el.lastName.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
      );
    }
  }
  operate(){
    if (this.form.invalid)
      return;

    const sign = new PatientSign();
    sign.idVitalSign = this.form.value['idVitalSign'];
    sign.signDate = this.form.value['signDate'];
    sign.temperature = this.form.value['temperature'];
    sign.pulse = this.form.value['pulse'];
    sign.respiratory = this.form.value['respiratory'];

    const patient = new Patient();
    console.log(this.patientControl.value);
    //patient.signs.push(sign);


    this.router.navigate(['/pages/sign']);


  }

  get f(){
    return this.form.controls;
  }
  showPatient(val: any){
    return val ? `${val.firstName} ${val.lastName}` : val;
  }

  loadInitialData() {
    this.patientService.findAll().subscribe((data) => this.patients = data);

  }
}
