import { Curso } from "./curso";

export interface Aluno{
  idade: number;
  formacao?: string;
  cursos?: Curso
}
