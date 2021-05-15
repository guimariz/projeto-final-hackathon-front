import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { HackathonService } from 'src/app/services/hackathon.service';
import { EditarUsuarioComponent } from '../editar-usuario/editar-usuario.component';
import { InserirUsuarioComponent } from '../inserir-usuario/inserir-usuario.component';

@Component({
  selector: 'app-area-usuario',
  templateUrl: './area-usuario.component.html',
  styleUrls: ['./area-usuario.component.css']
})
export class AreaUsuarioComponent implements OnInit {

  usuario: Usuario;
  data: any = [];
  profTables = [
    { nome : "Professores" },
    { nome : "Alunos" },
    { nome : "Cursos" },
    { nome : "Aulas" },
  ]
  professores: any;
  alunos: any;
  cursos: any;
  aulas: any;
  lista: any = [];
  tipoEdit = {
    'Professores': {
      tipo: 'professor',
      index: 0,
      function: this.hackathonService.getListaProfessor
    },
    'Alunos': {
      tipo: 'aluno',
      index: 1,
      function: this.hackathonService.getListaAluno
    },
    'Cursos': { 
      tipo: 'curso',
      index: 2,
      function: this.hackathonService.getListaCurso
    }, 
    'Aulas': {
      tipo: 'aula',
      index: 3,
      function: this.hackathonService.getListaAula
    }
  };

  constructor(private toastr: ToastrService, public dialog: MatDialog, private authService: AuthService, private router: Router, private hackathonService : HackathonService) { 
  }
  
  ngOnInit(): void {
    this.permissaoUsuario()
  }
  
  async permissaoUsuario() {
    this.usuario = this.authService.getUsuario();
    
    if(this.usuario.tipo === 2) {
      this.listarTablesAluno();
    }else {
      this.listarTodos()
    }
  }

  async listarTodos() {
    this.professores = await this.hackathonService.getListaProfessor(true)
    this.lista[0] = this.professores
    this.alunos = await this.hackathonService.getListaAluno(true)
    this.lista[1] = this.alunos
    this.cursos = await this.hackathonService.getListaCurso(true)
    this.lista[2] =this.cursos 
    this.aulas = await this.hackathonService.getListaAula(true)
    this.lista[3] = this.aulas
  }

  async listarTablesAluno() {
    const lista = []

    this.professores = await this.hackathonService.getListaProfessor(true)
    lista.push(this.professores)
    const idProfs = this.professores.map(i => i.id)
    this.cursos = await this.hackathonService.getListaCurso(true)
    this.cursos.forEach(i => i.professor = this.professores[idProfs.indexOf(i.idProfessor)])
    lista.push(this.cursos)

    this.cursos

    this.alunos = await this.hackathonService.obter(this.usuario.id, 'aluno').toPromise()
  }


  inserir(tipo): void {

    const dialogRef = this.dialog.open(InserirUsuarioComponent, {
      width: '500px',
      height: '500px',
      data: this.tipoEdit[tipo].tipo
    });

    dialogRef.afterClosed().subscribe(async (data) => {
      if(data)
        this.listarTodos()
    });
  }

  async editar(usuarioEdit, tipo) {

    if(tipo === 'Aulas') {
      usuarioEdit = { aulas: [usuarioEdit] }
    }

    if(this.tipoEdit[tipo]){
      const dialogRef = this.dialog.open(EditarUsuarioComponent, {
        width: '500px',
        height: '500px',
        data: {
          usuario: usuarioEdit,
          rota: this.tipoEdit[tipo].tipo,
          permissao: this.usuario
        }
      })

      dialogRef.afterClosed().subscribe(async (data) => {
        if(data)
          this.listarTodos()
      })
    }
  }

  async excluir(id, tipo, idCurso){
    try{ 

      if(this.tipoEdit[tipo]){
        
        let data;
        if(this.tipoEdit[tipo].tipo === 'aula') {
          data = await this.hackathonService.excluirAula(id, this.tipoEdit[tipo].tipo, idCurso).toPromise();
        } else {
          data = await this.hackathonService.excluir(id, this.tipoEdit[tipo].tipo).toPromise();
        }
        this.toastr.success(data.mensagem)

        this.listarTodos()
      }

''    } catch(err) {
      this.toastr.error(err.error.message);
    }
  }

  async getLista(tipo) {
    let listaUsuario = [];

    if(tipo == 'Professores') {
      listaUsuario = await this.hackathonService.getListaProfessor(true)
    } else if(tipo == 'Cursos') {
      listaUsuario = await this.hackathonService.getListaCurso(true)
    } else if(tipo == 'Alunos') {
      listaUsuario = await this.hackathonService.getListaAluno(true)
    } else {
      listaUsuario = await this.hackathonService.getListaAula(true)
    }

    return listaUsuario
  }

  async matricularAluno(curso) {
    try {
      let matriculaUsuario: any = await this.hackathonService.matricularAluno(curso.id)
      curso.matriculado = matriculaUsuario.data.matriculado
      this.toastr.success(matriculaUsuario.mensagem)
      
    } catch (error) {
      console.log(error)
    }
  }

  atribuirNotaCurso(cursoId, evento) {
    this.hackathonService.atribuirNota(cursoId, evento)
  }

}
