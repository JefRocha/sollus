/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [OS_ABERTURA] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { OsAberturaEquipamento } from '../../entities-export';
import { OsEvolucao } from '../../entities-export';
import { OsProdutoServico } from '../../entities-export';
import { OsStatus } from '../../entities-export';
import { Cliente } from '../../entities-export';
import { Colaborador } from '../../entities-export';
import { Empresa } from '../../entities-export';

@Entity()
export class OsAbertura {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	numero: string;

	@Column()
	dataInicio: Date;

	@Column()
	horaInicio: string;

	@Column()
	dataPrevisao: Date;

	@Column()
	horaPrevisao: string;

	@Column()
	dataFim: Date;

	@Column()
	horaFim: string;

	@Column()
	nomeContato: string;

	@Column()
	foneContato: string;

	@Column()
	observacaoCliente: string;

	@Column()
	observacaoAbertura: string;


	/**
	* Relations
	*/
	@OneToOne(() => OsStatus)
	@JoinColumn()
	osStatus: OsStatus;

	@OneToOne(() => Cliente)
	@JoinColumn()
	cliente: Cliente;

	@OneToOne(() => Colaborador)
	@JoinColumn()
	colaborador: Colaborador;

	@OneToMany(() => OsAberturaEquipamento, osAberturaEquipamento => osAberturaEquipamento.osAbertura, { cascade: true })
	listaOsAberturaEquipamento: OsAberturaEquipamento[];

	@OneToMany(() => OsEvolucao, osEvolucao => osEvolucao.osAbertura, { cascade: true })
	listaOsEvolucao: OsEvolucao[];

	@OneToMany(() => OsProdutoServico, osProdutoServico => osProdutoServico.osAbertura, { cascade: true })
	listaOsProdutoServico: OsProdutoServico[];

	@ManyToOne(() => Empresa)
	@JoinColumn()
	empresa: Empresa;


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.numero = objetoJson['numero'];
			this.dataInicio = objetoJson['dataInicio'];
			this.horaInicio = objetoJson['horaInicio'];
			this.dataPrevisao = objetoJson['dataPrevisao'];
			this.horaPrevisao = objetoJson['horaPrevisao'];
			this.dataFim = objetoJson['dataFim'];
			this.horaFim = objetoJson['horaFim'];
			this.nomeContato = objetoJson['nomeContato'];
			this.foneContato = objetoJson['foneContato'];
			this.observacaoCliente = objetoJson['observacaoCliente'];
			this.observacaoAbertura = objetoJson['observacaoAbertura'];

			if (objetoJson['osStatus'] != null) {
				this.osStatus = new OsStatus(objetoJson['osStatus']);
			}

			if (objetoJson['cliente'] != null) {
				this.cliente = new Cliente(objetoJson['cliente']);
			}

			if (objetoJson['colaborador'] != null) {
				this.colaborador = new Colaborador(objetoJson['colaborador']);
			}


			this.listaOsAberturaEquipamento = [];
			let listaOsAberturaEquipamentoJson = objetoJson['listaOsAberturaEquipamento'];
			if (listaOsAberturaEquipamentoJson != null) {
				for (let i = 0; i < listaOsAberturaEquipamentoJson.length; i++) {
					let objeto = new OsAberturaEquipamento(listaOsAberturaEquipamentoJson[i]);
					this.listaOsAberturaEquipamento.push(objeto);
				}
			}

			this.listaOsEvolucao = [];
			let listaOsEvolucaoJson = objetoJson['listaOsEvolucao'];
			if (listaOsEvolucaoJson != null) {
				for (let i = 0; i < listaOsEvolucaoJson.length; i++) {
					let objeto = new OsEvolucao(listaOsEvolucaoJson[i]);
					this.listaOsEvolucao.push(objeto);
				}
			}

			this.listaOsProdutoServico = [];
			let listaOsProdutoServicoJson = objetoJson['listaOsProdutoServico'];
			if (listaOsProdutoServicoJson != null) {
				for (let i = 0; i < listaOsProdutoServicoJson.length; i++) {
					let objeto = new OsProdutoServico(listaOsProdutoServicoJson[i]);
					this.listaOsProdutoServico.push(objeto);
				}
			}

		}
	}
}