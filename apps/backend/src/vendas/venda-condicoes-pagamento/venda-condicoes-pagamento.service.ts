/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Service relacionado à tabela [VENDA_CONDICOES_PAGAMENTO] 
																			    
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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { VendaCondicoesPagamento } from './venda-condicoes-pagamento.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { BaseRepository } from '../../common/base.repository';
import { ClsServiceManager } from 'nestjs-cls';

@Injectable()
export class VendaCondicoesPagamentoService extends TypeOrmCrudService<VendaCondicoesPagamento> {

	constructor(
		private dataSource: DataSource,
		@InjectRepository(VendaCondicoesPagamento) repository
	) {
		super(new BaseRepository(repository));
	}

	async persistir(vendaCondicoesPagamento: VendaCondicoesPagamento, operacao: string): Promise<VendaCondicoesPagamento> {
		let objetoRetorno: VendaCondicoesPagamento;

		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const tenantId = ClsServiceManager.getClsService().get<number>('TENANT_ID');
			if (tenantId) {
				vendaCondicoesPagamento.empresa = { id: tenantId } as any;
			}

			if (operacao == 'A') {
				await this.excluirFilhos(queryRunner, vendaCondicoesPagamento.id);
			}
			objetoRetorno = await queryRunner.manager.save(vendaCondicoesPagamento);
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
			await queryRunner.query('delete from vendaCondicoesPagamento where id=' + id);
			await queryRunner.commitTransaction();
		} catch (erro) {
			await queryRunner.rollbackTransaction();
			throw (erro);
		} finally {
			await queryRunner.release();
		}
	}

	async excluirFilhos(queryRunner: QueryRunner, id: number) {
		await queryRunner.query('delete from VENDA_CONDICOES_PARCELAS where ID_VENDA_CONDICOES_PAGAMENTO=' + id);

	}

}