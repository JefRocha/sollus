/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [FIN_FECHAMENTO_CAIXA_BANCO] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { BancoContaCaixa } from '../../entities-export';

@Entity()
export class FinFechamentoCaixaBanco {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	dataFechamento: Date;

	@Column()
	mesAno: string;

	@Column()
	mes: string;

	@Column()
	ano: string;

	@Column()
	saldoAnterior: number;

	@Column()
	recebimentos: number;

	@Column()
	pagamentos: number;

	@Column()
	saldoConta: number;

	@Column()
	chequeNaoCompensado: number;

	@Column()
	saldoDisponivel: number;


	/**
	* Relations
	*/
	@OneToOne(() => BancoContaCaixa)
	@JoinColumn()
	bancoContaCaixa: BancoContaCaixa;


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.dataFechamento = objetoJson['dataFechamento'];
			this.mesAno = objetoJson['mesAno'];
			this.mes = objetoJson['mes'];
			this.ano = objetoJson['ano'];
			this.saldoAnterior = objetoJson['saldoAnterior'];
			this.recebimentos = objetoJson['recebimentos'];
			this.pagamentos = objetoJson['pagamentos'];
			this.saldoConta = objetoJson['saldoConta'];
			this.chequeNaoCompensado = objetoJson['chequeNaoCompensado'];
			this.saldoDisponivel = objetoJson['saldoDisponivel'];

			if (objetoJson['bancoContaCaixa'] != null) {
				this.bancoContaCaixa = new BancoContaCaixa(objetoJson['bancoContaCaixa']);
			}


		}
	}
}