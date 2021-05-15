import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HackathonService } from 'src/app/services/hackathon.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  listaNome: string;
  listaUsuario: any = []
  listaCurso: any = []
  tipo: string;
  isAula: boolean = false;

  constructor(private route: ActivatedRoute,private hackathonService: HackathonService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tipo = params['tipo'];
      this.mostrarLista(this.tipo)
    });
  }

  async mostrarLista(tipo) {
    
    const obj = {
      'professores' : {
        listaNome: 'Professores',
        listaCurso: [],
      },
      'alunos' : {
        listaNome: 'Alunos',
        listaCurso: [],
      },
      'cursos' : {
        listaNome: 'Cursos',
        listaCurso: [],
      },
      'aulas' : {
        listaNome: 'Aulas',
        listaCurso: [],
      }
    }

    this.listaNome = obj[tipo].listaNome
    this.listaCurso = obj[tipo].listaCurso

    if(tipo == 'professores') {
      this.listaUsuario = await this.hackathonService.getListaProfessor()
    } else if(tipo == 'cursos') {
      this.listaUsuario = await this.hackathonService.getListaCurso()
    } else if(tipo == 'alunos') {
      this.listaUsuario = await this.hackathonService.getListaAluno()
    } else {
      this.listaUsuario = await this.hackathonService.getListaAula()
    }
    
    
    if(tipo !== 'aula') {
      for(let l of this.listaUsuario) {
        this.listaCurso.push(await this.hackathonService.listarCursosProf(l.id))
      }
    }

  }

}
