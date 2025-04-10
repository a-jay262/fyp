/*import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { VetService } from './vets.service';
import { Vet } from './vet.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';





@Controller('vets')
export class VetController {
  constructor(private readonly vetService: VetService) {}

  @Get()
  async getAll(): Promise<Vet[]> {
    return this.vetService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Vet> {
    return this.vetService.findOne(id);
  }

  @Post('createvets')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'certificate', maxCount: 1 },
      { name: 'imageUrl', maxCount: 1 },
    ]),
  )
  async create(
    @Body() vetData: Partial<Vet>,
    @UploadedFiles()
    files: {
      certificate?: Express.Multer.File[];
      imageUrl?: Express.Multer.File[];
    },
  ): Promise<Vet> {
    const certificateFile = files.certificate?.[0];
    const imageFile = files.imageUrl?.[0];
  
    return this.vetService.create(vetData, certificateFile, imageFile);
  }
  

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Vet>): Promise<Vet> {
    return this.vetService.update(id, updateData);
  }

  @Put(':id/approve')
  async approveVet(@Param('id') id: string): Promise<Vet> {
    return this.vetService.approve(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Vet> {
    return this.vetService.delete(id);
  }
}
*/
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { VetService } from './vets.service';
import { Vet } from './vet.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import sharp from 'sharp';  // Correct import
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { extname } from 'path';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('vets')
export class VetController {
  constructor(private readonly vetService: VetService) { }
  @Get('nonactive')
  async getActiveVets(): Promise<Vet[]> {
    return this.vetService.findActiveVets();  // This will return only vets with status 1
  }
  @Get('active')
  async getnonctiveVets(): Promise<Vet[]> {
    return this.vetService.findnonActiveVets();  // This will return only vets with status 1
  }
  @Get()
  async getAll(): Promise<Vet[]> {
    return this.vetService.findAll();
  }


  @Post('createvets')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'certificate', maxCount: 1 },
      { name: 'imageUrl', maxCount: 1 },
    ])
  )
  async create(
    @Body() vetData: Partial<Vet>,
    @UploadedFiles() files: { certificate?: Express.Multer.File[]; imageUrl?: Express.Multer.File[] }
  ): Promise<Vet> {
    const certificateFile = files.certificate?.[0];
    const imageFile = files.imageUrl?.[0];

    let compressedCertificateUrl: string | null = null;
    let compressedImageUrl: string | null = null;

    // Define uploadsDirectory outside try block
    const uploadsDirectory = path.resolve(__dirname, '../../uploads'); // Change to outside dist folder

    try {
      console.log('Uploads Directory:', uploadsDirectory);

      // Ensure the uploads directory exists
      await fs.promises.mkdir(uploadsDirectory, { recursive: true });

      // Process the certificate file
      if (certificateFile && certificateFile.buffer) {
        const certificateFileName = `${uuidv4()}-${certificateFile.originalname}`;
        const certificateFilePath = path.join(uploadsDirectory, certificateFileName);
        await fs.promises.writeFile(certificateFilePath, certificateFile.buffer);

        const certificateOutputPath = path.join(uploadsDirectory, `compressed-${certificateFileName}`);
        await sharp(certificateFilePath)
          .resize(300)
          .jpeg({ quality: 80 })
          .toFile(certificateOutputPath);

        compressedCertificateUrl = `/uploads/compressed-${certificateFileName}`;

        // Skipping deletion of the original certificate file
        console.log('Certificate file saved but not deleted:', certificateFilePath);
      } else {
        console.error('Certificate file is missing or has no buffer.');
      }

      // Process the image file
      if (imageFile && imageFile.buffer) {
        const imageFileName = `${uuidv4()}-${imageFile.originalname}`;
        const imageFilePath = path.join(uploadsDirectory, imageFileName);
        await fs.promises.writeFile(imageFilePath, imageFile.buffer);

        const imageOutputPath = path.join(uploadsDirectory, `compressed-${imageFileName}`);
        await sharp(imageFilePath)
          .resize(300)
          .jpeg({ quality: 80 })
          .toFile(imageOutputPath);

        compressedImageUrl = `/uploads/compressed-${imageFileName}`;

        // Skipping deletion of the original image file
        console.log('Image file saved but not deleted:', imageFilePath);
      } else {
        console.error('Image file is missing or has no buffer.');
      }

      // Pass the compressed file paths to the vetService
      return this.vetService.create(vetData, compressedCertificateUrl, compressedImageUrl);

    } catch (error) {
      console.error('Error processing the images:', error);

      // Cleanup: remove files if they exist (but we won't delete them anymore)
      if (certificateFile) {
        const certificateFilePath = path.join(uploadsDirectory, `${uuidv4()}-${certificateFile.originalname}`);
        if (fs.existsSync(certificateFilePath)) {
          console.log('Skipping deletion of certificate file:', certificateFilePath);
        }
      }

      if (imageFile) {
        const imageFilePath = path.join(uploadsDirectory, `${uuidv4()}-${imageFile.originalname}`);
        if (fs.existsSync(imageFilePath)) {
          console.log('Skipping deletion of image file:', imageFilePath);
        }
      }

      throw new Error('Error processing the images.');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Vet>): Promise<Vet> {
    return this.vetService.update(id, updateData);
  }

  @Put(':id/approve')
  async approveVet(@Param('id') id: string): Promise<Vet> {
    return this.vetService.approve(id);
  }


  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Vet> {
    return this.vetService.delete(id);
  }

  @Get('getvets')
  async getAllVets(): Promise<Vet[]> {
    return this.vetService.findAll(); // Calls the service to fetch all vets
  }

  // Update vet status (approve or reject)

  @Post('send-notification') 
  async sendNotification(@Body('email') email: string, @Body('name') name: string, @Body('message') message :string) {
    try {
      await this.vetService.sendNotificationEmail(email, name,message);
  
      return {
        success: true,
        message: 'Notification email sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send notification email',
        error: error.message,
      };
    }
  }
}