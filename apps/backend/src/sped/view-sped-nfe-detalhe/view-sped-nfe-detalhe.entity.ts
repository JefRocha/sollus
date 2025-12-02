/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [VIEW_SPED_NFE_DETALHE] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { NfeCabecalho } from '../../entities-export';
import { Produto } from '../../entities-export';
import { TributOperacaoFiscal } from '../../entities-export';
import { ProdutoUnidade } from '../../entities-export';

@Entity()
export class ViewSpedNfeDetalhe {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	numeroItem: number;

	@Column()
	codigoProduto: string;

	@Column()
	gtin: string;

	@Column()
	nomeProduto: string;

	@Column()
	ncm: string;

	@Column()
	nve: string;

	@Column()
	cest: string;

	@Column()
	indicadorEscalaRelevante: string;

	@Column()
	cnpjFabricante: string;

	@Column()
	codigoBeneficioFiscal: string;

	@Column()
	exTipi: number;

	@Column()
	cfop: number;

	@Column()
	unidadeComercial: string;

	@Column()
	quantidadeComercial: number;

	@Column()
	numeroPedidoCompra: string;

	@Column()
	itemPedidoCompra: number;

	@Column()
	numeroFci: string;

	@Column()
	numeroRecopi: string;

	@Column()
	valorUnitarioComercial: number;

	@Column()
	valorBrutoProduto: number;

	@Column()
	gtinUnidadeTributavel: string;

	@Column()
	unidadeTributavel: string;

	@Column()
	quantidadeTributavel: number;

	@Column()
	valorUnitarioTributavel: number;

	@Column()
	valorFrete: number;

	@Column()
	valorSeguro: number;

	@Column()
	valorDesconto: number;

	@Column()
	valorOutrasDespesas: number;

	@Column()
	entraTotal: string;

	@Column()
	valorTotalTributos: number;

	@Column()
	percentualDevolvido: number;

	@Column()
	valorIpiDevolvido: number;

	@Column()
	informacoesAdicionais: string;

	@Column()
	valorSubtotal: number;

	@Column()
	valorTotal: number;

	@Column()
	cstCofins: string;

	@Column()
	quantidadeVendidaCofins: number;

	@Column()
	baseCalculoCofins: number;

	@Column()
	aliquotaCofinsPercentual: number;

	@Column()
	aliquotaCofinsReais: number;

	@Column()
	valorCofins: number;

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
	valorIcms: number;

	@Column()
	motivoDesoneracaoIcms: string;

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
	valorBcIcmsStRetido: number;

	@Column()
	valorIcmsStRetido: number;

	@Column()
	valorBcIcmsStDestino: number;

	@Column()
	valorIcmsStDestino: number;

	@Column()
	aliquotaCreditoIcmsSn: number;

	@Column()
	valorCreditoIcmsSn: number;

	@Column()
	percentualBcOperacaoPropria: number;

	@Column()
	ufSt: string;

	@Column()
	valorBcIi: number;

	@Column()
	valorDespesasAduaneiras: number;

	@Column()
	valorImpostoImportacao: number;

	@Column()
	valorIof: number;

	@Column()
	cnpjProdutor: string;

	@Column()
	codigoSeloIpi: string;

	@Column()
	quantidadeSeloIpi: number;

	@Column()
	enquadramentoLegalIpi: string;

	@Column()
	cstIpi: string;

	@Column()
	valorBaseCalculoIpi: number;

	@Column()
	aliquotaIpi: number;

	@Column()
	quantidadeUnidadeTributavel: number;

	@Column()
	valorUnidadeTributavel: number;

	@Column()
	valorIpi: number;

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
	cstPis: string;

	@Column()
	quantidadeVendidaPis: number;

	@Column()
	valorBaseCalculoPis: number;

	@Column()
	aliquotaPisPercentual: number;

	@Column()
	aliquotaPisReais: number;

	@Column()
	valorPis: number;


	/**
	* Relations
	*/
	@OneToOne(() => Produto)
	@JoinColumn()
	produto: Produto;

	@OneToOne(() => TributOperacaoFiscal)
	@JoinColumn()
	tributOperacaoFiscal: TributOperacaoFiscal;

