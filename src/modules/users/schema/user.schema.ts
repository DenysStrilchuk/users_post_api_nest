import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
  _id?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name?: string;

  @Prop()
  age?: number;

  @Prop()
  gender?: string;

  @Prop({default: false})
  isOnline: boolean;

  @Prop({default: 'user'})
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
