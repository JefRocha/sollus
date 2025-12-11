/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [FIN_LANCAMENTO_PAGAR] 
																			    
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
import { FinParcelaPagar, Empresa } from '../../entities-export';
import { FinDocumentoOrigem } from '../../entities-export';
import { FinNaturezaFinanceira } from '../../entities-export';
import { Fornecedor } from '../../entities-export';
import { BancoContaCaixa } from '../../entities-export';

@Entity()
export class FinLancamentoPagar {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	quantidadeParcela: number;

	@Column()
	valorAPagar: number;

	@Column()
	dataLancamento: Date;

	@Column()
	numeroDocumento: string;

	@Column()
	imagemDocumento: string;

	@Column()
	primeiroVencimento: Date;

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

	@OneToOne(() => Fornecedor)
	@JoinColumn()
	fornecedor: Fornecedor;

	@OneToOne(() => BancoContaCaixa)
	@JoinColumn()
	bancoContaCaixa: BancoContaCaixa;

	@OneToMany(() => FinParcelaPagar, finParcelaPagar => finParcelaPagar.finLancamentoPagar, { cascade: true })
	listaFinParcelaPagar: FinParcelaPagar[];


	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.quantidadeParcela = objetoJson['quantidadeParcela'];
			this.valorAPagar = objetoJson['valorAPagar'];
			this.dataLancamento = objetoJson['dataLancamento'];
			this.numeroDocumento = objetoJson['numeroDocumento'];
			this.imagemDocumento = objetoJson['imagemDocumento'];
			this.primeiroVencimento = objetoJson['primeiroVencimento'];
			this.intervaloEntreParcelas = objetoJson['intervaloEntreParcelas'];
			this.diaFixo = objetoJson['diaFixo'];

			if (objetoJson['finDocumentoOrigem'] != null) {
				this.finDocumentoOrigem = new FinDocumentoOrigem(objetoJson['finDocumentoOrigem']);
			}

			if (objetoJson['finNaturezaFinanceira'] != null) {
				this.finNaturezaFinanceira = new FinNaturezaFinanceira(objetoJson['finNaturezaFinanceira']);
			}

			if (objetoJson['fornecedor'] != null) {
				this.fornecedor = new Fornecedor(objetoJson['fornecedor']);
			}

			if (objetoJson['bancoContaCaixa'] != null) {
				this.bancoContaCaixa = new BancoContaCaixa(objetoJson['bancoContaCaixa']);
			}


			this.listaFinParcelaPagar = [];
			let listaFinParcelaPagarJson = objetoJson['listaFinParcelaPagar'];
			if (listaFinParcelaPagarJson != null) {
				for (let i = 0; i < listaFinParcelaPagarJson.length; i++) {
					let objeto = new FinParcelaPagar(listaFinParcelaPagarJson[i]);
					this.listaFinParcelaPagar.push(objeto);
				}
			}

		}
	}
}