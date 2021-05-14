import { Aula } from "./aula";
import { Nota } from "./nota";

export interface Curso {
  nome: string;
  descricao: string;
  idProfessor?: number;
  aulas?: Aula[];
  notas?: Nota[];
}
