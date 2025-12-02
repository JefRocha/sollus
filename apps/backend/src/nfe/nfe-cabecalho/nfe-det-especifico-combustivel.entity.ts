/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [NFE_DET_ESPECIFICO_COMBUSTIVEL] 
																			    
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
import { NfeDetalhe } from '../../entities-export';

@Entity()
export class NfeDetEspecificoCombustivel {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	codigoAnp: number;

	@Column()
	descricaoAnp: string;

	@Column()
	percentualGlp: number;

	@Column()
	percentualGasNacional: number;

	@Column()
	percentualGasImportado: number;

	@Column()
	valorPartida: number;

	@Column()
	codif: string;

	@Column()
	quantidadeTempAmbiente: number;

	@Column()
	ufConsumo: string;

	@Column()
	cideBaseCalculo: number;

	@Column()
	cideAliquota: number;

	@Column()
	cideValor: number;

	@Column()
	encerranteBico: number;

	@Column()
	encerranteBomba: number;

	@Column()
	encerranteTanque: number;

	@Column()
	encerranteValorInicio: number;

	@Column()
	encerranteValorFim: number;


	/**
	* Relations
	*/
	@OneToOne(() => NfeDetalhe, nfeDetalhe => nfeDetalhe.nfeDetEspecificoCombustivel)
	@JoinColumn()
	nfeDetalhe: NfeDetalhe;


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.codigoAnp = objetoJson['codigoAnp'];
			this.descricaoAnp = objetoJson['descricaoAnp'];
			this.percentualGlp = objetoJson['percentualGlp'];
			this.percentualGasNacional = objetoJson['percentualGasNacional'];
			this.percentualGasImportado = objetoJson['percentualGasImportado'];
			this.valorPartida = objetoJson['valorPartida'];
			this.codif = objetoJson['codif'];
			this.quantidadeTempAmbiente = objetoJson['quantidadeTempAmbiente'];
			this.ufConsumo = objetoJson['ufConsumo'];
			this.cideBaseCalculo = objetoJson['cideBaseCalculo'];
			this.cideAliquota = objetoJson['cideAliquota'];
			this.cideValor = objetoJson['cideValor'];
			this.encerranteBico = objetoJson['encerranteBico'];
			this.encerranteBomba = objetoJson['encerranteBomba'];
			this.encerranteTanque = objetoJson['encerranteTanque'];
			this.encerranteValorInicio = objetoJson['encerranteValorInicio'];
			this.encerranteValorFim = objetoJson['encerranteValorFim'];


		}
	}
}