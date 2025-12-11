/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [CONTABIL_CONTA] 
																			    
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
export class ContabilConta {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idPlanoConta: number;

	@Column()
	idContabilConta: number;

	@Column()
	idPlanoContaRefSped: number;

	@Column()
	classificacao: string;

	@Column()
	tipo: string;

	@Column()
	descricao: string;

	@Column()
	dataInclusao: Date;

	@Column()
	situacao: string;

	@Column()
	natureza: string;

	@Column()
	patrimonioResultado: string;

	@Column()
	livroCaixa: string;

	@Column()
	dfc: string;

	@Column()
	ordem: string;

	@Column()
	codigoReduzido: string;

	@Column()
	codigoEfd: string;


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
			this.idPlanoConta = objetoJson['idPlanoConta'];
			this.idContabilConta = objetoJson['idContabilConta'];
			this.idPlanoContaRefSped = objetoJson['idPlanoContaRefSped'];
			this.classificacao = objetoJson['classificacao'];
			this.tipo = objetoJson['tipo'];
			this.descricao = objetoJson['descricao'];
			this.dataInclusao = objetoJson['dataInclusao'];
			this.situacao = objetoJson['situacao'];
			this.natureza = objetoJson['natureza'];
			this.patrimonioResultado = objetoJson['patrimonioResultado'];
			this.livroCaixa = objetoJson['livroCaixa'];
			this.dfc = objetoJson['dfc'];
			this.ordem = objetoJson['ordem'];
			this.codigoReduzido = objetoJson['codigoReduzido'];
			this.codigoEfd = objetoJson['codigoEfd'];


		}
	}
}