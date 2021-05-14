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
        listaUsuario: this.hackathonService.getListaProfessor,
      },
      'alunos' : {
        listaNome: 'Alunos',
        listaCurso: [],
        listaUsuario: this.hackathonService.getListaAluno,
      },
      'cursos' : {
        listaNome: 'Cursos',
        listaCurso: [],
        listaUsuario: this.hackathonService.getListaCurso,
      },
      'aula' : {
        listaNome: 'Aulas',
        listaCurso: [],
        listaUsuario: this.hackathonService.getListaAula,
      }        
    }

    this.listaNome = obj[tipo].listaNome
    this.listaCurso = obj[tipo].listaCurso
    this.listaUsuario = await obj[tipo].listaUsuario()

    if(tipo !== 'aula') {
      for(let l of this.listaUsuario) {
        this.listaCurso.push(await this.hackathonService.listarCursosProf(l.id))
      }
    }
  }

}
