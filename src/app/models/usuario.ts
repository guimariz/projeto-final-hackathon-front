import { Aluno } from "./aluno";
import { Professor } from "./professor";

export interface Usuario {
  email?: string;
  senha?: string;
  nome?: string;
  tipo?: number;
  professor?: Professor;
  aluno?: Aluno;
}
