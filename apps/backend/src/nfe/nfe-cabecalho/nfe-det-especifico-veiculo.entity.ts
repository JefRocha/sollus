/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Model relacionado à tabela [NFE_DET_ESPECIFICO_VEICULO] 
																			    
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
import { NfeDetalhe } from '../../entities-export';

@Entity()
export class NfeDetEspecificoVeiculo {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	tipoOperacao: string;

	@Column()
	chassi: string;

	@Column()
	cor: string;

	@Column()
	descricaoCor: string;

	@Column()
	potenciaMotor: string;

	@Column()
	cilindradas: string;

	@Column()
	pesoLiquido: string;

	@Column()
	pesoBruto: string;

	@Column()
	numeroSerie: string;

	@Column()
	tipoCombustivel: string;

	@Column()
	numeroMotor: string;

	@Column()
	capacidadeMaximaTracao: string;

	@Column()
	distanciaEixos: string;

	@Column()
	anoModelo: string;

	@Column()
	anoFabricacao: string;

	@Column()
	tipoPintura: string;

	@Column()
	tipoVeiculo: string;

	@Column()
	especieVeiculo: string;

	@Column()
	condicaoVin: string;

	@Column()
	condicaoVeiculo: string;

	@Column()
	codigoMarcaModelo: string;

	@Column()
	codigoCorDenatran: string;

	@Column()
	lotacaoMaxima: number;

	@Column()
	restricao: string;


	/**
	* Relations
	*/
	@OneToOne(() => NfeDetalhe, nfeDetalhe => nfeDetalhe.nfeDetEspecificoVeiculo)
	@JoinColumn()
	nfeDetalhe: NfeDetalhe;


	/**
	* Constructor
	*/
	
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa: number;
constructor(objetoJson: {}) {
		if (objetoJson != null) {
			this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
			this.tipoOperacao = objetoJson['tipoOperacao'];
			this.chassi = objetoJson['chassi'];
			this.cor = objetoJson['cor'];
			this.descricaoCor = objetoJson['descricaoCor'];
			this.potenciaMotor = objetoJson['potenciaMotor'];
			this.cilindradas = objetoJson['cilindradas'];
			this.pesoLiquido = objetoJson['pesoLiquido'];
			this.pesoBruto = objetoJson['pesoBruto'];
			this.numeroSerie = objetoJson['numeroSerie'];
			this.tipoCombustivel = objetoJson['tipoCombustivel'];
			this.numeroMotor = objetoJson['numeroMotor'];
			this.capacidadeMaximaTracao = objetoJson['capacidadeMaximaTracao'];
			this.distanciaEixos = objetoJson['distanciaEixos'];
			this.anoModelo = objetoJson['anoModelo'];
			this.anoFabricacao = objetoJson['anoFabricacao'];
			this.tipoPintura = objetoJson['tipoPintura'];
			this.tipoVeiculo = objetoJson['tipoVeiculo'];
			this.especieVeiculo = objetoJson['especieVeiculo'];
			this.condicaoVin = objetoJson['condicaoVin'];
			this.condicaoVeiculo = objetoJson['condicaoVeiculo'];
			this.codigoMarcaModelo = objetoJson['codigoMarcaModelo'];
			this.codigoCorDenatran = objetoJson['codigoCorDenatran'];
			this.lotacaoMaxima = objetoJson['lotacaoMaxima'];
			this.restricao = objetoJson['restricao'];


		}
	}
}