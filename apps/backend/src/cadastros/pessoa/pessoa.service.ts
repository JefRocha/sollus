/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Service relacionado à tabela [PESSOA] 
																			    
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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Pessoa } from './pessoa.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { BaseRepository } from '../../common/base.repository';
import { ClsService, ClsServiceManager } from 'nestjs-cls';
import { CrudRequest } from '@nestjsx/crud';

@Injectable()
export class PessoaService extends TypeOrmCrudService<Pessoa> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Pessoa) repository,
    private readonly cls: ClsService,
  ) {
    super(new BaseRepository(repository, cls));
  }

  // Override getOne to add all the necessary joins for the detail view
  async getOne(req: CrudRequest): Promise<Pessoa> {
    const { parsed, options } = req;

    // Create the base query builder
    const builder = await this.createBuilder(parsed, options);

    // Manually add all the joins needed for the detail view
    builder
      .leftJoinAndSelect(`${this.alias}.cliente`, 'cliente')
      .leftJoinAndSelect(`${this.alias}.colaborador`, 'colaborador')
      .leftJoinAndSelect(`${this.alias}.contador`, 'contador')
      .leftJoinAndSelect(`${this.alias}.fornecedor`, 'fornecedor')
      .leftJoinAndSelect(`${this.alias}.pessoaFisica`, 'pessoaFisica')
      .leftJoinAndSelect(`${this.alias}.pessoaJuridica`, 'pessoaJuridica')
      .leftJoinAndSelect(`${this.alias}.transportadora`, 'transportadora')
      .leftJoinAndSelect(
        `${this.alias}.listaPessoaContato`,
        'listaPessoaContato',
      )
      .leftJoinAndSelect(
        `${this.alias}.listaPessoaEndereco`,
        'listaPessoaEndereco',
      )
      .leftJoinAndSelect(
        `${this.alias}.listaPessoaTelefone`,
        'listaPessoaTelefone',
      );

    // Execute the query using the builder's getOne method
    return builder.getOne();
  }

  async persistir(pessoa: Pessoa, operacao: string): Promise<Pessoa> {
    let objetoRetorno: Pessoa;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Injeta o Tenant ID manualmente pois estamos usando queryRunner direto
      const tenantId = this.cls.get<number>('TENANT_ID');
      if (tenantId) {
        pessoa.empresa = { id: tenantId } as any;
      }

      if (operacao == 'A') {
        await this.excluirFilhos(queryRunner, pessoa.id);
        // await this.excluirVinculados(queryRunner, pessoa.id); // Perigoso: Remove registros com FK (ex: Colaborador -> Usuário)
      }

      objetoRetorno = await queryRunner.manager.save(pessoa);
      await queryRunner.commitTransaction();
    } catch (erro) {
      await queryRunner.rollbackTransaction();
      throw erro;
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
      await this.excluirVinculados(queryRunner, id);
      await this.excluirFilhos(queryRunner, id);
      await queryRunner.query('delete from pessoa where id=' + id);
      await queryRunner.commitTransaction();
    } catch (erro) {
      await queryRunner.rollbackTransaction();
      throw erro;
    } finally {
      await queryRunner.release();
    }
  }

  async excluirFilhos(queryRunner: QueryRunner, id: number) {
    await queryRunner.query('delete from PESSOA_CONTATO where ID_PESSOA=' + id);
    await queryRunner.query(
      'delete from PESSOA_ENDERECO where ID_PESSOA=' + id,
    );
    await queryRunner.query('delete from PESSOA_FISICA where ID_PESSOA=' + id);
    await queryRunner.query(
      'delete from PESSOA_JURIDICA where ID_PESSOA=' + id,
    );
    await queryRunner.query(
      'delete from PESSOA_TELEFONE where ID_PESSOA=' + id,
    );
  }

  async excluirVinculados(queryRunner: QueryRunner, id: number) {
    await queryRunner.query('delete from CLIENTE where ID_PESSOA=' + id);
    await queryRunner.query('delete from FORNECEDOR where ID_PESSOA=' + id);
    await queryRunner.query('delete from TRANSPORTADORA where ID_PESSOA=' + id);
    await queryRunner.query('delete from COLABORADOR where ID_PESSOA=' + id);
    await queryRunner.query('delete from CONTADOR where ID_PESSOA=' + id);
  }
}
