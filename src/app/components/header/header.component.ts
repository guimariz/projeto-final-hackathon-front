import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { filter } from 'rxjs/operators';
import { EditarUsuarioComponent } from 'src/app/pages/private/usuario/editar-usuario/editar-usuario.component';
import { AuthService } from 'src/app/services/auth.service';
import { HackathonService } from 'src/app/services/hackathon.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;
  listaAtual: string;
  data: any = [];
  professores: any;
  alunos: any;
  cursos: any;
  aulas: any;
  listaTodos: any = [];

  constructor(public dialog: MatDialog, private authService: AuthService, private router: Router, private hackathonService : HackathonService) {
  }
  
  ngOnInit(): void {
    this.permissaoUsuario() 
  }
  
  async permissaoUsuario() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.usuario = this.authService.getUsuario();
    });

    if(this.usuario)
      this.listarTodos()
  }

  showHeader() {
    return this.authService.isAuthenticated();
  }

  showListHeader() {
    return this.router.url === '/listar/professores' || this.router.url === '/listar/alunos' || this.router.url === '/listar/cursos' || this.router.url === '/listar/aulas'  
  }
  
  async listarTodos() {
    this.professores = await this.hackathonService.getListaProfessor()
    this.listaTodos.push(this.professores)
    this.alunos = await this.hackathonService.getListaAluno()
    this.listaTodos.push(this.alunos);
    this.cursos = await this.hackathonService.getListaCurso()
    this.listaTodos.push(this.cursos)
    this.aulas = await this.hackathonService.getListaAula()
    this.listaTodos.push(this.aulas);
  }

  mostrarLista(tipo) {
    this.router.navigate([`/listar/${tipo}`])
  }

  
  async editarPerfil(tipo) {
    try{

      const x = {
        'professor': 'professor',
        'aluno': 'aluno',
      };

      if(x[tipo]){
        let usuario = await this.hackathonService.obter(this.usuario.id, x[tipo]).toPromise();
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
    }catch(err) {
      console.log(err)
    }
  }

  sair() {
    this.authService.logout();
  }

}
