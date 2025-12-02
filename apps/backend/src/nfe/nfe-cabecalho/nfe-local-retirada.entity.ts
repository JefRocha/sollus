/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [NFE_LOCAL_RETIRADA] 
																			    
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
import { NfeCabecalho } from '../../entities-export';

@Entity()
export class NfeLocalRetirada {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	cnpj: string;

	@Column()
	cpf: string;

	@Column()
	nomeExpedidor: string;

	@Column()
	logradouro: string;

	@Column()
	numero: string;

	@Column()
	complemento: string;

	@Column()
	bairro: string;

	@Column()
	codigoMunicipio: number;

	@Column()
	nomeMunicipio: string;

	@Column()
	uf: string;

	@Column()
	cep: string;

	@Column()
	codigoPais: number;

	@Column()
	nomePais: string;

	@Column()
	telefone: string;

	@Column()
	email: string;

	@Column()
	inscricaoEstadual: string;


	/**
	* Relations
	*/
	@OneToOne(() => NfeCabecalho, nfeCabecalho => nfeCabecalho.nfeLocalRetirada)
	@JoinColumn()
	nfeCabecalho: NfeCabecalho;


	/**
	* Constructor
	*/
	constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.cnpj = objetoJson['cnpj'];
			this.cpf = objetoJson['cpf'];
			this.nomeExpedidor = objetoJson['nomeExpedidor'];
			this.logradouro = objetoJson['logradouro'];
			this.numero = objetoJson['numero'];
			this.complemento = objetoJson['complemento'];
			this.bairro = objetoJson['bairro'];
			this.codigoMunicipio = objetoJson['codigoMunicipio'];
			this.nomeMunicipio = objetoJson['nomeMunicipio'];
			this.uf = objetoJson['uf'];
			this.cep = objetoJson['cep'];
			this.codigoPais = objetoJson['codigoPais'];
			this.nomePais = objetoJson['nomePais'];
			this.telefone = objetoJson['telefone'];
			this.email = objetoJson['email'];
			this.inscricaoEstadual = objetoJson['inscricaoEstadual'];


		}
	}
}