import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aula } from '../models/aula';
import { Curso } from '../models/curso';
import { Mensagem } from '../models/mensagem';
import { Professor } from '../models/professor';
import { Usuario } from '../models/usuario';

const URL = 'http://localhost:3000/stefanini';

@Injectable({
  providedIn: 'root',
})
export class HackathonService {
  constructor(private httpClient: HttpClient) {}

  // #pegabandeira
  listar(filtro: Partial<Professor>): Observable<Professor[]> {
    return this.httpClient.get<Professor[]>(URL, {
      params: filtro,
    });
  }

  listarTodosProf() {
    return this.httpClient.get(`${URL}/professor`).toPromise();
  }

  listarTodosCurso() {
    return this.httpClient.get(`${URL}/curso`).toPromise();
  }

  listarTodosAluno() {
    return this.httpClient.get(`${URL}/aluno`).toPromise();
  }

  listarTodosAula() {
    return this.httpClient.get(`${URL}/aula`).toPromise();
  }

  incluirUsuario(usuario: Usuario): Observable<Mensagem>{
    let body = usuario

    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/usuario`;

    return this.httpClient.post<Mensagem>(url, body, header);
  }

  incluirCurso(curso: Curso): Observable<Mensagem>{
    let body = curso

    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/curso`;

    return this.httpClient.post<Mensagem>(url, body, header);
  }
  
  incluirAula(aula: Aula): Observable<Mensagem>{
    let body = aula

    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/aula`;

    return this.httpClient.post<Mensagem>(url, body, header);
  }

  obter() {}

  incluir(professor: Professor): Observable<Mensagem> {
    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    return this.httpClient.post<Mensagem>(URL, professor, header);
  }

  alterar() {}

  excluir() {}
}
