/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [COMPRA_PEDIDO] 
																			    
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
import { CompraPedidoDetalhe, Empresa } from '../../entities-export';
import { CompraTipoPedido } from '../../entities-export';
import { Fornecedor } from '../../entities-export';
import { Colaborador } from '../../entities-export';

@Entity()
export class CompraPedido {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	dataPedido: Date;

	@Column()
	dataPrevistaEntrega: Date;

	@Column()
	dataPrevisaoPagamento: Date;

	@Column()
	localEntrega: string;

	@Column()
	localCobranca: string;

	@Column()
	contato: string;

	@Column()
	valorSubtotal: number;

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
	baseCalculoIcms: number;

	@Column()
	valorIcms: number;

	@Column()
	baseCalculoIcmsSt: number;

	@Column()
	valorIcmsSt: number;

	@Column()
	valorTotalProdutos: number;

	@Column()
	valorFrete: number;

	@Column()
	valorSeguro: number;

	@Column()
	valorOutrasDespesas: number;

	@Column()
	valorIpi: number;

	@Column()
	valorTotalNf: number;

	@Column()
	quantidadeParcelas: number;

	@Column()
	diaPrimeiroVencimento: string;

	@Column()
	intervaloEntreParcelas: number;

	@Column()
	diaFixoParcela: string;

	@Column()
	codigoCotacao: string;


	/**
	* Relations
	*/
	@ManyToOne(() => Empresa)
	@JoinColumn()
	empresa: Empresa;

	@OneToOne(() => CompraTipoPedido)
	@JoinColumn()
	compraTipoPedido: CompraTipoPedido;

	@OneToOne(() => Fornecedor)
	@JoinColumn()
	fornecedor: Fornecedor;

	@OneToOne(() => Colaborador)
	@JoinColumn()
	colaborador: Colaborador;

	@OneToMany(() => CompraPedidoDetalhe, compraPedidoDetalhe => compraPedidoDetalhe.compraPedido, { cascade: true })
	listaCompraPedidoDetalhe: CompraPedidoDetalhe[];


	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.dataPedido = objetoJson['dataPedido'];
			this.dataPrevistaEntrega = objetoJson['dataPrevistaEntrega'];
			this.dataPrevisaoPagamento = objetoJson['dataPrevisaoPagamento'];
			this.localEntrega = objetoJson['localEntrega'];
			this.localCobranca = objetoJson['localCobranca'];
			this.contato = objetoJson['contato'];
			this.valorSubtotal = objetoJson['valorSubtotal'];
			this.taxaDesconto = objetoJson['taxaDesconto'];
			this.valorDesconto = objetoJson['valorDesconto'];
			this.valorTotal = objetoJson['valorTotal'];
			this.tipoFrete = objetoJson['tipoFrete'];
			this.formaPagamento = objetoJson['formaPagamento'];
			this.baseCalculoIcms = objetoJson['baseCalculoIcms'];
			this.valorIcms = objetoJson['valorIcms'];
			this.baseCalculoIcmsSt = objetoJson['baseCalculoIcmsSt'];
			this.valorIcmsSt = objetoJson['valorIcmsSt'];
			this.valorTotalProdutos = objetoJson['valorTotalProdutos'];
			this.valorFrete = objetoJson['valorFrete'];
			this.valorSeguro = objetoJson['valorSeguro'];
			this.valorOutrasDespesas = objetoJson['valorOutrasDespesas'];
			this.valorIpi = objetoJson['valorIpi'];
			this.valorTotalNf = objetoJson['valorTotalNf'];
			this.quantidadeParcelas = objetoJson['quantidadeParcelas'];
			this.diaPrimeiroVencimento = objetoJson['diaPrimeiroVencimento'];
			this.intervaloEntreParcelas = objetoJson['intervaloEntreParcelas'];
			this.diaFixoParcela = objetoJson['diaFixoParcela'];
			this.codigoCotacao = objetoJson['codigoCotacao'];

			if (objetoJson['compraTipoPedido'] != null) {
				this.compraTipoPedido = new CompraTipoPedido(objetoJson['compraTipoPedido']);
			}

			if (objetoJson['fornecedor'] != null) {
				this.fornecedor = new Fornecedor(objetoJson['fornecedor']);
			}

			if (objetoJson['colaborador'] != null) {
				this.colaborador = new Colaborador(objetoJson['colaborador']);
			}


			this.listaCompraPedidoDetalhe = [];
			let listaCompraPedidoDetalheJson = objetoJson['listaCompraPedidoDetalhe'];
			if (listaCompraPedidoDetalheJson != null) {
				for (let i = 0; i < listaCompraPedidoDetalheJson.length; i++) {
					let objeto = new CompraPedidoDetalhe(listaCompraPedidoDetalheJson[i]);
					this.listaCompraPedidoDetalhe.push(objeto);
				}
			}

		}
	}
}