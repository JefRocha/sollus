/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [INVENTARIO_CONTAGEM_DET] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { InventarioContagemCab } from '../../entities-export';
import { Produto } from '../../entities-export';

@Entity()
export class InventarioContagemDet {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	contagem01: number;

	@Column()
	contagem02: number;

	@Column()
	contagem03: number;

	@Column()
	fechadoContagem: string;

	@Column()
	quantidadeSistema: number;

	@Column()
	acuracidade: number;

	@Column()
	divergencia: number;


	/**
	* Relations
	*/
	@OneToOne(() => Produto)
	@JoinColumn()
	produto: Produto;

	@ManyToOne(() => InventarioContagemCab, inventarioContagemCab => inventarioContagemCab.listaInventarioContagemDet)
	@JoinColumn()
	inventarioContagemCab: InventarioContagemCab;


	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.contagem01 = objetoJson['contagem01'];
			this.contagem02 = objetoJson['contagem02'];
			this.contagem03 = objetoJson['contagem03'];
			this.fechadoContagem = objetoJson['fechadoContagem'];
			this.quantidadeSistema = objetoJson['quantidadeSistema'];
			this.acuracidade = objetoJson['acuracidade'];
			this.divergencia = objetoJson['divergencia'];

			if (objetoJson['produto'] != null) {
				this.produto = new Produto(objetoJson['produto']);
			}


		}
	}
}