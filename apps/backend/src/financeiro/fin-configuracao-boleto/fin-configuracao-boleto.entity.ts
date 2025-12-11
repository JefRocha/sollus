/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [FIN_CONFIGURACAO_BOLETO] 
																			    
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
import { BancoContaCaixa } from '../../entities-export';

@Entity()
export class FinConfiguracaoBoleto {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	instrucao01: string;

	@Column()
	instrucao02: string;

	@Column()
	caminhoArquivoRemessa: string;

	@Column()
	caminhoArquivoRetorno: string;

	@Column()
	caminhoArquivoLogotipo: string;

	@Column()
	caminhoArquivoPdf: string;

	@Column()
	mensagem: string;

	@Column()
	localPagamento: string;

	@Column()
	layoutRemessa: string;

	@Column()
	aceite: string;

	@Column()
	especie: string;

	@Column()
	carteira: string;

	@Column()
	codigoConvenio: string;

	@Column()
	codigoCedente: string;

	@Column()
	taxaMulta: number;

	@Column()
	taxaJuro: number;

	@Column()
	diasProtesto: number;

	@Column()
	nossoNumeroAnterior: string;


	/**
	* Relations
	*/
	@OneToOne(() => BancoContaCaixa)
	@JoinColumn()
	bancoContaCaixa: BancoContaCaixa;


	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.instrucao01 = objetoJson['instrucao01'];
			this.instrucao02 = objetoJson['instrucao02'];
			this.caminhoArquivoRemessa = objetoJson['caminhoArquivoRemessa'];
			this.caminhoArquivoRetorno = objetoJson['caminhoArquivoRetorno'];
			this.caminhoArquivoLogotipo = objetoJson['caminhoArquivoLogotipo'];
			this.caminhoArquivoPdf = objetoJson['caminhoArquivoPdf'];
			this.mensagem = objetoJson['mensagem'];
			this.localPagamento = objetoJson['localPagamento'];
			this.layoutRemessa = objetoJson['layoutRemessa'];
			this.aceite = objetoJson['aceite'];
			this.especie = objetoJson['especie'];
			this.carteira = objetoJson['carteira'];
			this.codigoConvenio = objetoJson['codigoConvenio'];
			this.codigoCedente = objetoJson['codigoCedente'];
			this.taxaMulta = objetoJson['taxaMulta'];
			this.taxaJuro = objetoJson['taxaJuro'];
			this.diasProtesto = objetoJson['diasProtesto'];
			this.nossoNumeroAnterior = objetoJson['nossoNumeroAnterior'];

			if (objetoJson['bancoContaCaixa'] != null) {
				this.bancoContaCaixa = new BancoContaCaixa(objetoJson['bancoContaCaixa']);
			}


		}
	}
}