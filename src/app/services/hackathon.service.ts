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

  constructor(private httpClient: HttpClient) {  }

  listarTodos(rota: string, home = false) {
    const params = home ? { home: home.toString() } : {}

    return this.httpClient.get(`${URL}/${rota}/`, { params }).toPromise();
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
  
  getCursosMatriculado() {
    return this.httpClient.get(`${URL}/curso/matriculado/`).toPromise();
  }

  async getListaProfessorHome(){
    return await this.listarTodos('professor', true);
  }

  async getListaProfessor(forceRefresh = false){
    this.listaProfessor = this.listaProfessor || [];
    if(!this.listaProfessor.length || forceRefresh){
      this.listaProfessor = await this.listarTodos('professor');
    }
    return this.listaProfessor;
  }

  async getListaAlunoHome(){  
    return await this.listarTodos('aluno', true);
  }

  async getListaAluno(forceRefresh = false){
    if(!this.listaAluno.length || forceRefresh){ 
      this.listaAluno = await this.listarTodos('aluno');
    }
    return this.listaAluno;
  }

  async getListaCursoHome (){
    return await this.listarTodos('curso', true);
  }

  async getListaCurso(forceRefresh = false){
    if(!this.listaCurso.length || forceRefresh){ 
      this.listaCurso = await this.listarTodos('curso');
    }
    return this.listaCurso;
  }

  async getListaAulaHome(){
    return await this.listarTodos('aulas', true);
  }

  async getListaAula(forceRefresh = false){
    if(!this.listaAula.length || forceRefresh){ 
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

  obterUsuario(email: string, tipo: number): Observable<Mensagem>{
    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url;
    if(tipo === 1) {
      url = `${URL}/professor/email/${email}`;
    } else {
      url = `${URL}/aluno/email/${email}`;
    }

    return this.httpClient.get<Mensagem>(url, header);
  }

  matricularAluno(idCurso: number){

    let header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    let url = `${URL}/matricular/${idCurso}`;

    return this.httpClient.put<Mensagem>(url,{}, header).toPromise();
  }

  atribuirNota(idCurso: number, nota: number){
    let body = {
      idCurso: idCurso,
      nota: nota,
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
