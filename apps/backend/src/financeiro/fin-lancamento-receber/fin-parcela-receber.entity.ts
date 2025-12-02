/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [FIN_PARCELA_RECEBER] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { FinLancamentoReceber } from '../../entities-export';
import { FinStatusParcela } from '../../entities-export';
import { FinTipoRecebimento } from '../../entities-export';
import { FinChequeRecebido } from '../../entities-export';

@Entity()
export class FinParcelaReceber {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	numeroParcela: number;

	@Column()
	dataEmissao: Date;

	@Column()
	dataVencimento: Date;

	@Column()
	descontoAte: Date;

	@Column()
	valor: number;

	@Column()
	taxaJuro: number;

	@Column()
	taxaMulta: number;

	@Column()
	taxaDesconto: number;

	@Column()
	valorJuro: number;

	@Column()
	valorMulta: number;

	@Column()
	valorDesconto: number;

	@Column()
	emitiuBoleto: string;

	@Column()
	boletoNossoNumero: string;

	@Column()
	valorRecebido: number;

	@Column()
	historico: string;


	/**
	* Relations
	*/
	@OneToOne(() => FinStatusParcela)
	@JoinColumn()
	finStatusParcela: FinStatusParcela;

	@OneToOne(() => FinTipoRecebimento)
	@JoinColumn()
	finTipoRecebimento: FinTipoRecebimento;

	@OneToOne(() => FinChequeRecebido)
	@JoinColumn()
	finChequeRecebido: FinChequeRecebido;

	@ManyToOne(() => FinLancamentoReceber, finLancamentoReceber => finLancamentoReceber.listaFinParcelaReceber)
	@JoinColumn()
	finLancamentoReceber: FinLancamentoReceber;


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.numeroParcela = objetoJson['numeroParcela'];
			this.dataEmissao = objetoJson['dataEmissao'];
			this.dataVencimento = objetoJson['dataVencimento'];
			this.descontoAte = objetoJson['descontoAte'];
			this.valor = objetoJson['valor'];
			this.taxaJuro = objetoJson['taxaJuro'];
			this.taxaMulta = objetoJson['taxaMulta'];
			this.taxaDesconto = objetoJson['taxaDesconto'];
			this.valorJuro = objetoJson['valorJuro'];
			this.valorMulta = objetoJson['valorMulta'];
			this.valorDesconto = objetoJson['valorDesconto'];
			this.emitiuBoleto = objetoJson['emitiuBoleto'];
			this.boletoNossoNumero = objetoJson['boletoNossoNumero'];
			this.valorRecebido = objetoJson['valorRecebido'];
			this.historico = objetoJson['historico'];

			if (objetoJson['finStatusParcela'] != null) {
				this.finStatusParcela = new FinStatusParcela(objetoJson['finStatusParcela']);
			}

			if (objetoJson['finTipoRecebimento'] != null) {
				this.finTipoRecebimento = new FinTipoRecebimento(objetoJson['finTipoRecebimento']);
			}

			if (objetoJson['finChequeRecebido'] != null) {
				this.finChequeRecebido = new FinChequeRecebido(objetoJson['finChequeRecebido']);
			}


		}
	}
}