	@OneToOne(() => ProdutoUnidade)
	@JoinColumn()
	produtoUnidade: ProdutoUnidade;

	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.numeroItem = objetoJson['numeroItem'];
			this.codigoProduto = objetoJson['codigoProduto'];
			this.gtin = objetoJson['gtin'];
			this.nomeProduto = objetoJson['nomeProduto'];
			this.ncm = objetoJson['ncm'];
			this.nve = objetoJson['nve'];
			this.cest = objetoJson['cest'];
			this.indicadorEscalaRelevante = objetoJson['indicadorEscalaRelevante'];
			this.cnpjFabricante = objetoJson['cnpjFabricante'];
			this.codigoBeneficioFiscal = objetoJson['codigoBeneficioFiscal'];
			this.exTipi = objetoJson['exTipi'];
			this.cfop = objetoJson['cfop'];
			this.unidadeComercial = objetoJson['unidadeComercial'];
			this.quantidadeComercial = objetoJson['quantidadeComercial'];
			this.numeroPedidoCompra = objetoJson['numeroPedidoCompra'];
			this.itemPedidoCompra = objetoJson['itemPedidoCompra'];
			this.numeroFci = objetoJson['numeroFci'];
			this.numeroRecopi = objetoJson['numeroRecopi'];
			this.valorUnitarioComercial = objetoJson['valorUnitarioComercial'];
			this.valorBrutoProduto = objetoJson['valorBrutoProduto'];
			this.gtinUnidadeTributavel = objetoJson['gtinUnidadeTributavel'];
			this.unidadeTributavel = objetoJson['unidadeTributavel'];
			this.quantidadeTributavel = objetoJson['quantidadeTributavel'];
			this.valorUnitarioTributavel = objetoJson['valorUnitarioTributavel'];
			this.valorFrete = objetoJson['valorFrete'];
			this.valorSeguro = objetoJson['valorSeguro'];
			this.valorDesconto = objetoJson['valorDesconto'];
			this.valorOutrasDespesas = objetoJson['valorOutrasDespesas'];
			this.entraTotal = objetoJson['entraTotal'];
			this.valorTotalTributos = objetoJson['valorTotalTributos'];
			this.percentualDevolvido = objetoJson['percentualDevolvido'];
			this.valorIpiDevolvido = objetoJson['valorIpiDevolvido'];
			this.informacoesAdicionais = objetoJson['informacoesAdicionais'];
			this.valorSubtotal = objetoJson['valorSubtotal'];
			this.valorTotal = objetoJson['valorTotal'];
			this.cstCofins = objetoJson['cstCofins'];
			this.quantidadeVendidaCofins = objetoJson['quantidadeVendidaCofins'];
			this.baseCalculoCofins = objetoJson['baseCalculoCofins'];
			this.aliquotaCofinsPercentual = objetoJson['aliquotaCofinsPercentual'];
			this.aliquotaCofinsReais = objetoJson['aliquotaCofinsReais'];
			this.valorCofins = objetoJson['valorCofins'];
			this.origemMercadoria = objetoJson['origemMercadoria'];
			this.cstIcms = objetoJson['cstIcms'];
			this.csosn = objetoJson['csosn'];
			this.modalidadeBcIcms = objetoJson['modalidadeBcIcms'];
			this.percentualReducaoBcIcms = objetoJson['percentualReducaoBcIcms'];
			this.valorBcIcms = objetoJson['valorBcIcms'];
			this.aliquotaIcms = objetoJson['aliquotaIcms'];
			this.valorIcms = objetoJson['valorIcms'];
			this.motivoDesoneracaoIcms = objetoJson['motivoDesoneracaoIcms'];
			this.modalidadeBcIcmsSt = objetoJson['modalidadeBcIcmsSt'];
			this.percentualMvaIcmsSt = objetoJson['percentualMvaIcmsSt'];
			this.percentualReducaoBcIcmsSt = objetoJson['percentualReducaoBcIcmsSt'];
			this.valorBaseCalculoIcmsSt = objetoJson['valorBaseCalculoIcmsSt'];
			this.aliquotaIcmsSt = objetoJson['aliquotaIcmsSt'];
			this.valorIcmsSt = objetoJson['valorIcmsSt'];
			this.valorBcIcmsStRetido = objetoJson['valorBcIcmsStRetido'];
			this.valorIcmsStRetido = objetoJson['valorIcmsStRetido'];
			this.valorBcIcmsStDestino = objetoJson['valorBcIcmsStDestino'];
			this.valorIcmsStDestino = objetoJson['valorIcmsStDestino'];
			this.aliquotaCreditoIcmsSn = objetoJson['aliquotaCreditoIcmsSn'];
			this.valorCreditoIcmsSn = objetoJson['valorCreditoIcmsSn'];
			this.percentualBcOperacaoPropria = objetoJson['percentualBcOperacaoPropria'];
			this.ufSt = objetoJson['ufSt'];
			this.valorBcIi = objetoJson['valorBcIi'];
			this.valorDespesasAduaneiras = objetoJson['valorDespesasAduaneiras'];
			this.valorImpostoImportacao = objetoJson['valorImpostoImportacao'];
			this.valorIof = objetoJson['valorIof'];
			this.cnpjProdutor = objetoJson['cnpjProdutor'];
			this.codigoSeloIpi = objetoJson['codigoSeloIpi'];
			this.quantidadeSeloIpi = objetoJson['quantidadeSeloIpi'];
			this.enquadramentoLegalIpi = objetoJson['enquadramentoLegalIpi'];
			this.cstIpi = objetoJson['cstIpi'];
			this.valorBaseCalculoIpi = objetoJson['valorBaseCalculoIpi'];
			this.aliquotaIpi = objetoJson['aliquotaIpi'];
			this.quantidadeUnidadeTributavel = objetoJson['quantidadeUnidadeTributavel'];
			this.valorUnidadeTributavel = objetoJson['valorUnidadeTributavel'];
			this.valorIpi = objetoJson['valorIpi'];
			this.baseCalculoIssqn = objetoJson['baseCalculoIssqn'];
			this.aliquotaIssqn = objetoJson['aliquotaIssqn'];
			this.valorIssqn = objetoJson['valorIssqn'];
			this.municipioIssqn = objetoJson['municipioIssqn'];
			this.itemListaServicos = objetoJson['itemListaServicos'];
			this.cstPis = objetoJson['cstPis'];
			this.quantidadeVendidaPis = objetoJson['quantidadeVendidaPis'];
			this.valorBaseCalculoPis = objetoJson['valorBaseCalculoPis'];
			this.aliquotaPisPercentual = objetoJson['aliquotaPisPercentual'];
			this.aliquotaPisReais = objetoJson['aliquotaPisReais'];
			this.valorPis = objetoJson['valorPis'];

			if (objetoJson['produto'] != null) {
				this.produto = new Produto(objetoJson['produto']);
			}

			if (objetoJson['tributOperacaoFiscal'] != null) {
				this.tributOperacaoFiscal = new TributOperacaoFiscal(objetoJson['tributOperacaoFiscal']);
			}

			if (objetoJson['produtoUnidade'] != null) {
				this.produtoUnidade = new ProdutoUnidade(objetoJson['produtoUnidade']);
			}


		}
	}
}