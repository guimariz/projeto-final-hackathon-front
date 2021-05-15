import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { HackathonService } from 'src/app/services/hackathon.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
  cadastroForm: FormGroup;
  rota: string;
  isProfessor: boolean = false;
  isAluno: boolean = false;
  isCurso: boolean = false;
  isAula: boolean = false;
  idProfessor: number;
  idCurso: number;
  listaProfessores: any = [];
  listaCursos : any = [];
  
  
  constructor(private authService : AuthService, private formBuilder: FormBuilder, public hackathonService : HackathonService, private toastr: ToastrService, public dialogRef: MatDialogRef<EditarUsuarioComponent>, @Inject(MAT_DIALOG_DATA) public data) { 
    this.receberTipo();
  }
  
  ngOnInit(): void {
    this.iniciarForm() 
    this.listaTodos();
    
  }

  async listaTodos() {
    this.listaProfessores = await this.hackathonService.getListaProfessor()
    this.listaCursos = await this.hackathonService.getListaCurso()
  }
  
  iniciarForm() {
    const edit = this.data.usuario

    edit.aulas = edit.aulas || [{nome: '', duracao: '', idCurso: '', topicos: ''}]

    this.cadastroForm = this.formBuilder.group({
      id: edit.id,
      senha: ['', Validators.required],
      email: edit.email,
      nome: [edit.nome,  Validators.required],
      tipo: edit.tipo,
      idade: edit.idade,
      formacao: edit.formacao,
      descricao: edit.descricao,
      idProfessor: edit.idProfessor,
      aulas: this.formBuilder.array( edit.aulas.map(i => {
        return this.formBuilder.group({
          id: i.id,
          nome: i.nome,
          duracao: i.duracao,
          idCurso: i.idCurso,
          topicos: i.topicos
        })
      })
      )
    });
  }

  async editar() {
    let usuario = this.cadastroForm.value;
      if(this.data.rota === 'professor' && this.data.permissao.email !== usuario.email) {
        this.toastr.error('Você não tem permissão para essa operação.')
        return 
      }
      
      let idCursoNovo;

      if(this.isAula) {
        usuario = usuario.aulas[0]
        
      }

      

      let editUsuario : any = await this.hackathonService.alterar(usuario.id, usuario, this.data.rota).toPromise();
      this.toastr.success(editUsuario.mensagem)

      if(this.data.permissao.email === usuario.email) {
        const { email, tipo, nome, id } = usuario;
        this.authService.setUsuario({ email, tipo, nome, id})
      }
      
      this.dialogRef.close(usuario);
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

  receberTipo() {
    
    switch(this.data.rota){
      case 'professor':
        this.isProfessor = true
        break;
      case 'aluno':
        this.isProfessor = true;
        this.isAluno = true;
        break;
      case 'curso':
        this.isCurso = true;
        break;
      case 'aula':
        this.isAula = true;
      default:
        console.log('isso é só o começo'); 
      }
    this.data.rota 
  }

}
