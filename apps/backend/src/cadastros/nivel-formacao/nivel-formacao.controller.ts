import { Controller } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest } from '@nestjsx/crud';
import { NivelFormacaoService } from './nivel-formacao.service';
import { NivelFormacao } from './nivel-formacao.entity';

@Crud({
  model: {
    type: NivelFormacao,
  },
  query: {
    join: {
    },
  },
})
@Controller('nivel-formacao')
export class NivelFormacaoController implements CrudController<NivelFormacao> {
  constructor(public service: NivelFormacaoService) { }

  get base(): CrudController<NivelFormacao> {
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
    @ParsedBody() dto: NivelFormacao,
  ) {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: NivelFormacao,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  @Override()
  replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: NivelFormacao,
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