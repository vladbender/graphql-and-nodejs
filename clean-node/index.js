const path = require('path')
const fs = require('fs')

const { ApolloServer, gql } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

const schema = fs.readFileSync(path.join(__dirname, 'schema.gql')).toString()

// По схеме генерируется объект с описанием схемы в некотором формате. Используется сервером.
const typeDefs = gql(schema)

// Данные для теста, чтобы не городить DB
const dogs = [
  { id: 1, name: 'Шарик' },
  { id: 2, name: 'Макс' },
  { id: 3, name: 'Локи' },
  { id: 4, name: 'Бублик' },
]
let nextDogId = 5

const toys = [
  { id: 1, name: 'Пластиковая бутылка' },
  { id: 2, name: 'Хомяк' },
  { id: 3, name: 'Мячик' },
  { id: 4, name: 'Кость' },
]
let nextToyId = 5

/**
 * Резолверы, в рамках GraphQL они аналогичны контроллерам в REST API.
 *
 * Объект резолверов может (но не обязан, пояснение - дальше)
 * полностью повторять своей структурой схему.
 */
const resolvers = {
  /**
   * Для реализации всех запросов на получение данных (аналогов GET запросов в REST)
   * требуется реализовать объект Query. Ключами являются названия методов согласно
   * схеме. Значениями - методы, которые должны вызываться.
   * 
   * Каждый резолвер принимает 4 аргумента:
   *   - parent - ссылка на родительский объект. Об этом ниже
   *   - args - объект аргументов запроса. Для тех запросов, где есть аргументы, иначе объект пустой.
   *   - context - контекст запроса. Данные, которые мы сами можем расшарить на каждый запрос.
   *     Можно рассматривать это как общую middleware, которая может расшарить данные о пользователе,
   *     совершающем запрос, коннекты к бд и т.д.
   *   - info - метаданные, что в них я хз, судя по доке используются редко
   */
  Query: {
    getDog: (parent, args, context, info) => {
      // В случае когда мы пишем резолвер для запроса
      // Вся инфа хранится в аргументах
      console.log('args', args)
      const { id } = args
      const dog = dogs.find(dog => dog.id === Number(id))
      console.log('dog', dog)
      return dog
    },
    getDogs: () => {
      return dogs
    }
  },
  Dog: {
    /**
     * Помимо написания резолвера для Query мы можем написать резолвер для любого поля любого типа.
     * Какие дает преимущества:
     *    - мы можем отдельно указать как получать массив инфы о собаке
     *      и как получать игрушку для каждой собаки
     * В данном случае объект parent будет ссылаться на родительский объект, а именно - описание собаки,
     * которое было зарезолвленно ранее. Т.е. { id, name }
     * 
     * Резолвер на поле сработает только в том случае, если в более раннем резолвере это поле
     * не было возвращено.
     * 
     * Например, при запросе getDog будет вызвана следующая цепочка резолверов:
     * Query.getDog -> Dog.favouriteToy
     * и будет она вызвана именно по той причине, что при вызове getDog не возвращается поле favouriteToy.
     */
    favouriteToy: (parent, args, context, info) => {
      // В случае когда нам надо зарезолвить поле, всю
      // инфу мы берем из родительского объекта
      // Но могут быть и аргументы, все зависит от
      // схемы
      // В общем случае args - аргументы для конкретного поля конкретного типа
      const { id: dogId } = parent
      return toys.find(toy => toy.id === dogId)
    }
  },
  /**
   * В GraphQL все CUD операции из CRUD описываются через мутации.
   * Отличие от Query только в том, что сервер гарантирует последовательное выполнение мутаций,
   * тогда как Query могут выполняться параллельно, ибо данные менять не должны, хотя и можно так написать код.
   */
  Mutation: {
    /**
     * Если взглянуть на схему
     * 
     * type Mutation {
     *   addDog(dog: DogInput): Dog
     * }
     * 
     * то можно увидеть, что в качестве параметров тут принимается input, а не type.
     * В рамках GraphQL все объекты делятся на два вида - type и input.
     * Первые используются как возвращаемые значения, вторые как параметры.
     * 
     * Подозреваю, что это связано с тем, что для type можно описывать резолверы, а для input - нет.
     * 
     * Как и указывалось раннее, параметр dog будет находиться в переменно args
     */
    addDog: (parent, args, context, info) => {
      const id = nextDogId++
      dogs.push({
        id,
        name: args.dog.name
      })
      return dogs.find(dog => dog.id === id)
    },
    addToy: (parent, args, context, info) => {
      const id = nextToyId++
      toys.push({
        id,
        name: args.toy.name
      })
      return toys.find(toy => toy.id === id)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    // Использую другой плейграунд т.к. дефолтный вешает систему
    ApolloServerPluginLandingPageGraphQLPlayground()
  ]
})

server.listen(4444).then(info => {
  const { url } = info
  console.log(`🚀 Server ready at ${url}`);
})
