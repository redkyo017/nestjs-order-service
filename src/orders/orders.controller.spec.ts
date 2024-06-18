import { Test, TestingModule } from '@nestjs/testing';
import { ORDER_STATUS, PAYMENT_STATUS } from '../shared/constants';
import { CreateOrdersRequestDTO } from './dtos/create-order-req.dto';
import { OrderStatusResponseDTO } from './dtos/order-status-res.dto';
import { OrdersController } from './orders.controller';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';

class OrdersServiceMock {
  async create(order: Order) {
    return order
  }
  async updated(order: Order) {
    return order
  }
  async getOrderStatus(orderId: number): Promise<OrderStatusResponseDTO> {
    const result = new OrderStatusResponseDTO()
    result.status = ORDER_STATUS.CONFIRMED
    return result
  }
  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const result = new Order()
    result.status = status
    result.id = orderId
    return result
  }
  async cancelOrder(orderId: number): Promise<OrderStatusResponseDTO> {
    const result = new OrderStatusResponseDTO()
    result.status = ORDER_STATUS.CANCELLED
    return result
  }
  async confirmOrder(orderId: number): Promise<OrderStatusResponseDTO> {
    const result = new OrderStatusResponseDTO()
    result.status = ORDER_STATUS.CONFIRMED
    return result
  }
  async createOrderProcess(dto: CreateOrdersRequestDTO): Promise<OrderStatusResponseDTO> {
    const result = new OrderStatusResponseDTO()
    result.status = ORDER_STATUS.CONFIRMED
    return result
  }
  async paymentProcess(order: Order): Promise<any> {
    const { id, amount } = order
    return {
      orderId: id,
      amount,
      status: PAYMENT_STATUS.CONFIRMED
    }
  }
  async deliverOrders(): Promise<void> {
    return
  }
 }

describe('Orders Controller', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const ServiceProviderMock = {
      provide: OrdersService,
      useClass: OrdersServiceMock,
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceProviderMock],
      controllers: [OrdersController],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be successfully get order status',async () => {
    const orderId = 1
    const res = await controller.getOrderStatus(orderId)
    expect(res).not.toBeNull();
    expect(res.status).toEqual(ORDER_STATUS.CONFIRMED);
  });

  it('should be successfully cancel order',async () => {
    const orderId = 1
    const res = await controller.cancelOrder(orderId)
    expect(res).not.toBeNull();
    expect(res.status).toEqual(ORDER_STATUS.CANCELLED);
  });

  it('should be successfully create order',async () => {
    const dto = new CreateOrdersRequestDTO()
    dto.amount = 5000
    dto.userId = 1
    dto.orderDetailId = 1
    dto.merchantId = 1
    const res = await controller.create(dto)
    expect(res).not.toBeNull();
    expect(res.status).not.toBeNull()
  });

});
