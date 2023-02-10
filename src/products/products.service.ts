import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, productDocument } from 'src/schemas/product.schema'
import { Model } from 'mongoose'

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<productDocument>) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return new this.productModel(createProductDto).save()
  }

  async findAll() {
    return this.productModel.find();
  }

  async findOne(id: string) {
    return this.productModel.findById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.updateOne({_id: id}, updateProductDto);
  }

  async remove(id: string) {
    return this.productModel.deleteOne({_id: id});
  }
}
