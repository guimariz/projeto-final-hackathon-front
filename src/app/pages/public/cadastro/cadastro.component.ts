import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
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

  get email(): FormControl {
    return this.cadastroForm.get('email') as FormControl;
  }
  get senha(): FormControl {
    return this.cadastroForm.get('pass') as FormControl;
  }
  get nome(): FormControl {
    return this.cadastroForm.get('nome') as FormControl;
  }
  get tipo(): FormControl {
    return this.cadastroForm.get('tipo') as FormControl;
  }
  get idade(): FormControl {
    return this.cadastroForm.get('idade') as FormControl;
  }
  get formacao(): FormControl {
    return this.cadastroForm.get('formacao') as FormControl;
  }

  iniciarForm() {
    this.cadastroForm = this.formBuilder.group({
      email: [null, Validators.required],
      senha: [null, Validators.required],
      nome: [null, Validators.required],
      tipo: [null, Validators.required],
      idade: [null],
      formacao: [null],
    });

  }

  async cadastrar() {
    try{
      let usuario = this.cadastroForm.value;
      let novoUsuario : any = await this.hackathonService.incluirUsuario(usuario).toPromise();
      this.toastr.success(novoUsuario.mensagem)
    } catch(err) {
      this.toastr.error(err.error.message);
    }
  }

}
