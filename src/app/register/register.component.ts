import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  model: any = {}

  registerForm: FormGroup | undefined;

  constructor(private accountService: AccountService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl(),
    })
  }

  register(){
    console.log(this.model);
    this.accountService.register(this.model).subscribe({
      next: response =>{
        console.log(response);
        this.cancel();
      },
      error: error => this.toastr.error(error.error)
    });
  }

  cancel(){
    console.log('cancelled');

    this.cancelRegister.emit(false);
  }

}
