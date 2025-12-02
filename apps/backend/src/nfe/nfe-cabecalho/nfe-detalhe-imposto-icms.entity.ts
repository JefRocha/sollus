/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [NFE_DETALHE_IMPOSTO_ICMS] 
																			    
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
export class NfeDetalheImpostoIcms {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	origemMercadoria: string;

	@Column()
	cstIcms: string;

	@Column()
	csosn: string;

	@Column()
	modalidadeBcIcms: string;

	@Column()
	percentualReducaoBcIcms: number;

	@Column()
	valorBcIcms: number;

	@Column()
	aliquotaIcms: number;

	@Column()
	valorIcmsOperacao: number;

	@Column()
	percentualDiferimento: number;

	@Column()
	valorIcmsDiferido: number;

	@Column()
	valorIcms: number;

	@Column()
	baseCalculoFcp: number;

	@Column()
	percentualFcp: number;

	@Column()
	valorFcp: number;

	@Column()
	modalidadeBcIcmsSt: string;

	@Column()
	percentualMvaIcmsSt: number;

	@Column()
	percentualReducaoBcIcmsSt: number;

	@Column()
	valorBaseCalculoIcmsSt: number;

	@Column()
	aliquotaIcmsSt: number;

	@Column()
	valorIcmsSt: number;

	@Column()
	baseCalculoFcpSt: number;

	@Column()
	percentualFcpSt: number;

	@Column()
	valorFcpSt: number;

	@Column()
	ufSt: string;

	@Column()
	percentualBcOperacaoPropria: number;

	@Column()
	valorBcIcmsStRetido: number;

	@Column()
	aliquotaSuportadaConsumidor: number;

	@Column()
	valorIcmsSubstituto: number;

	@Column()
	valorIcmsStRetido: number;

	@Column()
	baseCalculoFcpStRetido: number;

	@Column()
	percentualFcpStRetido: number;

	@Column()
	valorFcpStRetido: number;

	@Column()
	motivoDesoneracaoIcms: string;

	@Column()
	valorIcmsDesonerado: number;

	@Column()
	aliquotaCreditoIcmsSn: number;

	@Column()
	valorCreditoIcmsSn: number;

	@Column()
	valorBcIcmsStDestino: number;

	@Column()
	valorIcmsStDestino: number;

	@Column()
	percentualReducaoBcEfetivo: number;

	@Column()
	valorBcEfetivo: number;

	@Column()
	aliquotaIcmsEfetivo: number;

	@Column()
	valorIcmsEfetivo: number;


