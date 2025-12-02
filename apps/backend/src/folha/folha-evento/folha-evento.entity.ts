/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [FOLHA_EVENTO] 
																			    
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
export class FolhaEvento {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	codigo: string;

	@Column()
	nome: string;

	@Column()
	descricao: string;

	@Column()
	tipo: string;

	@Column()
	unidade: string;

	@Column()
	baseCalculo: string;

	@Column()
	taxa: number;

	@Column()
	rubricaEsocial: string;

	@Column()
	codIncidenciaPrevidencia: string;

	@Column()
	codIncidenciaIrrf: string;

	@Column()
	codIncidenciaFgts: string;

	@Column()
	codIncidenciaSindicato: string;

	@Column()
	repercuteDsr: string;

	@Column()
	repercute13: string;

	@Column()
	repercuteFerias: string;

	@Column()
	repercuteAviso: string;


	/**
	* Relations
	*/

	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.codigo = objetoJson['codigo'];
			this.nome = objetoJson['nome'];
			this.descricao = objetoJson['descricao'];
			this.tipo = objetoJson['tipo'];
			this.unidade = objetoJson['unidade'];
			this.baseCalculo = objetoJson['baseCalculo'];
			this.taxa = objetoJson['taxa'];
			this.rubricaEsocial = objetoJson['rubricaEsocial'];
			this.codIncidenciaPrevidencia = objetoJson['codIncidenciaPrevidencia'];
			this.codIncidenciaIrrf = objetoJson['codIncidenciaIrrf'];
			this.codIncidenciaFgts = objetoJson['codIncidenciaFgts'];
			this.codIncidenciaSindicato = objetoJson['codIncidenciaSindicato'];
			this.repercuteDsr = objetoJson['repercuteDsr'];
			this.repercute13 = objetoJson['repercute13'];
			this.repercuteFerias = objetoJson['repercuteFerias'];
			this.repercuteAviso = objetoJson['repercuteAviso'];


		}
	}
}