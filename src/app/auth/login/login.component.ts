import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  google: any;

  public formSubmitted = false;
  loginForm: FormGroup;

  @ViewChild('googleBtn') googleBtn: ElementRef | undefined;

  constructor(private router: Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService) {
    
    this.loginForm = this.fb.group({
                  email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
                  password: ['', Validators.required],
                  remember: [false]
    });                
  }
  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    this.google?.accounts.id.initialize({
      client_id: "812546794861-prtip50ntugt9qd58f2h2da1rtnth5ch.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    this.google?.accounts.id.renderButton(
      this.googleBtn?.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
    //google.accounts.id.prompt(); // also display the One Tap dialog
  }

  handleCredentialResponse( response: any) {
     console.log("Encoded JWT ID token: " + response.credential);
     this.usuarioService.loginGoogle( response.credential )
     .subscribe( resp => {
      this.router.navigateByUrl('/');
     })
  }

  login() {
    this.usuarioService.login( this.loginForm.value )
    .subscribe( resp => {
      if ( this.loginForm.get('remember')?.value ) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
      } else {
        localStorage.removeItem('email');
      }
      this.router.navigateByUrl('/');
    }, (err) => {
      console.log(err);
      Swal.fire('Error', err.error.msg, 'error')
    });    
    //
  }
}