	/**
	* Relations
	*/
	@OneToOne(() => NfeDetalhe, nfeDetalhe => nfeDetalhe.nfeDetalheImpostoIcms)
	@JoinColumn()
	nfeDetalhe: NfeDetalhe;


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.origemMercadoria = objetoJson['origemMercadoria'];
			this.cstIcms = objetoJson['cstIcms'];
			this.csosn = objetoJson['csosn'];
			this.modalidadeBcIcms = objetoJson['modalidadeBcIcms'];
			this.percentualReducaoBcIcms = objetoJson['percentualReducaoBcIcms'];
			this.valorBcIcms = objetoJson['valorBcIcms'];
			this.aliquotaIcms = objetoJson['aliquotaIcms'];
			this.valorIcmsOperacao = objetoJson['valorIcmsOperacao'];
			this.percentualDiferimento = objetoJson['percentualDiferimento'];
			this.valorIcmsDiferido = objetoJson['valorIcmsDiferido'];
			this.valorIcms = objetoJson['valorIcms'];
			this.baseCalculoFcp = objetoJson['baseCalculoFcp'];
			this.percentualFcp = objetoJson['percentualFcp'];
			this.valorFcp = objetoJson['valorFcp'];
			this.modalidadeBcIcmsSt = objetoJson['modalidadeBcIcmsSt'];
			this.percentualMvaIcmsSt = objetoJson['percentualMvaIcmsSt'];
			this.percentualReducaoBcIcmsSt = objetoJson['percentualReducaoBcIcmsSt'];
			this.valorBaseCalculoIcmsSt = objetoJson['valorBaseCalculoIcmsSt'];
			this.aliquotaIcmsSt = objetoJson['aliquotaIcmsSt'];
			this.valorIcmsSt = objetoJson['valorIcmsSt'];
			this.baseCalculoFcpSt = objetoJson['baseCalculoFcpSt'];
			this.percentualFcpSt = objetoJson['percentualFcpSt'];
			this.valorFcpSt = objetoJson['valorFcpSt'];
			this.ufSt = objetoJson['ufSt'];
			this.percentualBcOperacaoPropria = objetoJson['percentualBcOperacaoPropria'];
			this.valorBcIcmsStRetido = objetoJson['valorBcIcmsStRetido'];
			this.aliquotaSuportadaConsumidor = objetoJson['aliquotaSuportadaConsumidor'];
			this.valorIcmsSubstituto = objetoJson['valorIcmsSubstituto'];
			this.valorIcmsStRetido = objetoJson['valorIcmsStRetido'];
			this.baseCalculoFcpStRetido = objetoJson['baseCalculoFcpStRetido'];
			this.percentualFcpStRetido = objetoJson['percentualFcpStRetido'];
			this.valorFcpStRetido = objetoJson['valorFcpStRetido'];
			this.motivoDesoneracaoIcms = objetoJson['motivoDesoneracaoIcms'];
			this.valorIcmsDesonerado = objetoJson['valorIcmsDesonerado'];
			this.aliquotaCreditoIcmsSn = objetoJson['aliquotaCreditoIcmsSn'];
			this.valorCreditoIcmsSn = objetoJson['valorCreditoIcmsSn'];
			this.valorBcIcmsStDestino = objetoJson['valorBcIcmsStDestino'];
			this.valorIcmsStDestino = objetoJson['valorIcmsStDestino'];
			this.percentualReducaoBcEfetivo = objetoJson['percentualReducaoBcEfetivo'];
			this.valorBcEfetivo = objetoJson['valorBcEfetivo'];
			this.aliquotaIcmsEfetivo = objetoJson['aliquotaIcmsEfetivo'];
			this.valorIcmsEfetivo = objetoJson['valorIcmsEfetivo'];


		}
	}

	zerarNulos() {
		this.percentualReducaoBcIcms = this.percentualReducaoBcIcms == null ? 0 : this.percentualReducaoBcIcms;
		this.valorBcIcms = this.valorBcIcms == null ? 0 : this.valorBcIcms;
		this.aliquotaIcms = this.aliquotaIcms == null ? 0 : this.aliquotaIcms;
		this.valorIcmsOperacao = this.valorIcmsOperacao == null ? 0 : this.valorIcmsOperacao;
		this.percentualDiferimento = this.percentualDiferimento == null ? 0 : this.percentualDiferimento;
		this.valorIcmsDiferido = this.valorIcmsDiferido == null ? 0 : this.valorIcmsDiferido;
		this.valorIcms = this.valorIcms == null ? 0 : this.valorIcms;
		this.baseCalculoFcp = this.baseCalculoFcp == null ? 0 : this.baseCalculoFcp;
		this.percentualFcp = this.percentualFcp == null ? 0 : this.percentualFcp;
		this.valorFcp = this.valorFcp == null ? 0 : this.valorFcp;
		this.percentualMvaIcmsSt = this.percentualMvaIcmsSt == null ? 0 : this.percentualMvaIcmsSt;
		this.percentualReducaoBcIcmsSt = this.percentualReducaoBcIcmsSt == null ? 0 : this.percentualReducaoBcIcmsSt;
		this.valorBaseCalculoIcmsSt = this.valorBaseCalculoIcmsSt == null ? 0 : this.valorBaseCalculoIcmsSt;
		this.aliquotaIcmsSt = this.aliquotaIcmsSt == null ? 0 : this.aliquotaIcmsSt;
		this.valorIcmsSt = this.valorIcmsSt == null ? 0 : this.valorIcmsSt;
		this.baseCalculoFcpSt = this.baseCalculoFcpSt == null ? 0 : this.baseCalculoFcpSt;
		this.percentualFcpSt = this.percentualFcpSt == null ? 0 : this.percentualFcpSt;
		this.valorFcpSt = this.valorFcpSt == null ? 0 : this.valorFcpSt;
		this.percentualBcOperacaoPropria = this.percentualBcOperacaoPropria == null ? 0 : this.percentualBcOperacaoPropria;
		this.valorBcIcmsStRetido = this.valorBcIcmsStRetido == null ? 0 : this.valorBcIcmsStRetido;
		this.aliquotaSuportadaConsumidor = this.aliquotaSuportadaConsumidor == null ? 0 : this.aliquotaSuportadaConsumidor;
		this.valorIcmsSubstituto = this.valorIcmsSubstituto == null ? 0 : this.valorIcmsSubstituto;
		this.valorIcmsStRetido = this.valorIcmsStRetido == null ? 0 : this.valorIcmsStRetido;
		this.baseCalculoFcpStRetido = this.baseCalculoFcpStRetido == null ? 0 : this.baseCalculoFcpStRetido;
		this.percentualFcpStRetido = this.percentualFcpStRetido == null ? 0 : this.percentualFcpStRetido;
		this.valorFcpStRetido = this.valorFcpStRetido == null ? 0 : this.valorFcpStRetido;
		this.valorIcmsDesonerado = this.valorIcmsDesonerado == null ? 0 : this.valorIcmsDesonerado;
		this.aliquotaCreditoIcmsSn = this.aliquotaCreditoIcmsSn == null ? 0 : this.aliquotaCreditoIcmsSn;
		this.valorCreditoIcmsSn = this.valorCreditoIcmsSn == null ? 0 : this.valorCreditoIcmsSn;
		this.valorBcIcmsStDestino = this.valorBcIcmsStDestino == null ? 0 : this.valorBcIcmsStDestino;
		this.valorIcmsStDestino = this.valorIcmsStDestino == null ? 0 : this.valorIcmsStDestino;
		this.percentualReducaoBcEfetivo = this.percentualReducaoBcEfetivo == null ? 0 : this.percentualReducaoBcEfetivo;
		this.valorBcEfetivo = this.valorBcEfetivo == null ? 0 : this.valorBcEfetivo;
		this.aliquotaIcmsEfetivo = this.aliquotaIcmsEfetivo == null ? 0 : this.aliquotaIcmsEfetivo;
		this.valorIcmsEfetivo = this.valorIcmsEfetivo == null ? 0 : this.valorIcmsEfetivo;
	}
}