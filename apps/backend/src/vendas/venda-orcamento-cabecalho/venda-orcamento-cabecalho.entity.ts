/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [VENDA_ORCAMENTO_CABECALHO] 
																			    
The MIT License                                                                 
																			    
Copyright: Copyright (C) 2021 CS Solutions.COM                                          
																			    
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
import { VendaOrcamentoDetalhe } from '../../entities-export';
import { VendaCondicoesPagamento } from '../../entities-export';
import { Vendedor } from '../../entities-export';
import { Cliente } from '../../entities-export';
import { Transportadora, Empresa } from '../../entities-export';

@Entity()
export class VendaOrcamentoCabecalho {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	codigo: string;

	@Column()
	dataCadastro: Date;

	@Column()
	dataEntrega: Date;

	@Column()
	validade: Date;

	@Column()
	tipoFrete: string;

	@Column()
	valorSubtotal: number;

	@Column()
	valorFrete: number;

	@Column()
	taxaComissao: number;

	@Column()
	valorComissao: number;

	@Column()
	taxaDesconto: number;

	@Column()
	valorDesconto: number;

	@Column()
	valorTotal: number;

	@Column()
	observacao: string;


	/**
	* Relations
	*/
	@ManyToOne(() => Empresa)
	@JoinColumn()
	empresa: Empresa;

	@OneToOne(() => VendaCondicoesPagamento)
	@JoinColumn()
	vendaCondicoesPagamento: VendaCondicoesPagamento;

	@OneToOne(() => Vendedor)
	@JoinColumn()
	vendedor: Vendedor;

	@OneToOne(() => Cliente)
	@JoinColumn()
	cliente: Cliente;

	@OneToOne(() => Transportadora)
	@JoinColumn()
	transportadora: Transportadora;

	@OneToMany(() => VendaOrcamentoDetalhe, vendaOrcamentoDetalhe => vendaOrcamentoDetalhe.vendaOrcamentoCabecalho, { cascade: true })
	listaVendaOrcamentoDetalhe: VendaOrcamentoDetalhe[];


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.codigo = objetoJson['codigo'];
			this.dataCadastro = objetoJson['dataCadastro'];
			this.dataEntrega = objetoJson['dataEntrega'];
			this.validade = objetoJson['validade'];
			this.tipoFrete = objetoJson['tipoFrete'];
			this.valorSubtotal = objetoJson['valorSubtotal'];
			this.valorFrete = objetoJson['valorFrete'];
			this.taxaComissao = objetoJson['taxaComissao'];
			this.valorComissao = objetoJson['valorComissao'];
			this.taxaDesconto = objetoJson['taxaDesconto'];
			this.valorDesconto = objetoJson['valorDesconto'];
			this.valorTotal = objetoJson['valorTotal'];
			this.observacao = objetoJson['observacao'];

			if (objetoJson['vendaCondicoesPagamento'] != null) {
				this.vendaCondicoesPagamento = new VendaCondicoesPagamento(objetoJson['vendaCondicoesPagamento']);
			}

			if (objetoJson['vendedor'] != null) {
				this.vendedor = new Vendedor(objetoJson['vendedor']);
			}

			if (objetoJson['cliente'] != null) {
				this.cliente = new Cliente(objetoJson['cliente']);
			}

			if (objetoJson['transportadora'] != null) {
				this.transportadora = new Transportadora(objetoJson['transportadora']);
			}


			this.listaVendaOrcamentoDetalhe = [];
			let listaVendaOrcamentoDetalheJson = objetoJson['listaVendaOrcamentoDetalhe'];
			if (listaVendaOrcamentoDetalheJson != null) {
				for (let i = 0; i < listaVendaOrcamentoDetalheJson.length; i++) {
					let objeto = new VendaOrcamentoDetalhe(listaVendaOrcamentoDetalheJson[i]);
					this.listaVendaOrcamentoDetalhe.push(objeto);
				}
			}

		}
	}
}