/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [VIEW_PESSOA_CLIENTE] 
																			    
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
export class ViewPessoaCliente {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nome: string;

	@Column()
	tipo: string;

	@Column()
	email: string;

	@Column()
	site: string;

	@Column()
	cpfCnpj: string;

	@Column()
	rgIe: string;

	@Column()
	desde: Date;

	@Column()
	taxaDesconto: number;

	@Column()
	limiteCredito: number;

	@Column()
	dataCadastro: Date;

	@Column()
	observacao: string;

	@Column()
	logradouro: string;

	@Column()
	numero: string;

	@Column()
	complemento: string;

	@Column()
	bairro: string;

	@Column()
	cidade: string;

	@Column()
	cep: string;

	@Column()
	municipioIbge: number;

	@Column()
	uf: string;

	@Column()
	idPessoa: number;


	/**
	* Relations
	*/

	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.nome = objetoJson['nome'];
			this.tipo = objetoJson['tipo'];
			this.email = objetoJson['email'];
			this.site = objetoJson['site'];
			this.cpfCnpj = objetoJson['cpfCnpj'];
			this.rgIe = objetoJson['rgIe'];
			this.desde = objetoJson['desde'];
			this.taxaDesconto = objetoJson['taxaDesconto'];
			this.limiteCredito = objetoJson['limiteCredito'];
			this.dataCadastro = objetoJson['dataCadastro'];
			this.observacao = objetoJson['observacao'];
			this.logradouro = objetoJson['logradouro'];
			this.numero = objetoJson['numero'];
			this.complemento = objetoJson['complemento'];
			this.bairro = objetoJson['bairro'];
			this.cidade = objetoJson['cidade'];
			this.cep = objetoJson['cep'];
			this.municipioIbge = objetoJson['municipioIbge'];
			this.uf = objetoJson['uf'];
			this.idPessoa = objetoJson['idPessoa'];


		}
	}
}