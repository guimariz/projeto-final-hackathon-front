import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { Usuario } from '../models/usuario';

const URL = 'http://localhost:3000/stefanini';

@Injectable({
  providedIn: 'root',
})
export class HackathonService {
  listaProfessor : any = [];
  listaAluno : any = [];
  listaCurso : any = [];
  listaAula : any = [];

  constructor(private httpClient: HttpClient) {}

  listarTodos(rota: string) {
    return this.httpClient.get(`${URL}/${rota}`).toPromise();
  }

  listarTodosHome(rota: string) {
    return this.httpClient.get(`${URL}/home/${rota}`).toPromise();
  }

  listarAulas(id) {
    return this.httpClient.get(`${URL}/aula/?idCurso=${id}`).toPromise();
  }
  
  listarCursosProf(id) {
    return this.httpClient.get(`${URL}/curso/prof/${id}`).toPromise();
  }

  async getListaProfessor(forceRefresh = false){
    if(!this.listaProfessor || forceRefresh){
      this.listaProfessor = await this.listarTodos('professor');
    }
    return this.listaProfessor;
  }
  async getListaAluno(forceRefresh = false){
    if(!this.listaAluno  || forceRefresh){ 
      this.listaAluno = await this.listarTodos('aluno');
    }
    return this.listaAluno;
  }
  async getListaCurso(forceRefresh = false){
    if(!this.listaCurso  || forceRefresh){ 
      this.listaCurso = await this.listarTodos('curso');
    }
    return this.listaCurso;
  }
  async getListaAula(forceRefresh = false){
    if(!this.listaAula  || forceRefresh){ 
      this.listaAula = await this.listarTodos('aulas');
    }
    return this.listaAula;
  }

  incluir(usuario: Usuario, rota: string): Observable<Mensagem>{
    let body = usuario

    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/${rota}`;

    return this.httpClient.post<Mensagem>(url, body, header);
  }

  obter(id: number, rota: string): Observable<Mensagem>{
    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/${rota}/${id}`;

    return this.httpClient.get<Mensagem>(url, header);
  }

  obterAluno(nome: string): Observable<Mensagem>{
    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/aluno/nome/${nome}`;

    return this.httpClient.get<Mensagem>(url, header);
  }

  matricularAluno(idAluno: number, idCurso: number){
    let body = {
      idCurso: idCurso
    };

    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/matricular/${idAluno}`;

    return this.httpClient.put<Mensagem>(url, body, header).toPromise();
  }

  atribuirNota(idCurso: number, nota: number, idAluno: number, tipo: number){
    let body = {
      idCurso: idCurso,
      idAluno: idAluno,
      nota: nota,
      tipo: tipo
    }

    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/curso/nota/`;

    return this.httpClient.put<Mensagem>(url, body, header).toPromise();  
  }

  alterar(id: number, usuario: Usuario, rota: string): Observable<Mensagem>{
    let body = usuario

    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/${rota}/${id}`;

    return this.httpClient.put<Mensagem>(url, body, header);
  }

  excluir(id: number, rota: string): Observable<Mensagem> {
    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/${rota}/${id}`;

    return this.httpClient.delete<Mensagem>(url, header);
  }

  excluirAula(id: number, rota: string, idCurso: number): Observable<Mensagem> {
    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/${rota}/${id}?idCurso=${idCurso}`;

    return this.httpClient.delete<Mensagem>(url, header);
  }
}
