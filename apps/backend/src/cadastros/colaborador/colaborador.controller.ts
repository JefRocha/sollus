import { Controller } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest } from '@nestjsx/crud';
import { ColaboradorService } from './colaborador.service';
import { Colaborador } from '../pessoa/colaborador.entity';

@Crud({
    model: {
        type: Colaborador,
    },
    query: {
        join: {
            pessoa: {
                eager: true,
            },
            "pessoa.pessoaFisica": {
                eager: true,
            },
            setor: {
                eager: true,
            },
            cargo: {
                eager: true,
            },
            tipoAdmissao: {
                eager: true,
            },
            colaboradorSituacao: {
                eager: true,
            },
            colaboradorTipo: {
                eager: true,
            },
        },
    },
})
@Controller('colaborador')
export class ColaboradorController implements CrudController<Colaborador> {
    constructor(public service: ColaboradorService) { }

    get base(): CrudController<Colaborador> {
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
        @ParsedBody() dto: Colaborador,
    ) {
        return this.base.createOneBase(req, dto);
    }

    @Override()
    updateOne(
        @ParsedRequest() req: CrudRequest,
        @ParsedBody() dto: Colaborador,
    ) {
        return this.base.updateOneBase(req, dto);
    }

    @Override()
    replaceOne(
        @ParsedRequest() req: CrudRequest,
        @ParsedBody() dto: Colaborador,
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
