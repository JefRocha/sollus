/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [PESSOA_JURIDICA] 
																			    
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
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Pessoa } from '../../entities-export';

@Entity()
export class PessoaJuridica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cnpj: string;

  @Column()
  nomeFantasia: string;

  @Column()
  inscricaoEstadual: string;

  @Column()
  inscricaoMunicipal: string;

  @Column()
  dataConstituicao: Date;

  @Column()
  tipoRegime: string;

  @Column()
  crt: string;

  /**
   * Relations
   */
  @OneToOne(() => Pessoa, (pessoa) => pessoa.pessoaJuridica)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  /**
   * Constructor
   */
  
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
    if (objetoJson != null) {
      this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
      this.cnpj = objetoJson['cnpj'];
      this.nomeFantasia = objetoJson['nomeFantasia'];
      this.inscricaoEstadual = objetoJson['inscricaoEstadual'];
      this.inscricaoMunicipal = objetoJson['inscricaoMunicipal'];
      this.dataConstituicao = objetoJson['dataConstituicao'];
      this.tipoRegime = objetoJson['tipoRegime'];
      this.crt = objetoJson['crt'];
    }
  }
}
