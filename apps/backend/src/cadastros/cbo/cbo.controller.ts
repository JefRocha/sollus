import { Controller, Logger } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest } from '@nestjsx/crud';
import { CboService } from './cbo.service';
import { Cbo } from './cbo.entity';

@Crud({
    model: {
        type: Cbo,
    },
    query: {
        join: {
        },
    },
})
@Controller('cbo')
export class CboController implements CrudController<Cbo> {
    constructor(public service: CboService) { }

    get base(): CrudController<Cbo> {
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
        @ParsedBody() dto: Cbo,
    ) {
        console.log('[CboController] createOne called with:', dto);
        return this.service.createOne(req, dto);
    }

    @Override()
    updateOne(
        @ParsedRequest() req: CrudRequest,
        @ParsedBody() dto: Cbo,
    ) {
        console.log('[CboController] updateOne called with:', dto);
        return this.service.updateOne(req, dto);
    }

    @Override()
    replaceOne(
        @ParsedRequest() req: CrudRequest,
        @ParsedBody() dto: Cbo,
    ) {
        return this.service.replaceOne(req, dto);
    }

    @Override()
    deleteOne(
        @ParsedRequest() req: CrudRequest,
    ) {
        return this.base.deleteOneBase(req);
    }
}
