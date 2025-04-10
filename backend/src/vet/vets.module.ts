import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { VetSchema } from './schema/vet.schema';
import { VetController } from './vets.controller';
import { VetService } from './vets.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vet', schema: VetSchema }]),
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
      },
    }),
  ],
  controllers: [VetController],
  providers: [VetService],
})
export class VetModule {}