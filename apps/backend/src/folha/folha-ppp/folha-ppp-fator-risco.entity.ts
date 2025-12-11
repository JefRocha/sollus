/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [FOLHA_PPP_FATOR_RISCO] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FolhaPpp } from '../../entities-export';

@Entity()
export class FolhaPppFatorRisco {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	dataInicio: Date;

	@Column()
	dataFim: Date;

	@Column()
	tipo: string;

	@Column()
	fatorRisco: string;

	@Column()
	intensidade: string;

	@Column()
	tecnicaUtilizada: string;

	@Column()
	epcEficaz: string;

	@Column()
	epiEficaz: string;

	@Column()
	caEpi: number;

	@Column()
	atendimentoNr061: string;

	@Column()
	atendimentoNr062: string;

	@Column()
	atendimentoNr063: string;

	@Column()
	atendimentoNr064: string;

	@Column()
	atendimentoNr065: string;


	/**
	* Relations
	*/
	@ManyToOne(() => FolhaPpp, folhaPpp => folhaPpp.listaFolhaPppFatorRisco)
	@JoinColumn()
	folhaPpp: FolhaPpp;


	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.dataInicio = objetoJson['dataInicio'];
			this.dataFim = objetoJson['dataFim'];
			this.tipo = objetoJson['tipo'];
			this.fatorRisco = objetoJson['fatorRisco'];
			this.intensidade = objetoJson['intensidade'];
			this.tecnicaUtilizada = objetoJson['tecnicaUtilizada'];
			this.epcEficaz = objetoJson['epcEficaz'];
			this.epiEficaz = objetoJson['epiEficaz'];
			this.caEpi = objetoJson['caEpi'];
			this.atendimentoNr061 = objetoJson['atendimentoNr061'];
			this.atendimentoNr062 = objetoJson['atendimentoNr062'];
			this.atendimentoNr063 = objetoJson['atendimentoNr063'];
			this.atendimentoNr064 = objetoJson['atendimentoNr064'];
			this.atendimentoNr065 = objetoJson['atendimentoNr065'];


		}
	}
}