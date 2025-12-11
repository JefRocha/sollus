/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [FIN_LANCAMENTO_RECEBER] 
																			    
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
import { FinParcelaReceber, Empresa } from '../../entities-export';
import { FinDocumentoOrigem } from '../../entities-export';
import { FinNaturezaFinanceira } from '../../entities-export';
import { Cliente } from '../../entities-export';
import { BancoContaCaixa } from '../../entities-export';

@Entity()
export class FinLancamentoReceber {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	quantidadeParcela: number;

	@Column()
	valorAReceber: number;

	@Column()
	dataLancamento: Date;

	@Column()
	numeroDocumento: string;

	@Column()
	primeiroVencimento: Date;

	@Column()
	taxaComissao: number;

	@Column()
	valorComissao: number;

	@Column()
	intervaloEntreParcelas: number;

	@Column()
	diaFixo: string;


	/**
	* Relations
	*/
	@ManyToOne(() => Empresa)
	@JoinColumn()
	empresa: Empresa;

	@OneToOne(() => FinDocumentoOrigem)
	@JoinColumn()
	finDocumentoOrigem: FinDocumentoOrigem;

	@OneToOne(() => FinNaturezaFinanceira)
	@JoinColumn()
	finNaturezaFinanceira: FinNaturezaFinanceira;

	@OneToOne(() => Cliente)
	@JoinColumn()
	cliente: Cliente;

	@OneToOne(() => BancoContaCaixa)
	@JoinColumn()
	bancoContaCaixa: BancoContaCaixa;

	@OneToMany(() => FinParcelaReceber, finParcelaReceber => finParcelaReceber.finLancamentoReceber, { cascade: true })
	listaFinParcelaReceber: FinParcelaReceber[];


	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.quantidadeParcela = objetoJson['quantidadeParcela'];
			this.valorAReceber = objetoJson['valorAReceber'];
			this.dataLancamento = objetoJson['dataLancamento'];
			this.numeroDocumento = objetoJson['numeroDocumento'];
			this.primeiroVencimento = objetoJson['primeiroVencimento'];
			this.taxaComissao = objetoJson['taxaComissao'];
			this.valorComissao = objetoJson['valorComissao'];
			this.intervaloEntreParcelas = objetoJson['intervaloEntreParcelas'];
			this.diaFixo = objetoJson['diaFixo'];

			if (objetoJson['finDocumentoOrigem'] != null) {
				this.finDocumentoOrigem = new FinDocumentoOrigem(objetoJson['finDocumentoOrigem']);
			}

			if (objetoJson['finNaturezaFinanceira'] != null) {
				this.finNaturezaFinanceira = new FinNaturezaFinanceira(objetoJson['finNaturezaFinanceira']);
			}

			if (objetoJson['cliente'] != null) {
				this.cliente = new Cliente(objetoJson['cliente']);
			}

			if (objetoJson['bancoContaCaixa'] != null) {
				this.bancoContaCaixa = new BancoContaCaixa(objetoJson['bancoContaCaixa']);
			}


			this.listaFinParcelaReceber = [];
			let listaFinParcelaReceberJson = objetoJson['listaFinParcelaReceber'];
			if (listaFinParcelaReceberJson != null) {
				for (let i = 0; i < listaFinParcelaReceberJson.length; i++) {
					let objeto = new FinParcelaReceber(listaFinParcelaReceberJson[i]);
					this.listaFinParcelaReceber.push(objeto);
				}
			}

		}
	}
}