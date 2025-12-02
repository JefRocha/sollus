/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [VENDA_CABECALHO] 
																			    
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
import { VendaComissao, Empresa } from '../../entities-export';
import { VendaDetalhe } from '../../entities-export';
import { VendaOrcamentoCabecalho } from '../../entities-export';
import { VendaCondicoesPagamento } from '../../entities-export';
import { NotaFiscalTipo } from '../../entities-export';
import { Cliente } from '../../entities-export';
import { Transportadora } from '../../entities-export';
import { Vendedor } from '../../entities-export';

@Entity()
export class VendaCabecalho {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	dataVenda: Date;

	@Column()
	dataSaida: Date;

	@Column()
	horaSaida: string;

	@Column()
	numeroFatura: number;

	@Column()
	localEntrega: string;

	@Column()
	localCobranca: string;

	@Column()
	valorSubtotal: number;

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
	tipoFrete: string;

	@Column()
	formaPagamento: string;

	@Column()
	valorFrete: number;

	@Column()
	valorSeguro: number;

	@Column()
	observacao: string;

	@Column()
	situacao: string;

	@Column()
	diaFixoParcela: string;


	/**
	* Relations
	*/
	@ManyToOne(() => Empresa)
	@JoinColumn()
	empresa: Empresa;

	@OneToOne(() => VendaOrcamentoCabecalho)
	@JoinColumn()
	vendaOrcamentoCabecalho: VendaOrcamentoCabecalho;

	@OneToOne(() => VendaCondicoesPagamento)
	@JoinColumn()
	vendaCondicoesPagamento: VendaCondicoesPagamento;

	@OneToOne(() => NotaFiscalTipo)
	@JoinColumn()
	notaFiscalTipo: NotaFiscalTipo;

	@OneToOne(() => Cliente)
	@JoinColumn()
	cliente: Cliente;

	@OneToOne(() => Transportadora)
	@JoinColumn()
	transportadora: Transportadora;

	@OneToOne(() => Vendedor)
	@JoinColumn()
	vendedor: Vendedor;

	@OneToMany(() => VendaComissao, vendaComissao => vendaComissao.vendaCabecalho, { cascade: true })
	listaVendaComissao: VendaComissao[];

	@OneToMany(() => VendaDetalhe, vendaDetalhe => vendaDetalhe.vendaCabecalho, { cascade: true })
	listaVendaDetalhe: VendaDetalhe[];


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.dataVenda = objetoJson['dataVenda'];
			this.dataSaida = objetoJson['dataSaida'];
			this.horaSaida = objetoJson['horaSaida'];
			this.numeroFatura = objetoJson['numeroFatura'];
			this.localEntrega = objetoJson['localEntrega'];
			this.localCobranca = objetoJson['localCobranca'];
			this.valorSubtotal = objetoJson['valorSubtotal'];
			this.taxaComissao = objetoJson['taxaComissao'];
			this.valorComissao = objetoJson['valorComissao'];
			this.taxaDesconto = objetoJson['taxaDesconto'];
			this.valorDesconto = objetoJson['valorDesconto'];
			this.valorTotal = objetoJson['valorTotal'];
			this.tipoFrete = objetoJson['tipoFrete'];
			this.formaPagamento = objetoJson['formaPagamento'];
			this.valorFrete = objetoJson['valorFrete'];
			this.valorSeguro = objetoJson['valorSeguro'];
			this.observacao = objetoJson['observacao'];
			this.situacao = objetoJson['situacao'];
			this.diaFixoParcela = objetoJson['diaFixoParcela'];

			if (objetoJson['vendaOrcamentoCabecalho'] != null) {
				this.vendaOrcamentoCabecalho = new VendaOrcamentoCabecalho(objetoJson['vendaOrcamentoCabecalho']);
			}

			if (objetoJson['vendaCondicoesPagamento'] != null) {
				this.vendaCondicoesPagamento = new VendaCondicoesPagamento(objetoJson['vendaCondicoesPagamento']);
			}

			if (objetoJson['notaFiscalTipo'] != null) {
				this.notaFiscalTipo = new NotaFiscalTipo(objetoJson['notaFiscalTipo']);
			}

			if (objetoJson['cliente'] != null) {
				this.cliente = new Cliente(objetoJson['cliente']);
			}

			if (objetoJson['transportadora'] != null) {
				this.transportadora = new Transportadora(objetoJson['transportadora']);
			}

			if (objetoJson['vendedor'] != null) {
				this.vendedor = new Vendedor(objetoJson['vendedor']);
			}


			this.listaVendaComissao = [];
			let listaVendaComissaoJson = objetoJson['listaVendaComissao'];
			if (listaVendaComissaoJson != null) {
				for (let i = 0; i < listaVendaComissaoJson.length; i++) {
					let objeto = new VendaComissao(listaVendaComissaoJson[i]);
					this.listaVendaComissao.push(objeto);
				}
			}

			this.listaVendaDetalhe = [];
			let listaVendaDetalheJson = objetoJson['listaVendaDetalhe'];
			if (listaVendaDetalheJson != null) {
				for (let i = 0; i < listaVendaDetalheJson.length; i++) {
					let objeto = new VendaDetalhe(listaVendaDetalheJson[i]);
					this.listaVendaDetalhe.push(objeto);
				}
			}

		}
	}
}