import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
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
  
  
  constructor(private formBuilder: FormBuilder, public hackathonService : HackathonService, private toastr: ToastrService, public dialogRef: MatDialogRef<EditarUsuarioComponent>, @Inject(MAT_DIALOG_DATA) public data) { 
    this.receberTipo();
  }
  
  ngOnInit(): void {
    this.iniciarForm() 
    
  }
  
  iniciarForm() {
    const edit = this.data.usuario


    this.cadastroForm = this.formBuilder.group({
      id: edit.id,
      senha: edit.senha,
      email: edit.email,
      nome: edit.nome,
      tipo: edit.tipo,
      idade: edit.idade,
      formacao: edit.formacao,
      descricao: edit.descricao,
      idProfessor: edit.idProfessor,
      aulas: this.formBuilder.array([
        this.formBuilder.group({
          nome: edit.nome,
          duracao: edit.duracao,
          idCurso: edit.idCurso,
          topicos: edit.topicos
        })
      ])
    });
  }

  async editar() {
    let usuario = this.cadastroForm.value;
      if(this.data.rota === 'professor' && this.data.permissao.email !== usuario.email) {
        this.toastr.error('Você não tem permissão para essa operação.')
        return  
      }
      let editUsuario : any = await this.hackathonService.alterar(usuario.id, usuario, this.data.rota).toPromise();
      this.toastr.success(editUsuario.mensagem)

      this.cancelarDialog()
  }

  cancelarDialog(): void {
    this.dialogRef.close();
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
        this.isAula = true;
        break;
      case 'aula':
        this.isAula = true;
      default:
        console.log('isso é só o começo'); 
      }
    this.data.rota 
  }

}
