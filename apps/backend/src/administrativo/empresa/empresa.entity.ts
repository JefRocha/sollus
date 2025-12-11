/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [EMPRESA] 
																			    
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
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EmpresaContato } from '../../entities-export';
import { EmpresaEndereco } from '../../entities-export';
import { EmpresaTelefone } from '../../entities-export';

@Entity()
export class Empresa {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	razaoSocial: string;

	@Column()
	nomeFantasia: string;

	@Column()
	cnpj: string;

	@Column()
	inscricaoEstadual: string;

	@Column()
	inscricaoMunicipal: string;

	@Column()
	tipoRegime: string;

	@Column()
	crt: string;

	@Column()
	email: string;

	@Column()
	site: string;

	@Column()
	contato: string;

	@Column()
	dataConstituicao: Date;

	@Column()
	tipo: string;

	@Column()
	inscricaoJuntaComercial: string;

	@Column()
	dataInscJuntaComercial: Date;

	@Column()
	codigoIbgeCidade: number;

	@Column()
	codigoIbgeUf: number;

	@Column()
	cei: string;

	@Column()
	codigoCnaePrincipal: string;

	enderecoPrincipal: EmpresaEndereco;

	getEnderecoPrincipal() {
		return this.enderecoPrincipal;
	}

	setEnderecoPrincipal(endereco: EmpresaEndereco) {
		this.enderecoPrincipal = endereco;
	}

	@Column({ type: 'text', nullable: true })
	imagemLogotipo: string;

	/**
	 * Relations
	 */
	@OneToMany(() => EmpresaContato, empresaContato => empresaContato.empresa, { cascade: true })
	listaEmpresaContato: EmpresaContato[];

	@OneToMany(() => EmpresaEndereco, empresaEndereco => empresaEndereco.empresa, { cascade: true })
	listaEmpresaEndereco: EmpresaEndereco[];

	@OneToMany(() => EmpresaTelefone, empresaTelefone => empresaTelefone.empresa, { cascade: true })
	listaEmpresaTelefone: EmpresaTelefone[];



	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.razaoSocial = objetoJson['razaoSocial'];
			this.nomeFantasia = objetoJson['nomeFantasia'];
			this.cnpj = objetoJson['cnpj'];
			this.inscricaoEstadual = objetoJson['inscricaoEstadual'];
			this.inscricaoMunicipal = objetoJson['inscricaoMunicipal'];
			this.tipoRegime = objetoJson['tipoRegime'];
			this.crt = objetoJson['crt'];
			this.email = objetoJson['email'];
			this.site = objetoJson['site'];
			this.contato = objetoJson['contato'];
			this.dataConstituicao = objetoJson['dataConstituicao'];
			this.tipo = objetoJson['tipo'];
			this.inscricaoJuntaComercial = objetoJson['inscricaoJuntaComercial'];
			this.dataInscJuntaComercial = objetoJson['dataInscJuntaComercial'];
			this.codigoIbgeCidade = objetoJson['codigoIbgeCidade'];
			this.codigoIbgeUf = objetoJson['codigoIbgeUf'];
			this.cei = objetoJson['cei'];
			this.codigoCnaePrincipal = objetoJson['codigoCnaePrincipal'];


			this.listaEmpresaContato = [];
			let listaEmpresaContatoJson = objetoJson['listaEmpresaContato'];
			if (listaEmpresaContatoJson != null) {
				for (let i = 0; i < listaEmpresaContatoJson.length; i++) {
					let objeto = new EmpresaContato(listaEmpresaContatoJson[i]);
					this.listaEmpresaContato.push(objeto);
				}
			}

			this.listaEmpresaEndereco = [];
			let listaEmpresaEnderecoJson = objetoJson['listaEmpresaEndereco'];
			if (listaEmpresaEnderecoJson != null) {
				for (let i = 0; i < listaEmpresaEnderecoJson.length; i++) {
					let objeto = new EmpresaEndereco(listaEmpresaEnderecoJson[i]);
					this.listaEmpresaEndereco.push(objeto);
				}
			}

			this.listaEmpresaTelefone = [];
			let listaEmpresaTelefoneJson = objetoJson['listaEmpresaTelefone'];
			if (listaEmpresaTelefoneJson != null) {
				for (let i = 0; i < listaEmpresaTelefoneJson.length; i++) {
					let objeto = new EmpresaTelefone(listaEmpresaTelefoneJson[i]);
					this.listaEmpresaTelefone.push(objeto);
				}
			}

		}
	}
}