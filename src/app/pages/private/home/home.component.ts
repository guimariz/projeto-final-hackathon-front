import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HackathonService } from 'src/app/services/hackathon.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  professores: any = [];
  data: any = [];
  alunos: any = [];
  cursos: any = [];
  aulas: any = [];
  cursosProf: any = [];
  tableName: any = [];


  constructor(private router : Router, private hackathonService : HackathonService) { 
  }
  
  ngOnInit(): void {
    this.listarTables();
  }
  
  async listarTables() {
    this.tableName.push({ nome : "Professores" })
    this.tableName.push({ nome : "Alunos" })
    this.tableName.push({ nome : "Cursos" })
    this.tableName.push({ nome : "Aulas" })
    this.data = await this.listarTodos();
  }
  
  async listarTodos() {
    const lista = []
    this.professores = await this.hackathonService.listarTodosHome('professor')
    lista.push(this.professores)
    this.listarCursosProf()
    this.alunos = await this.hackathonService.listarTodosHome('aluno')
    lista.push(this.alunos);
    this.cursos = await this.hackathonService.listarTodosHome('curso')
    lista.push(this.cursos)
    this.aulas = await this.hackathonService.listarTodosHome('aulas')
    lista.push(this.aulas);
    
    return lista
  }


  async listarCursosProf() {
    for(let prof of this.professores) {
      this.cursosProf.push(await this.hackathonService.listarCursosProf(prof.id))
    }
  }

  mostrarLista(tipo) {
    this.router.navigate([`/listar/${tipo}`])
  }

}
