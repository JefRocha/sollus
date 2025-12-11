/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [CONTABIL_TERMO] 
																			    
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
export class ContabilTermo {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idContabilLivro: number;

	@Column()
	aberturaEncerramento: string;

	@Column()
	numero: number;

	@Column()
	paginaInicial: number;

	@Column()
	paginaFinal: number;

	@Column()
	registrado: string;

	@Column()
	numeroRegistro: string;

	@Column()
	dataDespacho: Date;

	@Column()
	dataAbertura: Date;

	@Column()
	dataEncerramento: Date;

	@Column()
	escrituracaoInicio: Date;

	@Column()
	escrituracaoFim: Date;

	@Column()
	texto: string;


	/**
	* Relations
	*/

	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.idContabilLivro = objetoJson['idContabilLivro'];
			this.aberturaEncerramento = objetoJson['aberturaEncerramento'];
			this.numero = objetoJson['numero'];
			this.paginaInicial = objetoJson['paginaInicial'];
			this.paginaFinal = objetoJson['paginaFinal'];
			this.registrado = objetoJson['registrado'];
			this.numeroRegistro = objetoJson['numeroRegistro'];
			this.dataDespacho = objetoJson['dataDespacho'];
			this.dataAbertura = objetoJson['dataAbertura'];
			this.dataEncerramento = objetoJson['dataEncerramento'];
			this.escrituracaoInicio = objetoJson['escrituracaoInicio'];
			this.escrituracaoFim = objetoJson['escrituracaoFim'];
			this.texto = objetoJson['texto'];


		}
	}
}