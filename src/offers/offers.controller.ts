import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthGuard } from '@nestjs/passport';
import type { RequestWithUser } from 'src/shared/types';

@Controller('offers')
@UseGuards(AuthGuard('jwt'))
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req: RequestWithUser) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get()
  getAllOffers() {
    return this.offersService.getAllOffers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }
}
