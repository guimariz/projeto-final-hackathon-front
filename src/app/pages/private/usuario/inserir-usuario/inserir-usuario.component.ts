import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HackathonService } from 'src/app/services/hackathon.service';

@Component({
  selector: 'app-inserir-usuario',
  templateUrl: './inserir-usuario.component.html',
  styleUrls: ['./inserir-usuario.component.css']
})
export class InserirUsuarioComponent implements OnInit {
  closeResult = '';
  cadastroForm: FormGroup;
  isAula: boolean = false;
  listaProfessores : any = [];
  listaCursos : any = [];
  idProfessor: number;
  idCurso: number;
  
  constructor(private toastr: ToastrService, private router: Router, private hackathonService: HackathonService, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<InserirUsuarioComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.receberTipo();
    this.iniciarForm();
    this.listarTodos()
  }

  cancelarDialog(): void {
    this.dialogRef.close();
  }

  async listarTodos() {

    this.listaProfessores = await this.hackathonService.getListaProfessor()
    this.listaCursos = await this.hackathonService.getListaCurso()
  }

  iniciarForm() {
    if(this.isAula) {
      this.cadastroForm = this.formBuilder.group({
        nome: [null, Validators.required],
        duracao: [null, Validators.required],
        idCurso: [null, Validators.required],
        topicos: [null, Validators.required],
      })
    } else {
      this.cadastroForm = this.formBuilder.group({
        nome: [null, Validators.required],
        descricao: [null, Validators.required],
        idProfessor: [null, Validators.required],
        aulas: this.formBuilder.array([
          this.formBuilder.group({
            nome: [null, Validators.required],
            duracao: [null, Validators.required],
            idCurso: [null, Validators.required],
            topicos: [null, Validators.required],
          })
        ])
      })
    }
  }

  recebeId(event, tipo) {
    
    event = event.split(' ');
    const id = event[0]


    if(tipo === 'prof') {
      this.idProfessor = Number(id);
    } else {
      this.idCurso = Number(id)
    }
  }

  async cadastrar() {
    try{
      let data = this.cadastroForm.value;
      data.idProfessor = this.idProfessor;
      
      let novoCurso;
      if(this.isAula) {
        data.idCurso = this.idCurso;
        novoCurso = await this.hackathonService.incluir(data, 'aula').toPromise();
        this.toastr.success(novoCurso.mensagem)
      } else {
        const aula = data.aulas[0];
        data.aulas = [];
        novoCurso = await this.hackathonService.incluir(data, 'curso').toPromise();
        aula.idCurso = novoCurso.data.id
        const novaAula = await this.hackathonService.incluir(aula, 'aula').toPromise();
        this.toastr.success(novoCurso.mensagem)
      }
      this.router.navigateByUrl('/area-usuario');
      this.dialogRef.close(true);
    } catch(err) {
      this.toastr.error(err.error.message);
    }
  }

  receberTipo() {
    this.isAula = this.data === 'aula'
  }

}
