/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Controller relacionado à tabela [PESSOA] 
																			    
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
import { Controller, Delete, Param, Post, Put, Req, Get } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest } from '@nestjsx/crud';
import { PessoaService } from './pessoa.service';
import { Pessoa } from './pessoa.entity';
import { Request } from 'express';
import { TenantService } from '../../tenant/tenant.service';

@Crud({
	model: {
		type: Pessoa,
	},
	query: {
		join: {
			cliente: { eager: true },
			colaborador: { eager: true },
			contador: { eager: true },
			fornecedor: { eager: true },
			pessoaFisica: { eager: true },
			'pessoaFisica.estadoCivil': { eager: true },
			'pessoaFisica.nivelFormacao': { eager: true },
			pessoaJuridica: { eager: true },
			transportadora: { eager: true },
			listaPessoaContato: { eager: true },
			listaPessoaEndereco: { eager: true },
			listaPessoaTelefone: { eager: true },
		},
	},
})
@Controller('pessoa')
export class PessoaController implements CrudController<Pessoa> {
	constructor(
		public service: PessoaService,
		private readonly tenantService: TenantService
	) { }

	get base(): CrudController<Pessoa> {
		return this;
	}

	@Override()
	async getMany(@ParsedRequest() req: CrudRequest) {
		const tenantId = this.tenantService.tenantId;
		console.log('🔍 DEBUG PessoaController:');
		console.log('   Tenant ID:', tenantId);

		// Adiciona filtro de tenant
		if (tenantId) {
			if (!req.parsed.search) {
				req.parsed.search = { $and: [] };
			}
			if (!req.parsed.search.$and) {
				req.parsed.search.$and = [];
			}

			// Adiciona filtro por ID_EMPRESA (coluna direta)
			req.parsed.search.$and.push({
				'empresaId': { $eq: tenantId }
			});

			console.log('   Filter applied:', JSON.stringify(req.parsed.search));
		} else {
			console.log('   ⚠️ NO TENANT ID FOUND');
		}

		return this.service.getMany(req);
	}

	@Post()
	async inserir(@Req() request: Request) {
		let objetoJson = request.body;
		let pessoa = new Pessoa(objetoJson);
		const retorno = await this.service.persistir(pessoa, 'I');
		return retorno;
	}

	@Put(':id')
	async alterar(@Param('id') id: number, @Req() request: Request) {
		let objetoJson = request.body;
		let pessoa = new Pessoa(objetoJson);
		const retorno = await this.service.persistir(pessoa, 'A');
		return retorno;
	}

	@Delete(':id')
	async excluir(@Param('id') id: number) {
		return this.service.excluirMestreDetalhe(id);
	}



}