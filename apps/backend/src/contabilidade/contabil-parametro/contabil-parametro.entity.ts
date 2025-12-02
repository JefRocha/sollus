/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [CONTABIL_PARAMETRO] 
																			    
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
export class ContabilParametro {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	mascara: string;

	@Column()
	niveis: number;

	@Column()
	informarContaPor: string;

	@Column()
	compartilhaPlanoConta: string;

	@Column()
	compartilhaHistoricos: string;

	@Column()
	alteraLancamentoOutro: string;

	@Column()
	historicoObrigatorio: string;

	@Column()
	permiteLancamentoZerado: string;

	@Column()
	geraInformativoSped: string;

	@Column()
	spedFormaEscritDiario: string;

	@Column()
	spedNomeLivroDiario: string;

	@Column()
	assinaturaDireita: string;

	@Column()
	assinaturaEsquerda: string;

	@Column()
	contaAtivo: string;

	@Column()
	contaPassivo: string;

	@Column()
	contaPatrimonioLiquido: string;

	@Column()
	contaDepreciacaoAcumulada: string;

	@Column()
	contaCapitalSocial: string;

	@Column()
	contaResultadoExercicio: string;

	@Column()
	contaPrejuizoAcumulado: string;

	@Column()
	contaLucroAcumulado: string;

	@Column()
	contaTituloPagar: string;

	@Column()
	contaTituloReceber: string;

	@Column()
	contaJurosPassivo: string;

	@Column()
	contaJurosAtivo: string;

	@Column()
	contaDescontoObtido: string;

	@Column()
	contaDescontoConcedido: string;

	@Column()
	contaCmv: string;

	@Column()
	contaVenda: string;

	@Column()
	contaVendaServico: string;

	@Column()
	contaEstoque: string;

	@Column()
	contaApuraResultado: string;

	@Column()
	contaJurosApropriar: string;

	@Column()
	idHistPadraoResultado: number;

	@Column()
	idHistPadraoLucro: number;

	@Column()
	idHistPadraoPrejuizo: number;


	/**
	* Relations
	*/

	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.mascara = objetoJson['mascara'];
			this.niveis = objetoJson['niveis'];
			this.informarContaPor = objetoJson['informarContaPor'];
			this.compartilhaPlanoConta = objetoJson['compartilhaPlanoConta'];
			this.compartilhaHistoricos = objetoJson['compartilhaHistoricos'];
			this.alteraLancamentoOutro = objetoJson['alteraLancamentoOutro'];
			this.historicoObrigatorio = objetoJson['historicoObrigatorio'];
			this.permiteLancamentoZerado = objetoJson['permiteLancamentoZerado'];
			this.geraInformativoSped = objetoJson['geraInformativoSped'];
			this.spedFormaEscritDiario = objetoJson['spedFormaEscritDiario'];
			this.spedNomeLivroDiario = objetoJson['spedNomeLivroDiario'];
			this.assinaturaDireita = objetoJson['assinaturaDireita'];
			this.assinaturaEsquerda = objetoJson['assinaturaEsquerda'];
			this.contaAtivo = objetoJson['contaAtivo'];
			this.contaPassivo = objetoJson['contaPassivo'];
			this.contaPatrimonioLiquido = objetoJson['contaPatrimonioLiquido'];
			this.contaDepreciacaoAcumulada = objetoJson['contaDepreciacaoAcumulada'];
			this.contaCapitalSocial = objetoJson['contaCapitalSocial'];
			this.contaResultadoExercicio = objetoJson['contaResultadoExercicio'];
			this.contaPrejuizoAcumulado = objetoJson['contaPrejuizoAcumulado'];
			this.contaLucroAcumulado = objetoJson['contaLucroAcumulado'];
			this.contaTituloPagar = objetoJson['contaTituloPagar'];
			this.contaTituloReceber = objetoJson['contaTituloReceber'];
			this.contaJurosPassivo = objetoJson['contaJurosPassivo'];
			this.contaJurosAtivo = objetoJson['contaJurosAtivo'];
			this.contaDescontoObtido = objetoJson['contaDescontoObtido'];
			this.contaDescontoConcedido = objetoJson['contaDescontoConcedido'];
			this.contaCmv = objetoJson['contaCmv'];
			this.contaVenda = objetoJson['contaVenda'];
			this.contaVendaServico = objetoJson['contaVendaServico'];
			this.contaEstoque = objetoJson['contaEstoque'];
			this.contaApuraResultado = objetoJson['contaApuraResultado'];
			this.contaJurosApropriar = objetoJson['contaJurosApropriar'];
			this.idHistPadraoResultado = objetoJson['idHistPadraoResultado'];
			this.idHistPadraoLucro = objetoJson['idHistPadraoLucro'];
			this.idHistPadraoPrejuizo = objetoJson['idHistPadraoPrejuizo'];


		}
	}
}