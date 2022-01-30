import { Field, InputType } from '@nestjs/graphql';

/**
 * Все досточно ясно описывается через декораторы
 */

@InputType()
export class DogInput {
  @Field()
  name!: string
}