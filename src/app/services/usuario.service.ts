import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario | undefined

  constructor( private http: HttpClient,
               private router: Router ) { 

  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  validarToken() {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      map( (resp: any) => {

        const { email, google, nombre, role, uid, img = '' } = resp.usuario;

        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
        localStorage.setItem('token', resp.token);

        return true;
      }),      
      catchError( error => {
        console.log(error);
        return of(false)
      })
    );
  }

  crearUsuario ( formData: RegisterForm ) {    
    return this.http.post(`${ base_url }/usuarios`, formData)
           .pipe(
              tap ( (resp: any) => {
                localStorage.setItem('token', resp.token);
              })
           )
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string } ) {
    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    });
  }

  login ( formData: LoginForm ) {
    return this.http.post(`${ base_url }/login`, formData)
            .pipe(
              tap( (resp: any) => {
                localStorage.setItem('token', resp.token);
              })
            );
  }

  loginGoogle ( token: string ) {
    return this.http.post(`${ base_url }/login/google`, { token })
    .pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
    google.accounts.id.revoke( 'correo', () => {
      this.router.navigateByUrl('/login');
    });
  }
}
