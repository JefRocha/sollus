/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [PATRIM_BEM] 
																			    
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
export class PatrimBem {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idCentroResultado: number;

	@Column()
	idPatrimTipoAquisicaoBem: number;

	@Column()
	idPatrimEstadoConservacao: number;

	@Column()
	idPatrimGrupoBem: number;

	@Column()
	idFornecedor: number;

	@Column()
	idColaborador: number;

	@Column()
	idSetor: number;

	@Column()
	numeroNb: string;

	@Column()
	nome: string;

	@Column()
	descricao: string;

	@Column()
	numeroSerie: string;

	@Column()
	dataAquisicao: Date;

	@Column()
	dataAceite: Date;

	@Column()
	dataCadastro: Date;

	@Column()
	dataContabilizado: Date;

	@Column()
	dataVistoria: Date;

	@Column()
	dataMarcacao: Date;

	@Column()
	dataBaixa: Date;

	@Column()
	vencimentoGarantia: Date;

	@Column()
	numeroNotaFiscal: string;

	@Column()
	chaveNfe: string;

	@Column()
	valorOriginal: number;

	@Column()
	valorCompra: number;

	@Column()
	valorAtualizado: number;

	@Column()
	valorBaixa: number;

	@Column()
	deprecia: string;

	@Column()
	metodoDepreciacao: string;

	@Column()
	inicioDepreciacao: Date;

	@Column()
	ultimaDepreciacao: Date;

	@Column()
	tipoDepreciacao: string;

	@Column()
	taxaAnualDepreciacao: number;

	@Column()
	taxaMensalDepreciacao: number;

	@Column()
	taxaDepreciacaoAcelerada: number;

	@Column()
	taxaDepreciacaoIncentivada: number;

	@Column()
	funcao: string;


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
			this.idCentroResultado = objetoJson['idCentroResultado'];
			this.idPatrimTipoAquisicaoBem = objetoJson['idPatrimTipoAquisicaoBem'];
			this.idPatrimEstadoConservacao = objetoJson['idPatrimEstadoConservacao'];
			this.idPatrimGrupoBem = objetoJson['idPatrimGrupoBem'];
			this.idFornecedor = objetoJson['idFornecedor'];
			this.idColaborador = objetoJson['idColaborador'];
			this.idSetor = objetoJson['idSetor'];
			this.numeroNb = objetoJson['numeroNb'];
			this.nome = objetoJson['nome'];
			this.descricao = objetoJson['descricao'];
			this.numeroSerie = objetoJson['numeroSerie'];
			this.dataAquisicao = objetoJson['dataAquisicao'];
			this.dataAceite = objetoJson['dataAceite'];
			this.dataCadastro = objetoJson['dataCadastro'];
			this.dataContabilizado = objetoJson['dataContabilizado'];
			this.dataVistoria = objetoJson['dataVistoria'];
			this.dataMarcacao = objetoJson['dataMarcacao'];
			this.dataBaixa = objetoJson['dataBaixa'];
			this.vencimentoGarantia = objetoJson['vencimentoGarantia'];
			this.numeroNotaFiscal = objetoJson['numeroNotaFiscal'];
			this.chaveNfe = objetoJson['chaveNfe'];
			this.valorOriginal = objetoJson['valorOriginal'];
			this.valorCompra = objetoJson['valorCompra'];
			this.valorAtualizado = objetoJson['valorAtualizado'];
			this.valorBaixa = objetoJson['valorBaixa'];
			this.deprecia = objetoJson['deprecia'];
			this.metodoDepreciacao = objetoJson['metodoDepreciacao'];
			this.inicioDepreciacao = objetoJson['inicioDepreciacao'];
			this.ultimaDepreciacao = objetoJson['ultimaDepreciacao'];
			this.tipoDepreciacao = objetoJson['tipoDepreciacao'];
			this.taxaAnualDepreciacao = objetoJson['taxaAnualDepreciacao'];
			this.taxaMensalDepreciacao = objetoJson['taxaMensalDepreciacao'];
			this.taxaDepreciacaoAcelerada = objetoJson['taxaDepreciacaoAcelerada'];
			this.taxaDepreciacaoIncentivada = objetoJson['taxaDepreciacaoIncentivada'];
			this.funcao = objetoJson['funcao'];


		}
	}
}