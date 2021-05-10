import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';
import { HomeComponent } from './pages/private/home/home.component';
import { AreaUsuarioComponent } from './pages/private/usuario/area-usuario/area-usuario.component';
import { ListarComponent } from './pages/private/usuario/listar/listar.component';
import { CadastroComponent } from './pages/public/cadastro/cadastro.component';
import { LoginComponent } from './pages/public/login/login.component';
import { PaginaNaoEncontradaComponent } from './pages/public/pagina-nao-encontrada/pagina-nao-encontrada.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: HomeComponent,
  },
  {
    path: 'nova-conta',
    component: CadastroComponent,
  },
  {
    path: 'area-usuario',
    component: AreaUsuarioComponent,
  },
  {
    path: 'listar/:tipo',
    component: ListarComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    component: PaginaNaoEncontradaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
