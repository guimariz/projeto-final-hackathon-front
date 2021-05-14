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

  aluno: any;
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

  constructor(private toastr: ToastrService, public dialog: MatDialog, private authService: AuthService, private router: Router, private hackathonService : HackathonService) { 
  }
  
  ngOnInit(): void {
    this.permissaoUsuario()
    this.listarTodos()
  }
  
  async permissaoUsuario() {
    this.usuario = this.authService.getUsuario();
    console.log(this.usuario)
    
    await this.pegarMatriculas();
    if(this.usuario.tipo === 2) {
      this.listarTablesAluno();
    }
  }

  async listarTodos() {
    this.professores = await this.hackathonService.getListaProfessor(true)
    this.lista.push(this.professores)
    this.alunos = await this.hackathonService.getListaAluno(true)
    this.lista.push(this.alunos);
    this.cursos = await this.hackathonService.getListaCurso(true)
    this.lista.push(this.cursos)
    this.aulas = await this.hackathonService.getListaAula(true)
    this.lista.push(this.aulas);
    console.log(this.lista)
  }

  async listarTablesAluno() {
    const lista = []

    this.professores = await this.hackathonService.listarTodos('professor')
    lista.push(this.professores)
    this.cursos = (await this.hackathonService.listarTodos('curso'))
    lista.push(this.cursos)

    this.alunos = await this.hackathonService.obter(this.aluno.id, 'aluno').toPromise()
  }


  inserir(info): void {

    const dialogRef = this.dialog.open(InserirUsuarioComponent, {
      width: '500px',
      height: '500px',
      data: info
    });

    dialogRef.afterClosed().subscribe();
  }

  async editar(id, tipo) {

    const x = {
      'Professores': 'professor',
      'Alunos': 'aluno',
      'Cursos': 'curso',
      'Aulas': 'aula'
    };

    if(x[tipo]){
      let usuario = await this.hackathonService.obter(id, x[tipo]).toPromise();
      const dialogRef = this.dialog.open(EditarUsuarioComponent, {
        width: '500px',
        height: '500px',
        data: {
          usuario,
          rota: x[tipo],
          permissao: this.usuario
        }
      })

      dialogRef.afterClosed().subscribe
    }
  }


  async excluir(id, tipo, idCurso){
    try{ 
      const x = {
        'Professores': 'professor',
        'Alunos': 'aluno',
        'Cursos': 'curso',
        'Aulas': 'aula'
      }

      if(x[tipo]){
        
        let data;
        if(x[tipo] === 'aula') {
          data = await this.hackathonService.excluirAula(id, x[tipo], idCurso).toPromise();
        } else {
          data = await this.hackathonService.excluir(id, x[tipo]).toPromise();
        }
        this.toastr.success(data.mensagem)
      }

''    } catch(err) {
      this.toastr.error(err.error.message);
    }
  }

  async pegarMatriculas() {
    this.aluno = await this.hackathonService.obterAluno(this.usuario.nome).toPromise()
    console.log(this.aluno)
  }

  async matricularAluno(curso) {
    try {
      let matriculaUsuario: any = await this.hackathonService.matricularAluno(this.aluno.id, curso.id)
      curso.matriculado = matriculaUsuario.data.matriculado
      this.toastr.success(matriculaUsuario.mensagem)
    } catch (error) {
      console.log(error)
    }
  }

  getNotaCurso(cursoId, evento) {
    this.hackathonService.atribuirNota(cursoId, evento, this.aluno.id, this.usuario.tipo)
  }

}
