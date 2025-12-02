/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [MDFE_CABECALHO] 
																			    
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
export class MdfeCabecalho {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	uf: number;

	@Column()
	tipoAmbiente: number;

	@Column()
	tipoEmitente: number;

	@Column()
	tipoTransportadora: number;

	@Column()
	modelo: string;

	@Column()
	serie: string;

	@Column()
	numeroMdfe: string;

	@Column()
	codigoNumerico: string;

	@Column()
	chaveAcesso: string;

	@Column()
	digitoVerificador: number;

	@Column()
	modal: number;

	@Column()
	dataHoraEmissao: Date;

	@Column()
	tipoEmissao: number;

	@Column()
	processoEmissao: number;

	@Column()
	versaoProcessoEmissao: string;

	@Column()
	ufInicio: string;

	@Column()
	ufFim: string;

	@Column()
	dataHoraPrevisaoViagem: Date;

	@Column()
	quantidadeTotalCte: number;

	@Column()
	quantidadeTotalNfe: number;

	@Column()
	quantidadeTotalMdfe: number;

	@Column()
	codigoUnidadeMedida: string;

	@Column()
	pesoBrutoCarga: number;

	@Column()
	valorCarga: number;

	@Column()
	numeroProtocolo: string;


	/**
	* Relations
	*/

	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.uf = objetoJson['uf'];
			this.tipoAmbiente = objetoJson['tipoAmbiente'];
			this.tipoEmitente = objetoJson['tipoEmitente'];
			this.tipoTransportadora = objetoJson['tipoTransportadora'];
			this.modelo = objetoJson['modelo'];
			this.serie = objetoJson['serie'];
			this.numeroMdfe = objetoJson['numeroMdfe'];
			this.codigoNumerico = objetoJson['codigoNumerico'];
			this.chaveAcesso = objetoJson['chaveAcesso'];
			this.digitoVerificador = objetoJson['digitoVerificador'];
			this.modal = objetoJson['modal'];
			this.dataHoraEmissao = objetoJson['dataHoraEmissao'];
			this.tipoEmissao = objetoJson['tipoEmissao'];
			this.processoEmissao = objetoJson['processoEmissao'];
			this.versaoProcessoEmissao = objetoJson['versaoProcessoEmissao'];
			this.ufInicio = objetoJson['ufInicio'];
			this.ufFim = objetoJson['ufFim'];
			this.dataHoraPrevisaoViagem = objetoJson['dataHoraPrevisaoViagem'];
			this.quantidadeTotalCte = objetoJson['quantidadeTotalCte'];
			this.quantidadeTotalNfe = objetoJson['quantidadeTotalNfe'];
			this.quantidadeTotalMdfe = objetoJson['quantidadeTotalMdfe'];
			this.codigoUnidadeMedida = objetoJson['codigoUnidadeMedida'];
			this.pesoBrutoCarga = objetoJson['pesoBrutoCarga'];
			this.valorCarga = objetoJson['valorCarga'];
			this.numeroProtocolo = objetoJson['numeroProtocolo'];


		}
	}
}