/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [CTE_INFORMACAO_NF_OUTROS] 
																			    
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
export class CteInformacaoNfOutros {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idCteCabecalho: number;

	@Column()
	numeroRomaneio: string;

	@Column()
	numeroPedido: string;

	@Column()
	chaveAcessoNfe: string;

	@Column()
	codigoModelo: string;

	@Column()
	serie: string;

	@Column()
	numero: string;

	@Column()
	dataEmissao: Date;

	@Column()
	ufEmitente: number;

	@Column()
	baseCalculoIcms: number;

	@Column()
	valorIcms: number;

	@Column()
	baseCalculoIcmsSt: number;

	@Column()
	valorIcmsSt: number;

	@Column()
	valorTotalProdutos: number;

	@Column()
	valorTotal: number;

	@Column()
	cfopPredominante: number;

	@Column()
	pesoTotalKg: number;

	@Column()
	pinSuframa: number;

	@Column()
	dataPrevistaEntrega: Date;

	@Column()
	outroTipoDocOrig: string;

	@Column()
	outroDescricao: string;

	@Column()
	outroValorDocumento: number;


	/**
	* Relations
	*/

	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.idCteCabecalho = objetoJson['idCteCabecalho'];
			this.numeroRomaneio = objetoJson['numeroRomaneio'];
			this.numeroPedido = objetoJson['numeroPedido'];
			this.chaveAcessoNfe = objetoJson['chaveAcessoNfe'];
			this.codigoModelo = objetoJson['codigoModelo'];
			this.serie = objetoJson['serie'];
			this.numero = objetoJson['numero'];
			this.dataEmissao = objetoJson['dataEmissao'];
			this.ufEmitente = objetoJson['ufEmitente'];
			this.baseCalculoIcms = objetoJson['baseCalculoIcms'];
			this.valorIcms = objetoJson['valorIcms'];
			this.baseCalculoIcmsSt = objetoJson['baseCalculoIcmsSt'];
			this.valorIcmsSt = objetoJson['valorIcmsSt'];
			this.valorTotalProdutos = objetoJson['valorTotalProdutos'];
			this.valorTotal = objetoJson['valorTotal'];
			this.cfopPredominante = objetoJson['cfopPredominante'];
			this.pesoTotalKg = objetoJson['pesoTotalKg'];
			this.pinSuframa = objetoJson['pinSuframa'];
			this.dataPrevistaEntrega = objetoJson['dataPrevistaEntrega'];
			this.outroTipoDocOrig = objetoJson['outroTipoDocOrig'];
			this.outroDescricao = objetoJson['outroDescricao'];
			this.outroValorDocumento = objetoJson['outroValorDocumento'];


		}
	}
}