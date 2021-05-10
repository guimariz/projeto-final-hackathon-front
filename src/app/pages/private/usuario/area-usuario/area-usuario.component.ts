import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-area-usuario',
  templateUrl: './area-usuario.component.html',
  styleUrls: ['./area-usuario.component.css']
})
export class AreaUsuarioComponent implements OnInit {

  usuario: any = [];
  professores: any = [];
  profTables: any = [];
  alunoTables: any = [];

  constructor() { }

  ngOnInit(): void {
  }

}
