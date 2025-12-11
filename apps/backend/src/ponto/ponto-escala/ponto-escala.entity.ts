/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [PONTO_ESCALA] 
																			    
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
export class PontoEscala {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nome: string;

	@Column()
	descontoHoraDia: string;

	@Column()
	descontoDsr: string;

	@Column()
	codigoHorarioDomingo: string;

	@Column()
	codigoHorarioSegunda: string;

	@Column()
	codigoHorarioTerca: string;

	@Column()
	codigoHorarioQuarta: string;

	@Column()
	codigoHorarioQuinta: string;

	@Column()
	codigoHorarioSexta: string;

	@Column()
	codigoHorarioSabado: string;


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
			this.nome = objetoJson['nome'];
			this.descontoHoraDia = objetoJson['descontoHoraDia'];
			this.descontoDsr = objetoJson['descontoDsr'];
			this.codigoHorarioDomingo = objetoJson['codigoHorarioDomingo'];
			this.codigoHorarioSegunda = objetoJson['codigoHorarioSegunda'];
			this.codigoHorarioTerca = objetoJson['codigoHorarioTerca'];
			this.codigoHorarioQuarta = objetoJson['codigoHorarioQuarta'];
			this.codigoHorarioQuinta = objetoJson['codigoHorarioQuinta'];
			this.codigoHorarioSexta = objetoJson['codigoHorarioSexta'];
			this.codigoHorarioSabado = objetoJson['codigoHorarioSabado'];


		}
	}
}