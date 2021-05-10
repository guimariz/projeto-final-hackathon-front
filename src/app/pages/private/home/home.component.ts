import { Component, OnInit } from '@angular/core';
import { HackathonService } from 'src/app/services/hackathon.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  professores: any = [];
  alunos: any = [];

  constructor(private hackathonService : HackathonService) { 
  }
  
  ngOnInit(): void {
    this.listarTodos();
  }
  
  async listarTodos() {
    try{
      this.professores = await this.hackathonService.listarTodosProf();
      this.alunos = await this.hackathonService.listarTodosAluno();
    } catch(err) {
      console.log(err)
    }
  }


}
