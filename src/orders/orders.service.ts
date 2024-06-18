import {
  BadRequestException,
  HttpService,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ORDER_DELIVERY_PERIOD,
  ORDER_STATUS,
  PAYMENT_SERVICE_ENDPOINT,
  PAYMENT_STATUS,
} from '../shared/constants';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateOrdersRequestDTO } from './dtos/create-order-req.dto';
import { OrderStatusResponseDTO } from './dtos/order-status-res.dto';
import { Order } from './orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    private httpService: HttpService,
  ) {}
  private readonly logger = new Logger(OrdersService.name);
  static deliveryOrderTimeout = null;

  async create(order: Order): Promise<Order> {
    return await this.orderRepo.save(order);
  }

  async update(order: Order): Promise<Order> {
    return await this.orderRepo.save(order);
  }

  async getOrderStatus(orderId: string): Promise<OrderStatusResponseDTO> {
    const order = await this.orderRepo.findOne(orderId);
    if (!order) {
      throw new BadRequestException('order not existed');
    }
    const { id, status } = order;
    const result = new OrderStatusResponseDTO();
    result.id = id;
    result.status = status;
    return result;
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = await this.orderRepo.findOne(orderId);
    if (!order) {
      throw new BadRequestException('order not existed');
    }
    order.status = status;
    try {
      return await this.update(order);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async cancelOrder(orderId: number): Promise<OrderStatusResponseDTO> {
    const cancelledOrder = await this.updateOrderStatus(
      orderId,
      ORDER_STATUS.CANCELLED,
    );
    const { id, status } = cancelledOrder;
    const result = new OrderStatusResponseDTO();
    result.id = id;
    result.status = status;
    return result;
  }

  async confirmOrder(orderId: number): Promise<OrderStatusResponseDTO> {
    const confirmedOrder = await this.updateOrderStatus(
      orderId,
      ORDER_STATUS.CONFIRMED,
    );
    const { id, status } = confirmedOrder;
    const result = new OrderStatusResponseDTO();
    result.id = id;
    result.status = status;
    return result;
  }

  async createOrderProcess(dto: CreateOrdersRequestDTO): Promise<OrderStatusResponseDTO> {
    const { amount, userId, orderDetailId, merchantId } = dto;
    const order = new Order();
    order.amount = amount;
    order.userid = userId;
    order.orderDetailId = orderDetailId;
    order.merchantId = merchantId;
    order.status = ORDER_STATUS.CREATED;
    const createdOrder = await this.create(order);
    if (createdOrder) {
      const paymentResponse = (await this.paymentProcess(createdOrder)) || {};
      const { status } = paymentResponse;
      const returnOrder = new OrderStatusResponseDTO();
      returnOrder.id = createdOrder.id;
      if (status === PAYMENT_STATUS.CONFIRMED) {
        const confirmOrder = await this.confirmOrder(createdOrder.id);
        returnOrder.status = confirmOrder.status;
        if (OrdersService.deliveryOrderTimeout) {
          clearTimeout(OrdersService.deliveryOrderTimeout);
        }
        OrdersService.deliveryOrderTimeout = setTimeout(() => {
          this.deliverOrders();
        }, ORDER_DELIVERY_PERIOD * 1000);
      } else {
        const cancelledOrder = await this.cancelOrder(createdOrder.id);
        returnOrder.status = cancelledOrder.status;
        return returnOrder;
      }
      return returnOrder;
    }
    throw new InternalServerErrorException('created order failed');
  }

  async paymentProcess(order: Order): Promise<any> {
    const { id, amount, createdAt, createdBy } = order;
    const res = await this.httpService
      .post(
        PAYMENT_SERVICE_ENDPOINT,
        {
          orderId: id,
          amount,
          createdAt,
          createdBy,
        },
        {
          headers: {
            authorization: 'Bearer valid_token',
            'content-type': 'application/json',
          },
        },
      )
      .toPromise();
    const { data } = res;
    return data;
  }

  async deliverOrders(): Promise<void> {
    try {
      await this.orderRepo
        .createQueryBuilder()
        .update()
        .set({ status: ORDER_STATUS.DELIVERED })
        .where({ status: ORDER_STATUS.CONFIRMED })
        .execute();
    } catch (error) {
      this.logger.log(error);
    }
  }
}
