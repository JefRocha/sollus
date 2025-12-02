/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [NFE_DETALHE_IMPOSTO_ISSQN] 
																			    
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
export class NfeDetalheImpostoIssqn {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	baseCalculoIssqn: number;

	@Column()
	aliquotaIssqn: number;

	@Column()
	valorIssqn: number;

	@Column()
	municipioIssqn: number;

	@Column()
	itemListaServicos: number;

	@Column()
	valorDeducao: number;

	@Column()
	valorOutrasRetencoes: number;

	@Column()
	valorDescontoIncondicionado: number;

	@Column()
	valorDescontoCondicionado: number;

	@Column()
	valorRetencaoIss: number;

	@Column()
	indicadorExigibilidadeIss: string;

	@Column()
	codigoServico: string;

	@Column()
	municipioIncidencia: number;

	@Column()
	paisSevicoPrestado: number;

	@Column()
	numeroProcesso: string;

	@Column()
	indicadorIncentivoFiscal: string;


	/**
	* Relations
	*/
	@OneToOne(() => NfeDetalhe, nfeDetalhe => nfeDetalhe.nfeDetalheImpostoIssqn)
	@JoinColumn()
	nfeDetalhe: NfeDetalhe;


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.baseCalculoIssqn = objetoJson['baseCalculoIssqn'];
			this.aliquotaIssqn = objetoJson['aliquotaIssqn'];
			this.valorIssqn = objetoJson['valorIssqn'];
			this.municipioIssqn = objetoJson['municipioIssqn'];
			this.itemListaServicos = objetoJson['itemListaServicos'];
			this.valorDeducao = objetoJson['valorDeducao'];
			this.valorOutrasRetencoes = objetoJson['valorOutrasRetencoes'];
			this.valorDescontoIncondicionado = objetoJson['valorDescontoIncondicionado'];
			this.valorDescontoCondicionado = objetoJson['valorDescontoCondicionado'];
			this.valorRetencaoIss = objetoJson['valorRetencaoIss'];
			this.indicadorExigibilidadeIss = objetoJson['indicadorExigibilidadeIss'];
			this.codigoServico = objetoJson['codigoServico'];
			this.municipioIncidencia = objetoJson['municipioIncidencia'];
			this.paisSevicoPrestado = objetoJson['paisSevicoPrestado'];
			this.numeroProcesso = objetoJson['numeroProcesso'];
			this.indicadorIncentivoFiscal = objetoJson['indicadorIncentivoFiscal'];


		}
	}
}