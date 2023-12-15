import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  //model: any = {}
  maxDate: Date = new Date();

  //registerForm: FormGroup | undefined;
  registerForm: FormGroup = new FormGroup({}); // jer ocekuje parametre poslan je prazan objekat
  validationErros: string[] | undefined;

  constructor(private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router) {
      this.maxDate.setFullYear(this.maxDate.getFullYear()-18);

  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    //this.registerForm = new FormGroup({
     /*this.registerForm = this.fb.group({      // ovo je ekvivalent prethodno zakomentarisanoj liniji
    username: new FormControl('Hello', Validators.required),
      password: new FormControl('', [Validators.required, Validators.min(4), Validators.max(8)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')]),
    });*/
    // na osnovu komentara FromControla se moze maknuti tj na osnovu injectanog servisa


    this.registerForm = this.fb.group({      // ovo je ekvivalent prethodno zakomentarisanoj liniji
      gender: ['male'], // radio button oni su tricky za validiranje pa cemo staviti ovako inicijalno na nesto i onda moras menjati
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', Validators.required, Validators.min(4), Validators.max(8)],
      confirmPassword: ['', Validators.required, this.matchValues('password')],
      });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }// sad na osnovu ovog koda kad god se promeni password ili confirm password uvek se prati validacija
  

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true }
    }
  }

  register(){
    //console.log(this.model);
    //this.accountService.register(this.model).subscribe({
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = {...this.registerForm.value, dateOfBirth: dob};  // spread operator
    this.accountService.register(values).subscribe({
    //this.accountService.register(this.registerForm.value).subscribe({
      next: response =>{
        //console.log(response);
        //this.cancel();
        this.router.navigateByUrl('/members');
      },
      error: error => {
        this.validationErros = error;
        //this.toastr.error(error.error)
      }
    });
  }

  cancel(){
    console.log('cancelled');

    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset())).toISOString()
    .slice(0, 10);
  }

}
