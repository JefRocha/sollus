/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [FISCAL_PARAMETRO] 
																			    
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
import { FiscalEstadualPorte } from '../../entities-export';
import { FiscalEstadualRegime } from '../../entities-export';
import { FiscalMunicipalRegime } from '../../entities-export';

@Entity()
export class FiscalParametro {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	vigencia: string;

	@Column()
	descricaoVigencia: string;

	@Column()
	criterioLancamento: string;

	@Column()
	apuracao: string;

	@Column()
	microempreeIndividual: string;

	@Column()
	calcPisCofinsEfd: string;

	@Column()
	simplesCodigoAcesso: string;

	@Column()
	simplesTabela: string;

	@Column()
	simplesAtividade: string;

	@Column()
	perfilSped: string;

	@Column()
	apuracaoConsolidada: string;

	@Column()
	substituicaoTributaria: string;

	@Column()
	formaCalculoIss: string;


	/**
	* Relations
	*/
	@OneToOne(() => FiscalEstadualPorte)
	@JoinColumn()
	fiscalEstadualPorte: FiscalEstadualPorte;

	@OneToOne(() => FiscalEstadualRegime)
	@JoinColumn()
	fiscalEstadualRegime: FiscalEstadualRegime;

	@OneToOne(() => FiscalMunicipalRegime)
	@JoinColumn()
	fiscalMunicipalRegime: FiscalMunicipalRegime;


	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.vigencia = objetoJson['vigencia'];
			this.descricaoVigencia = objetoJson['descricaoVigencia'];
			this.criterioLancamento = objetoJson['criterioLancamento'];
			this.apuracao = objetoJson['apuracao'];
			this.microempreeIndividual = objetoJson['microempreeIndividual'];
			this.calcPisCofinsEfd = objetoJson['calcPisCofinsEfd'];
			this.simplesCodigoAcesso = objetoJson['simplesCodigoAcesso'];
			this.simplesTabela = objetoJson['simplesTabela'];
			this.simplesAtividade = objetoJson['simplesAtividade'];
			this.perfilSped = objetoJson['perfilSped'];
			this.apuracaoConsolidada = objetoJson['apuracaoConsolidada'];
			this.substituicaoTributaria = objetoJson['substituicaoTributaria'];
			this.formaCalculoIss = objetoJson['formaCalculoIss'];

			if (objetoJson['fiscalEstadualPorte'] != null) {
				this.fiscalEstadualPorte = new FiscalEstadualPorte(objetoJson['fiscalEstadualPorte']);
			}

			if (objetoJson['fiscalEstadualRegime'] != null) {
				this.fiscalEstadualRegime = new FiscalEstadualRegime(objetoJson['fiscalEstadualRegime']);
			}

			if (objetoJson['fiscalMunicipalRegime'] != null) {
				this.fiscalMunicipalRegime = new FiscalMunicipalRegime(objetoJson['fiscalMunicipalRegime']);
			}


		}
	}
}