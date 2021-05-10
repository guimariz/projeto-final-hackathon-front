import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HackathonService } from 'src/app/services/hackathon.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  listaUsuario: any = []
  listaCurso: any = []
  tipo: string;

  constructor(private route: ActivatedRoute,private hackathonService: HackathonService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tipo = params['tipo'];
      this.mostrarLista(this.tipo)
    });
  }


  async mostrarLista(tipo) {
    try {
        switch(tipo){
          case 'professores':
            this.listaUsuario = await this.hackathonService.listarTodosProf();
            break;
          case 'alunos':
            this.listaUsuario = await this.hackathonService.listarTodosAluno();
            break;
          case 'cursos':
            this.listaUsuario = await this.hackathonService.listarTodosCurso();
            break;
          case 'aulas':
            this.listaUsuario = await this.hackathonService.listarTodosAula();
            break;
          default:
            console.log('deu ruim');
        }
    } catch (error) {
      console.log
    }
  }

}
