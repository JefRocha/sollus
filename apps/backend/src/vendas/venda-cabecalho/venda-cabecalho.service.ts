/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Service relacionado à tabela [VENDA_CABECALHO] 
																			    
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
import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { VendaCabecalho } from './venda-cabecalho.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { TenantService } from '../../tenant/tenant.service';
import { BaseRepository } from '../../common/base.repository';

@Injectable({ scope: Scope.REQUEST })
export class VendaCabecalhoService extends TypeOrmCrudService<VendaCabecalho> {

	constructor(
		private dataSource: DataSource,
		@InjectRepository(VendaCabecalho) repository,
		private readonly tenantService: TenantService
	) {
		super(new BaseRepository(repository, tenantService));
	}

	async persistir(vendaCabecalho: VendaCabecalho, operacao: string): Promise<VendaCabecalho> {
		let objetoRetorno: VendaCabecalho;

		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			// Injeta o Tenant ID manualmente pois estamos usando queryRunner direto
			const tenantId = this.tenantService.tenantId;
			if (tenantId) {
				vendaCabecalho.empresa = { id: tenantId } as any;
			}

			if (operacao == 'A') {
				await this.excluirFilhos(queryRunner, vendaCabecalho.id);
			}
			objetoRetorno = await queryRunner.manager.save(vendaCabecalho);
			await queryRunner.commitTransaction();
		} catch (erro) {
			await queryRunner.rollbackTransaction();
			throw (erro);
		} finally {
			await queryRunner.release();
		}
		return objetoRetorno;
	}

	async excluirMestreDetalhe(id: number) {
		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			await this.excluirFilhos(queryRunner, id);
			await queryRunner.query('delete from vendaCabecalho where id=' + id);
			await queryRunner.commitTransaction();
		} catch (erro) {
			await queryRunner.rollbackTransaction();
			throw (erro);
		} finally {
			await queryRunner.release();
		}
	}

	async excluirFilhos(queryRunner: QueryRunner, id: number) {
		await queryRunner.query('delete from VENDA_COMISSAO where ID_VENDA_CABECALHO=' + id);
		await queryRunner.query('delete from VENDA_DETALHE where ID_VENDA_CABECALHO=' + id);

	}

}