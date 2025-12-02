/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Controller relacionado à tabela [MUNICIPIO] 
                                                                                
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
import { Controller } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest } from '@nestjsx/crud';
import { MunicipioService } from './municipio.service';
import { Municipio } from './municipio.entity';

@Crud({
  model: {
    type: Municipio,
  },
  query: {
    join: {
      uf: {
        eager: false,
      },
    },
  },
})
@Controller('municipio')
export class MunicipioController implements CrudController<Municipio> {
  constructor(public service: MunicipioService) { }

  get base(): CrudController<Municipio> {
    return this;
  }

  @Override()
  getMany(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.getManyBase(req);
  }

  @Override()
  getOne(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.getOneBase(req);
  }

  @Override()
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Municipio,
  ) {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Municipio,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  @Override()
  replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Municipio,
  ) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  deleteOne(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.deleteOneBase(req);
  }
}