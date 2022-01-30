import path from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DogsModule } from './dogs';

@Module({
  imports: [
    GraphQLModule.forRoot({
      // Включать ли плейграунд
      playground: true,
      // В данном случае надо генерировать схему и располагаться она будет здесь
      autoSchemaFile: path.join(__dirname, '../schema.gql'),
      sortSchema: true,
      // По какому http пути будет принимать запросы graphql
      path: 'api/graphql'
    }),
    DogsModule
  ]
})
export class AppModule {}
