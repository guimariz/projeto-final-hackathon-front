import { Aula } from "./aula";

export interface Curso {
  nome: string;
  descricao: string;
  idProfessor?: number;
  aulas?: Aula[];

}
