/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [FOLHA_PARAMETRO] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FolhaParametro {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	competencia: string;

	@Column()
	contribuiPis: string;

	@Column()
	aliquotaPis: number;

	@Column()
	discriminarDsr: string;

	@Column()
	diaPagamento: string;

	@Column()
	calculoProporcionalidade: string;

	@Column()
	descontarFaltas13: string;

	@Column()
	pagarAdicionais13: string;

	@Column()
	pagarEstagiarios13: string;

	@Column()
	mesAdiantamento13: string;

	@Column()
	percentualAdiantam13: number;

	@Column()
	feriasDescontarFaltas: string;

	@Column()
	feriasPagarAdicionais: string;

	@Column()
	feriasAdiantar13: string;

	@Column()
	feriasPagarEstagiarios: string;

	@Column()
	feriasCalcJustaCausa: string;

	@Column()
	feriasMovimentoMensal: string;


	/**
	* Relations
	*/

	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.competencia = objetoJson['competencia'];
			this.contribuiPis = objetoJson['contribuiPis'];
			this.aliquotaPis = objetoJson['aliquotaPis'];
			this.discriminarDsr = objetoJson['discriminarDsr'];
			this.diaPagamento = objetoJson['diaPagamento'];
			this.calculoProporcionalidade = objetoJson['calculoProporcionalidade'];
			this.descontarFaltas13 = objetoJson['descontarFaltas13'];
			this.pagarAdicionais13 = objetoJson['pagarAdicionais13'];
			this.pagarEstagiarios13 = objetoJson['pagarEstagiarios13'];
			this.mesAdiantamento13 = objetoJson['mesAdiantamento13'];
			this.percentualAdiantam13 = objetoJson['percentualAdiantam13'];
			this.feriasDescontarFaltas = objetoJson['feriasDescontarFaltas'];
			this.feriasPagarAdicionais = objetoJson['feriasPagarAdicionais'];
			this.feriasAdiantar13 = objetoJson['feriasAdiantar13'];
			this.feriasPagarEstagiarios = objetoJson['feriasPagarEstagiarios'];
			this.feriasCalcJustaCausa = objetoJson['feriasCalcJustaCausa'];
			this.feriasMovimentoMensal = objetoJson['feriasMovimentoMensal'];


		}
	}
}