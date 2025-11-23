/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Service relacionado à tabela [TRIBUT_CONFIGURA_OF_GT] 
																			    
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
import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { TributConfiguraOfGt } from './tribut-configura-of-gt.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { Empresa, TributGrupoTributario, TributOperacaoFiscal } from 'entities-export';
import { TenantService } from '../../tenant/tenant.service';
import { BaseRepository } from '../../common/base.repository';

@Injectable({ scope: Scope.REQUEST })
export class TributConfiguraOfGtService extends TypeOrmCrudService<TributConfiguraOfGt> {

	constructor(
		private dataSource: DataSource,
		@InjectRepository(TributConfiguraOfGt) repository,
		private readonly tenantService: TenantService
	) {
		super(new BaseRepository(repository, tenantService));
	}

	async persistir(tributConfiguraOfGt: TributConfiguraOfGt, operacao: string): Promise<TributConfiguraOfGt> {
		let objetoRetorno: TributConfiguraOfGt;

		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const tenantId = this.tenantService.tenantId;
			if (tenantId) {
				tributConfiguraOfGt.empresa = { id: tenantId } as any;
			}

			if (operacao == 'A') {
				await this.excluirFilhos(queryRunner, tributConfiguraOfGt.id);
			}
			objetoRetorno = await queryRunner.manager.save(tributConfiguraOfGt);
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
			await queryRunner.query('delete from tributConfiguraOfGt where id=' + id);
			await queryRunner.commitTransaction();
		} catch (erro) {
			await queryRunner.rollbackTransaction();
			throw (erro);
		} finally {
			await queryRunner.release();
		}
	}

	async excluirFilhos(queryRunner: QueryRunner, id: number) {
		await queryRunner.query('delete from TRIBUT_COFINS where ID_TRIBUT_CONFIGURA_OF_GT=' + id);
		await queryRunner.query('delete from TRIBUT_ICMS_UF where ID_TRIBUT_CONFIGURA_OF_GT=' + id);
		await queryRunner.query('delete from TRIBUT_IPI where ID_TRIBUT_CONFIGURA_OF_GT=' + id);
		await queryRunner.query('delete from TRIBUT_PIS where ID_TRIBUT_CONFIGURA_OF_GT=' + id);

	}

	async consultarTributacao(idTributGrupoTributario: string, idTributOperacaoFiscal: string): Promise<TributConfiguraOfGt> {
		let objetoRetorno: TributConfiguraOfGt;
		try {
			const tenantId = this.tenantService.tenantId;
			const grupoTributario = await this.dataSource.manager.findOneBy(TributGrupoTributario, { id: parseInt(idTributGrupoTributario), empresa: { id: tenantId } });
			const operacaoFiscal = await this.dataSource.manager.findOneBy(TributOperacaoFiscal, { id: parseInt(idTributOperacaoFiscal), empresa: { id: tenantId } });
			objetoRetorno = await this.dataSource.manager.findOne(TributConfiguraOfGt, { where: { tributGrupoTributario: grupoTributario, tributOperacaoFiscal: operacaoFiscal, empresa: { id: tenantId } }, relations: ['tributCofins', 'tributIpi', 'tributPis', 'tributGrupoTributario', 'tributOperacaoFiscal', 'listaTributIcmsUf'] });
		} catch (erro) {
			throw (erro);
		} finally {
		}
		return objetoRetorno;
	}
}