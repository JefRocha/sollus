/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [VENDA_CONDICOES_PAGAMENTO] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { VendaCondicoesParcelas, Empresa } from '../../entities-export';

@Entity()
export class VendaCondicoesPagamento {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nome: string;

	@Column()
	descricao: string;

	@Column()
	faturamentoMinimo: number;

	@Column()
	faturamentoMaximo: number;

	@Column()
	indiceCorrecao: number;

	@Column()
	diasTolerancia: number;

	@Column()
	valorTolerancia: number;

	@Column()
	prazoMedio: number;

	@Column()
	vistaPrazo: string;


	/**
	* Relations
	*/
	@ManyToOne(() => Empresa)
	@JoinColumn()
	empresa: Empresa;

	@OneToMany(() => VendaCondicoesParcelas, vendaCondicoesParcelas => vendaCondicoesParcelas.vendaCondicoesPagamento, { cascade: true })
	listaVendaCondicoesParcelas: VendaCondicoesParcelas[];


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.nome = objetoJson['nome'];
			this.descricao = objetoJson['descricao'];
			this.faturamentoMinimo = objetoJson['faturamentoMinimo'];
			this.faturamentoMaximo = objetoJson['faturamentoMaximo'];
			this.indiceCorrecao = objetoJson['indiceCorrecao'];
			this.diasTolerancia = objetoJson['diasTolerancia'];
			this.valorTolerancia = objetoJson['valorTolerancia'];
			this.prazoMedio = objetoJson['prazoMedio'];
			this.vistaPrazo = objetoJson['vistaPrazo'];


			this.listaVendaCondicoesParcelas = [];
			let listaVendaCondicoesParcelasJson = objetoJson['listaVendaCondicoesParcelas'];
			if (listaVendaCondicoesParcelasJson != null) {
				for (let i = 0; i < listaVendaCondicoesParcelasJson.length; i++) {
					let objeto = new VendaCondicoesParcelas(listaVendaCondicoesParcelasJson[i]);
					this.listaVendaCondicoesParcelas.push(objeto);
				}
			}

		}
	}
}