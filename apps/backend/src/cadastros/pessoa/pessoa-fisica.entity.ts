/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [PESSOA_FISICA] 
																			    
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
  ManyToOne,
} from 'typeorm';
import { Pessoa } from '../../entities-export';
import { NivelFormacao } from '../../entities-export';
import { EstadoCivil } from '../../entities-export';

@Entity()
export class PessoaFisica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cpf: string;

  @Column()
  rg: string;

  @Column()
  orgaoRg: string;

  @Column()
  dataEmissaoRg: Date;

  @Column()
  dataNascimento: Date;

  @Column()
  sexo: string;

  @Column()
  raca: string;

  @Column()
  nacionalidade: string;

  @Column()
  naturalidade: string;

  @Column()
  nomePai: string;

  @Column()
  nomeMae: string;

  /**
   * Relations
   */
  @OneToOne(() => Pessoa, (pessoa) => pessoa.pessoaFisica)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  @ManyToOne(() => NivelFormacao)
  @JoinColumn({ name: 'id_nivel_formacao' })
  nivelFormacao: NivelFormacao;

  @ManyToOne(() => EstadoCivil)
  @JoinColumn({ name: 'id_estado_civil' })
  estadoCivil: EstadoCivil;

  /**
   * Constructor
   */
  constructor(objetoJson: {}) {
    if (objetoJson != null) {
      this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
      this.cpf = objetoJson['cpf'];
      this.rg = objetoJson['rg'];
      this.orgaoRg = objetoJson['orgaoRg'];
      this.dataEmissaoRg = objetoJson['dataEmissaoRg'];
      this.dataNascimento = objetoJson['dataNascimento'];
      this.sexo = objetoJson['sexo'];
      this.raca = objetoJson['raca'];
      this.nacionalidade = objetoJson['nacionalidade'];
      this.naturalidade = objetoJson['naturalidade'];
      this.nomePai = objetoJson['nomePai'];
      this.nomeMae = objetoJson['nomeMae'];

      if (objetoJson['nivelFormacao'] != null) {
        this.nivelFormacao = new NivelFormacao(objetoJson['nivelFormacao']);
      }

      if (objetoJson['estadoCivil'] != null) {
        this.estadoCivil = new EstadoCivil(objetoJson['estadoCivil']);
      }
    }
  }
}
