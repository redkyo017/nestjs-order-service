import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpService,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ORDER_STATUS, PAYMENT_STATUS } from 'src/shared/constants';
import { CreateOrdersRequestDTO } from './dtos/create-order-req.dto';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private orderService: OrdersService,
  ) {}

  // @Get()
  // getOrders(): Promise<any> {
  //     return this.orderService.findAll()
  // }

  @Get(':id/status')
  @HttpCode(HttpStatus.OK)
  async getOrderStatus(@Param('id') id): Promise<any> {
    return this.orderService.getOrderStatus(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateOrdersRequestDTO): Promise<any> {
    return this.orderService.createOrderProcess(dto)
  }

  @Put(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelOrder(@Param('id') id): Promise<any> {
    return this.orderService.cancelOrder(id);
  }

}
