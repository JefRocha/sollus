/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [FERIAS_PERIODO_AQUISITIVO] 
																			    
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
export class FeriasPeriodoAquisitivo {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idColaborador: number;

	@Column()
	dataInicio: Date;

	@Column()
	dataFim: Date;

	@Column()
	situacao: string;

	@Column()
	limiteParaGozo: Date;

	@Column()
	descontarFaltas: string;

	@Column()
	desconsiderarAfastamento: string;

	@Column()
	afastamentoPrevidencia: number;

	@Column()
	afastamentoSemRemun: number;

	@Column()
	afastamentoComRemun: number;

	@Column()
	diasDireito: number;

	@Column()
	diasGozados: number;

	@Column()
	diasFaltas: number;

	@Column()
	diasRestantes: number;


	/**
	* Relations
	*/

	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.idColaborador = objetoJson['idColaborador'];
			this.dataInicio = objetoJson['dataInicio'];
			this.dataFim = objetoJson['dataFim'];
			this.situacao = objetoJson['situacao'];
			this.limiteParaGozo = objetoJson['limiteParaGozo'];
			this.descontarFaltas = objetoJson['descontarFaltas'];
			this.desconsiderarAfastamento = objetoJson['desconsiderarAfastamento'];
			this.afastamentoPrevidencia = objetoJson['afastamentoPrevidencia'];
			this.afastamentoSemRemun = objetoJson['afastamentoSemRemun'];
			this.afastamentoComRemun = objetoJson['afastamentoComRemun'];
			this.diasDireito = objetoJson['diasDireito'];
			this.diasGozados = objetoJson['diasGozados'];
			this.diasFaltas = objetoJson['diasFaltas'];
			this.diasRestantes = objetoJson['diasRestantes'];


		}
	}
}