/*******************************************************************************
Title: CS Solutions ERP 3.0                                                                
Description: Model relacionado à tabela [PONTO_FECHAMENTO_JORNADA] 
																			    
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
export class PontoFechamentoJornada {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idPontoClassificacaoJornada: number;

	@Column()
	idColaborador: number;

	@Column()
	dataFechamento: Date;

	@Column()
	diaSemana: string;

	@Column()
	codigoHorario: string;

	@Column()
	cargaHorariaEsperada: string;

	@Column()
	cargaHorariaDiurna: string;

	@Column()
	cargaHorariaNoturna: string;

	@Column()
	cargaHorariaTotal: string;

	@Column()
	entrada01: string;

	@Column()
	saida01: string;

	@Column()
	entrada02: string;

	@Column()
	saida02: string;

	@Column()
	entrada03: string;

	@Column()
	saida03: string;

	@Column()
	entrada04: string;

	@Column()
	saida04: string;

	@Column()
	entrada05: string;

	@Column()
	saida05: string;

	@Column()
	horaInicioJornada: string;

	@Column()
	horaFimJornada: string;

	@Column()
	horaExtra01: string;

	@Column()
	percentualHoraExtra01: number;

	@Column()
	modalidadeHoraExtra01: string;

	@Column()
	horaExtra02: string;

	@Column()
	percentualHoraExtra02: number;

	@Column()
	modalidadeHoraExtra02: string;

	@Column()
	horaExtra03: string;

	@Column()
	percentualHoraExtra03: number;

	@Column()
	modalidadeHoraExtra03: string;

	@Column()
	horaExtra04: string;

	@Column()
	percentualHoraExtra04: number;

	@Column()
	modalidadeHoraExtra04: string;

	@Column()
	faltaAtraso: string;

	@Column()
	compensar: string;

	@Column()
	bancoHoras: string;

	@Column()
	observacao: string;


	/**
	* Relations
	*/

	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.idPontoClassificacaoJornada = objetoJson['idPontoClassificacaoJornada'];
			this.idColaborador = objetoJson['idColaborador'];
			this.dataFechamento = objetoJson['dataFechamento'];
			this.diaSemana = objetoJson['diaSemana'];
			this.codigoHorario = objetoJson['codigoHorario'];
			this.cargaHorariaEsperada = objetoJson['cargaHorariaEsperada'];
			this.cargaHorariaDiurna = objetoJson['cargaHorariaDiurna'];
			this.cargaHorariaNoturna = objetoJson['cargaHorariaNoturna'];
			this.cargaHorariaTotal = objetoJson['cargaHorariaTotal'];
			this.entrada01 = objetoJson['entrada01'];
			this.saida01 = objetoJson['saida01'];
			this.entrada02 = objetoJson['entrada02'];
			this.saida02 = objetoJson['saida02'];
			this.entrada03 = objetoJson['entrada03'];
			this.saida03 = objetoJson['saida03'];
			this.entrada04 = objetoJson['entrada04'];
			this.saida04 = objetoJson['saida04'];
			this.entrada05 = objetoJson['entrada05'];
			this.saida05 = objetoJson['saida05'];
			this.horaInicioJornada = objetoJson['horaInicioJornada'];
			this.horaFimJornada = objetoJson['horaFimJornada'];
			this.horaExtra01 = objetoJson['horaExtra01'];
			this.percentualHoraExtra01 = objetoJson['percentualHoraExtra01'];
			this.modalidadeHoraExtra01 = objetoJson['modalidadeHoraExtra01'];
			this.horaExtra02 = objetoJson['horaExtra02'];
			this.percentualHoraExtra02 = objetoJson['percentualHoraExtra02'];
			this.modalidadeHoraExtra02 = objetoJson['modalidadeHoraExtra02'];
			this.horaExtra03 = objetoJson['horaExtra03'];
			this.percentualHoraExtra03 = objetoJson['percentualHoraExtra03'];
			this.modalidadeHoraExtra03 = objetoJson['modalidadeHoraExtra03'];
			this.horaExtra04 = objetoJson['horaExtra04'];
			this.percentualHoraExtra04 = objetoJson['percentualHoraExtra04'];
			this.modalidadeHoraExtra04 = objetoJson['modalidadeHoraExtra04'];
			this.faltaAtraso = objetoJson['faltaAtraso'];
			this.compensar = objetoJson['compensar'];
			this.bancoHoras = objetoJson['bancoHoras'];
			this.observacao = objetoJson['observacao'];


		}
	}
}