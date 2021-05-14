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
    this.lista.push(this.professores)
    this.alunos = await this.hackathonService.getListaAluno(true)
    this.lista.push(this.alunos);
    this.cursos = await this.hackathonService.getListaCurso(true)
    this.lista.push(this.cursos)
    this.aulas = await this.hackathonService.getListaAula(true)
    this.lista.push(this.aulas);
  }

  async listarTablesAluno() {
    const lista = []

    this.professores = await this.hackathonService.listarTodos('professor')
    lista.push(this.professores)
    this.cursos = await this.hackathonService.getListaCurso(true)
    lista.push(this.cursos)

    this.alunos = await this.hackathonService.obter(this.usuario.id, 'aluno').toPromise()
  }


  inserir(info): void {

    const dialogRef = this.dialog.open(InserirUsuarioComponent, {
      width: '500px',
      height: '500px',
      data: info
    });

    dialogRef.afterClosed().subscribe();
  }

  async editar(usuarioEdit, tipo) {

    const tipoEdit = {
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

    if(tipoEdit[tipo]){
      const dialogRef = this.dialog.open(EditarUsuarioComponent, {
        width: '500px',
        height: '500px',
        data: {
          usuario: usuarioEdit,
          rota: tipoEdit[tipo].tipo,
          permissao: this.usuario
        }
      })

      dialogRef.afterClosed().subscribe(async (data) => {
        this.lista[tipoEdit[tipo].index] = await tipoEdit[tipo].function(true);
      })
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
