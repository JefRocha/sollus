/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [PRODUTO] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { ProdutoSubgrupo, Empresa } from '../../entities-export';
import { ProdutoMarca } from '../../entities-export';
import { ProdutoUnidade } from '../../entities-export';
import { TributIcmsCustomCab } from '../../entities-export';
import { TributGrupoTributario } from '../../entities-export';

@Entity()
export class Produto {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nome: string;

	@Column()
	descricao: string;

	@Column()
	gtin: string;

	@Column()
	codigoInterno: string;

	@Column()
	valorCompra: number;

	@Column()
	valorVenda: number;

	@Column()
	codigoNcm: string;

	@Column()
	estoqueMinimo: number;

	@Column()
	estoqueMaximo: number;

	@Column()
	quantidadeEstoque: number;

	@Column()
	dataCadastro: Date;


	/**
	* Relations
	*/
	@ManyToOne(() => Empresa)
	@JoinColumn()
	empresa: Empresa;

	@OneToOne(() => ProdutoSubgrupo)
	@JoinColumn()
	produtoSubgrupo: ProdutoSubgrupo;

	@OneToOne(() => ProdutoMarca)
	@JoinColumn()
	produtoMarca: ProdutoMarca;

	@OneToOne(() => ProdutoUnidade)
	@JoinColumn()
	produtoUnidade: ProdutoUnidade;

	@OneToOne(() => TributIcmsCustomCab)
	@JoinColumn()
	tributIcmsCustomCab: TributIcmsCustomCab;

	@OneToOne(() => TributGrupoTributario)
	@JoinColumn()
	tributGrupoTributario: TributGrupoTributario;


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.nome = objetoJson['nome'];
			this.descricao = objetoJson['descricao'];
			this.gtin = objetoJson['gtin'];
			this.codigoInterno = objetoJson['codigoInterno'];
			this.valorCompra = objetoJson['valorCompra'];
			this.valorVenda = objetoJson['valorVenda'];
			this.codigoNcm = objetoJson['codigoNcm'];
			this.estoqueMinimo = objetoJson['estoqueMinimo'];
			this.estoqueMaximo = objetoJson['estoqueMaximo'];
			this.quantidadeEstoque = objetoJson['quantidadeEstoque'];
			this.dataCadastro = objetoJson['dataCadastro'];

			if (objetoJson['produtoSubgrupo'] != null) {
				this.produtoSubgrupo = new ProdutoSubgrupo(objetoJson['produtoSubgrupo']);
			}

			if (objetoJson['produtoMarca'] != null) {
				this.produtoMarca = new ProdutoMarca(objetoJson['produtoMarca']);
			}

			if (objetoJson['produtoUnidade'] != null) {
				this.produtoUnidade = new ProdutoUnidade(objetoJson['produtoUnidade']);
			}

			if (objetoJson['tributIcmsCustomCab'] != null) {
				this.tributIcmsCustomCab = new TributIcmsCustomCab(objetoJson['tributIcmsCustomCab']);
			}

			if (objetoJson['tributGrupoTributario'] != null) {
				this.tributGrupoTributario = new TributGrupoTributario(objetoJson['tributGrupoTributario']);
			}


		}
	}
}