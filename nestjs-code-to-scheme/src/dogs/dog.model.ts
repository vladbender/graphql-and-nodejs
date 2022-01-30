import { Field, Int, ObjectType } from "@nestjs/graphql";

/**
 * Все досточно ясно описывается через декораторы
 */

@ObjectType()
export class Dog {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;
}
