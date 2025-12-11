/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [COLABORADOR] 
																			    
The MIT License                                                                 
																			    
Copyright: Copyright (C) 2020 CS Solutions.COM                                          
																			    
Permission is hereby granted, free of charge, to any person                     
obtaining a copy of this software and associated documentation                  
files (the "Software"), to deal in the Software without                         
restriction, including without limitation the rights to use,                    
copy, modify, merge, publish, distribute, sublicense, and/or sell               
copies of the Software, and to permit persons to whom the                       
Software is furnished to do so, subject to the following                        
conditions:                                                                     
																			    
The above copyright notice and this permission notice shall be                  
included in all copies or substantial portions of the Software.                 
																			    
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,                 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES                 
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND                        
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT                     
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,                    
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING                    
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR                   
OTHER DEALINGS IN THE SOFTWARE.                                                 
																			    
	   The author may be contacted at:                                          
		   CS Solutions.com@gmail.com                                                   
																			    
@author Albert Eije (alberteije@gmail.com)                    
@version 1.0.0
*******************************************************************************/
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Pessoa } from '../../entities-export';
import { Cargo } from '../../entities-export';
import { Setor } from '../../entities-export';
import { ColaboradorSituacao } from '../../entities-export';
import { TipoAdmissao } from '../../entities-export';
import { ColaboradorTipo } from '../../entities-export';
import { Sindicato } from '../../entities-export';

@Entity()
export class Colaborador {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	matricula: string;

	@Column()
	dataCadastro: Date;

	@Column()
	dataAdmissao: Date;

	@Column()
	dataDemissao: Date;

	@Column()
	ctpsNumero: string;

	@Column()
	ctpsSerie: string;

	@Column()
	ctpsDataExpedicao: Date;

	@Column()
	ctpsUf: string;

	@Column()
	observacao: string;


	/**
	* Relations
	*/
	@OneToOne(() => Pessoa, pessoa => pessoa.colaborador)
	@JoinColumn()
	pessoa: Pessoa;

	@OneToOne(() => Cargo)
	@JoinColumn()
	cargo: Cargo;

	@OneToOne(() => Setor)
	@JoinColumn()
	setor: Setor;

	@OneToOne(() => ColaboradorSituacao)
	@JoinColumn()
	colaboradorSituacao: ColaboradorSituacao;

	@OneToOne(() => TipoAdmissao)
	@JoinColumn()
	tipoAdmissao: TipoAdmissao;

	@OneToOne(() => ColaboradorTipo)
	@JoinColumn()
	colaboradorTipo: ColaboradorTipo;

	@OneToOne(() => Sindicato)
	@JoinColumn()
	sindicato: Sindicato;


	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.matricula = objetoJson['matricula'];
			this.dataCadastro = objetoJson['dataCadastro'];
			this.dataAdmissao = objetoJson['dataAdmissao'];
			this.dataDemissao = objetoJson['dataDemissao'];
			this.ctpsNumero = objetoJson['ctpsNumero'];
			this.ctpsSerie = objetoJson['ctpsSerie'];
			this.ctpsDataExpedicao = objetoJson['ctpsDataExpedicao'];
			this.ctpsUf = objetoJson['ctpsUf'];
			this.observacao = objetoJson['observacao'];

			if (objetoJson['cargo'] != null) {
				this.cargo = new Cargo(objetoJson['cargo']);
			}

			if (objetoJson['setor'] != null) {
				this.setor = new Setor(objetoJson['setor']);
			}

			if (objetoJson['colaboradorSituacao'] != null) {
				this.colaboradorSituacao = new ColaboradorSituacao(objetoJson['colaboradorSituacao']);
			}

			if (objetoJson['tipoAdmissao'] != null) {
				this.tipoAdmissao = new TipoAdmissao(objetoJson['tipoAdmissao']);
			}

			if (objetoJson['colaboradorTipo'] != null) {
				this.colaboradorTipo = new ColaboradorTipo(objetoJson['colaboradorTipo']);
			}

			if (objetoJson['sindicato'] != null) {
				this.sindicato = new Sindicato(objetoJson['sindicato']);
			}


		}
	}
}