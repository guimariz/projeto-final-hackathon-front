import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { HackathonService } from 'src/app/services/hackathon.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  isAluno: boolean = false;
  

  cadastroForm: FormGroup;

  constructor(private hackathonService: HackathonService, private toastr: ToastrService, private router: Router, private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.iniciarForm()
  }

  recebeUsuario(event) {
    if(event == 'Aluno') {
      this.isAluno = true;
    } else {
      this.isAluno = false;
    }
  }

  iniciarForm() {
    this.cadastroForm = this.formBuilder.group({
      email: [null, Validators.required],
      senha: [null, Validators.required],
      nome: [null, Validators.required],
      tipo: [null, Validators.required],
      idade: [null, Validators.required],
      formacao: [null, Validators.required],
    });
  }

  async cadastrar() {
    try{
      let usuario = this.cadastroForm.value;
      let novoUsuario;
      if(usuario.tipo === 'Professor') {
        novoUsuario = await this.hackathonService.incluir(usuario, 'professor').toPromise();
      } else if (usuario.tipo === 'Aluno') {
        novoUsuario = await this.hackathonService.incluir(usuario, 'aluno').toPromise();
      }
      this.toastr.success(novoUsuario.mensagem)
      this.router.navigate(['']);
    } catch(err) {
      this.toastr.error(err.error.message);
    }
  }

}
