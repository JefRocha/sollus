/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [VENDA_FRETE] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { VendaCabecalho } from '../../entities-export';
import { Transportadora } from '../../entities-export';

@Entity()
export class VendaFrete {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	conhecimento: number;

	@Column()
	responsavel: string;

	@Column()
	placa: string;

	@Column()
	ufPlaca: string;

	@Column()
	seloFiscal: number;

	@Column()
	quantidadeVolume: number;

	@Column()
	marcaVolume: string;

	@Column()
	especieVolume: string;

	@Column()
	pesoBruto: number;

	@Column()
	pesoLiquido: number;


	/**
	* Relations
	*/
	@OneToOne(() => VendaCabecalho)
	@JoinColumn()
	vendaCabecalho: VendaCabecalho;

	@OneToOne(() => Transportadora)
	@JoinColumn()
	transportadora: Transportadora;


	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.conhecimento = objetoJson['conhecimento'];
			this.responsavel = objetoJson['responsavel'];
			this.placa = objetoJson['placa'];
			this.ufPlaca = objetoJson['ufPlaca'];
			this.seloFiscal = objetoJson['seloFiscal'];
			this.quantidadeVolume = objetoJson['quantidadeVolume'];
			this.marcaVolume = objetoJson['marcaVolume'];
			this.especieVolume = objetoJson['especieVolume'];
			this.pesoBruto = objetoJson['pesoBruto'];
			this.pesoLiquido = objetoJson['pesoLiquido'];

			if (objetoJson['vendaCabecalho'] != null) {
				this.vendaCabecalho = new VendaCabecalho(objetoJson['vendaCabecalho']);
			}

			if (objetoJson['transportadora'] != null) {
				this.transportadora = new Transportadora(objetoJson['transportadora']);
			}


		}
	}
}