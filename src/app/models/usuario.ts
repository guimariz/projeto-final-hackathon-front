import { Aluno } from "./aluno";
import { Professor } from "./professor";

export interface Usuario {
  id?: number;
  email?: string;
  senha?: string;
  nome?: string;
  tipo?: number;
  professor?: Professor;
  aluno?: Aluno;
}
