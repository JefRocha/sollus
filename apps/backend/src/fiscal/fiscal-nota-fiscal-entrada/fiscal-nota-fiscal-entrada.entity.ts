/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [FISCAL_NOTA_FISCAL_ENTRADA] 
																			    
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
import { NfeCabecalho } from '../../entities-export';

@Entity()
export class FiscalNotaFiscalEntrada {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	competencia: string;

	@Column()
	cfopEntrada: number;

	@Column()
	valorRateioFrete: number;

	@Column()
	valorCustoMedio: number;

	@Column()
	valorIcmsAntecipado: number;

	@Column()
	valorBcIcmsAntecipado: number;

	@Column()
	valorBcIcmsCreditado: number;

	@Column()
	valorBcPisCreditado: number;

	@Column()
	valorBcCofinsCreditado: number;

	@Column()
	valorBcIpiCreditado: number;

	@Column()
	cstCreditoIcms: string;

	@Column()
	cstCreditoPis: string;

	@Column()
	cstCreditoCofins: string;

	@Column()
	cstCreditoIpi: string;

	@Column()
	valorIcmsCreditado: number;

	@Column()
	valorPisCreditado: number;

	@Column()
	valorCofinsCreditado: number;

	@Column()
	valorIpiCreditado: number;

	@Column()
	qtdeParcelaCreditoPis: number;

	@Column()
	qtdeParcelaCreditoCofins: number;

	@Column()
	qtdeParcelaCreditoIcms: number;

	@Column()
	qtdeParcelaCreditoIpi: number;

	@Column()
	aliquotaCreditoIcms: number;

	@Column()
	aliquotaCreditoPis: number;

	@Column()
	aliquotaCreditoCofins: number;

	@Column()
	aliquotaCreditoIpi: number;


	/**
	* Relations
	*/
	@OneToOne(() => NfeCabecalho)
	@JoinColumn()
	nfeCabecalho: NfeCabecalho;


	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.competencia = objetoJson['competencia'];
			this.cfopEntrada = objetoJson['cfopEntrada'];
			this.valorRateioFrete = objetoJson['valorRateioFrete'];
			this.valorCustoMedio = objetoJson['valorCustoMedio'];
			this.valorIcmsAntecipado = objetoJson['valorIcmsAntecipado'];
			this.valorBcIcmsAntecipado = objetoJson['valorBcIcmsAntecipado'];
			this.valorBcIcmsCreditado = objetoJson['valorBcIcmsCreditado'];
			this.valorBcPisCreditado = objetoJson['valorBcPisCreditado'];
			this.valorBcCofinsCreditado = objetoJson['valorBcCofinsCreditado'];
			this.valorBcIpiCreditado = objetoJson['valorBcIpiCreditado'];
			this.cstCreditoIcms = objetoJson['cstCreditoIcms'];
			this.cstCreditoPis = objetoJson['cstCreditoPis'];
			this.cstCreditoCofins = objetoJson['cstCreditoCofins'];
			this.cstCreditoIpi = objetoJson['cstCreditoIpi'];
			this.valorIcmsCreditado = objetoJson['valorIcmsCreditado'];
			this.valorPisCreditado = objetoJson['valorPisCreditado'];
			this.valorCofinsCreditado = objetoJson['valorCofinsCreditado'];
			this.valorIpiCreditado = objetoJson['valorIpiCreditado'];
			this.qtdeParcelaCreditoPis = objetoJson['qtdeParcelaCreditoPis'];
			this.qtdeParcelaCreditoCofins = objetoJson['qtdeParcelaCreditoCofins'];
			this.qtdeParcelaCreditoIcms = objetoJson['qtdeParcelaCreditoIcms'];
			this.qtdeParcelaCreditoIpi = objetoJson['qtdeParcelaCreditoIpi'];
			this.aliquotaCreditoIcms = objetoJson['aliquotaCreditoIcms'];
			this.aliquotaCreditoPis = objetoJson['aliquotaCreditoPis'];
			this.aliquotaCreditoCofins = objetoJson['aliquotaCreditoCofins'];
			this.aliquotaCreditoIpi = objetoJson['aliquotaCreditoIpi'];

			if (objetoJson['nfeCabecalho'] != null) {
				this.nfeCabecalho = new NfeCabecalho(objetoJson['nfeCabecalho']);
			}


		}
	}
}