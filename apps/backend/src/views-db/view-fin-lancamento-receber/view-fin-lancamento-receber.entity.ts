/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [VIEW_FIN_LANCAMENTO_RECEBER] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ViewFinLancamentoReceber {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idFinLancamentoReceber: number;

	@Column()
	quantidadeParcela: number;

	@Column()
	valorLancamento: number;

	@Column()
	dataLancamento: Date;

	@Column()
	numeroDocumento: string;

	@Column()
	idFinParcelaReceber: number;

	@Column()
	numeroParcela: number;

	@Column()
	dataVencimento: Date;

	@Column()
	dataRecebimento: Date;

	@Column()
	valorParcela: number;

	@Column()
	taxaJuro: number;

	@Column()
	valorJuro: number;

	@Column()
	taxaMulta: number;

	@Column()
	valorMulta: number;

	@Column()
	taxaDesconto: number;

	@Column()
	valorDesconto: number;

	@Column()
	siglaDocumento: string;

	@Column()
	nomeCliente: string;

	@Column()
	idFinStatusParcela: number;

	@Column()
	situacaoParcela: string;

	@Column()
	descricaoSituacaoParcela: string;

	@Column()
	idBancoContaCaixa: number;

	@Column()
	nomeContaCaixa: string;


	/**
	* Relations
	*/

	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.idFinLancamentoReceber = objetoJson['idFinLancamentoReceber'];
			this.quantidadeParcela = objetoJson['quantidadeParcela'];
			this.valorLancamento = objetoJson['valorLancamento'];
			this.dataLancamento = objetoJson['dataLancamento'];
			this.numeroDocumento = objetoJson['numeroDocumento'];
			this.idFinParcelaReceber = objetoJson['idFinParcelaReceber'];
			this.numeroParcela = objetoJson['numeroParcela'];
			this.dataVencimento = objetoJson['dataVencimento'];
			this.dataRecebimento = objetoJson['dataRecebimento'];
			this.valorParcela = objetoJson['valorParcela'];
			this.taxaJuro = objetoJson['taxaJuro'];
			this.valorJuro = objetoJson['valorJuro'];
			this.taxaMulta = objetoJson['taxaMulta'];
			this.valorMulta = objetoJson['valorMulta'];
			this.taxaDesconto = objetoJson['taxaDesconto'];
			this.valorDesconto = objetoJson['valorDesconto'];
			this.siglaDocumento = objetoJson['siglaDocumento'];
			this.nomeCliente = objetoJson['nomeCliente'];
			this.idFinStatusParcela = objetoJson['idFinStatusParcela'];
			this.situacaoParcela = objetoJson['situacaoParcela'];
			this.descricaoSituacaoParcela = objetoJson['descricaoSituacaoParcela'];
			this.idBancoContaCaixa = objetoJson['idBancoContaCaixa'];
			this.nomeContaCaixa = objetoJson['nomeContaCaixa'];


		}
	}
}