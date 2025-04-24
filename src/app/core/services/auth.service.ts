import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  verificarEstudiante(): boolean{

    if(localStorage.getItem('estudiante')){
      return true;
    }
    return false;
  }

  verificarCoordinador(): boolean{
    if(localStorage.getItem('coordinador')){
      return true;
    }
    return false;
  }

  verificarProfesor(): boolean{
    if(localStorage.getItem('profesor')){
      return true;
    }
    return false;
  }

  verificarAdmin(): boolean{
    if(localStorage.getItem('admin')){
      return true;
    }
    return false;
  }

}
