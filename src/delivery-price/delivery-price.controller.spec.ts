import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPriceController } from './delivery-price.controller';

describe('DeliveryPriceController', () => {
  let controller: DeliveryPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryPriceController],
    }).compile();

    controller = module.get<DeliveryPriceController>(DeliveryPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
