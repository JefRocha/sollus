/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [ETIQUETA_LAYOUT] 
																			    
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
export class EtiquetaLayout {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idFormatoPapel: number;

	@Column()
	codigoFabricante: string;

	@Column()
	quantidade: number;

	@Column()
	quantidadeHorizontal: number;

	@Column()
	quantidadeVertical: number;

	@Column()
	margemSuperior: number;

	@Column()
	margemInferior: number;

	@Column()
	margemEsquerda: number;

	@Column()
	margemDireita: number;

	@Column()
	espacamentoHorizontal: number;

	@Column()
	espacamentoVertical: number;


	/**
	* Relations
	*/

	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.idFormatoPapel = objetoJson['idFormatoPapel'];
			this.codigoFabricante = objetoJson['codigoFabricante'];
			this.quantidade = objetoJson['quantidade'];
			this.quantidadeHorizontal = objetoJson['quantidadeHorizontal'];
			this.quantidadeVertical = objetoJson['quantidadeVertical'];
			this.margemSuperior = objetoJson['margemSuperior'];
			this.margemInferior = objetoJson['margemInferior'];
			this.margemEsquerda = objetoJson['margemEsquerda'];
			this.margemDireita = objetoJson['margemDireita'];
			this.espacamentoHorizontal = objetoJson['espacamentoHorizontal'];
			this.espacamentoVertical = objetoJson['espacamentoVertical'];


		}
	}
}