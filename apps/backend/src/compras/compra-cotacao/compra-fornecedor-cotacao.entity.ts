/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [COMPRA_FORNECEDOR_COTACAO] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { CompraCotacaoDetalhe } from '../../entities-export';
import { CompraCotacao } from '../../entities-export';
import { Fornecedor } from '../../entities-export';

@Entity()
export class CompraFornecedorCotacao {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	codigo: string;

	@Column()
	prazoEntrega: string;

	@Column()
	vendaCondicoesPagamento: string;

	@Column()
	valorSubtotal: number;

	@Column()
	taxaDesconto: number;

	@Column()
	valorDesconto: number;

	@Column()
	valorTotal: number;


	/**
	* Relations
	*/
	@OneToOne(() => Fornecedor)
	@JoinColumn()
	fornecedor: Fornecedor;

	@OneToMany(() => CompraCotacaoDetalhe, compraCotacaoDetalhe => compraCotacaoDetalhe.compraFornecedorCotacao, { cascade: true })
	listaCompraCotacaoDetalhe: CompraCotacaoDetalhe[];

	@ManyToOne(() => CompraCotacao, compraCotacao => compraCotacao.listaCompraFornecedorCotacao)
	@JoinColumn()
	compraCotacao: CompraCotacao;


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.codigo = objetoJson['codigo'];
			this.prazoEntrega = objetoJson['prazoEntrega'];
			this.vendaCondicoesPagamento = objetoJson['vendaCondicoesPagamento'];
			this.valorSubtotal = objetoJson['valorSubtotal'];
			this.taxaDesconto = objetoJson['taxaDesconto'];
			this.valorDesconto = objetoJson['valorDesconto'];
			this.valorTotal = objetoJson['valorTotal'];

			if (objetoJson['fornecedor'] != null) {
				this.fornecedor = new Fornecedor(objetoJson['fornecedor']);
			}


			this.listaCompraCotacaoDetalhe = [];
			let listaCompraCotacaoDetalheJson = objetoJson['listaCompraCotacaoDetalhe'];
			if (listaCompraCotacaoDetalheJson != null) {
				for (let i = 0; i < listaCompraCotacaoDetalheJson.length; i++) {
					let objeto = new CompraCotacaoDetalhe(listaCompraCotacaoDetalheJson[i]);
					this.listaCompraCotacaoDetalhe.push(objeto);
				}
			}

		}
	}
}