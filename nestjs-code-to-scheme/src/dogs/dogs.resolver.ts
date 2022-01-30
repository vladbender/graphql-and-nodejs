import { Resolver, Query, Args, Int, Mutation } from "@nestjs/graphql";
import { DogInput } from './dog.input';
import { Dog } from "./dog.model";
import { DogsService } from './dogs.service';

/**
 * Все досточно ясно описывается через декораторы
 */

@Resolver(() => Dog)
export class DogsResolver {
  constructor (
    private service: DogsService
  ) {}

  @Query(() => [Dog])
  getDogs() {
    return this.service.getDogs()
  }

  @Query(() => Dog, { nullable: true })
  getDog(
    @Args('id', { type: () => Int}) id: number
  ) {
    return this.service.getDog(id)
  }

  @Mutation(() => Dog)
  addDog(
    @Args('dog') dog: DogInput
  ) {
    return this.service.addDog(dog.name)
  }

  @Mutation(() => Int)
  deleteDog(
    @Args('id', { type: () => Int}) id: number
  ) {
    return this.service.deleteDog(id)
  }
}