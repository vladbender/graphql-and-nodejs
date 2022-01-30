import { Injectable } from '@nestjs/common';

let dogs = [
  { id: 1, name: 'Шарик' },
  { id: 2, name: 'Макс' },
  { id: 3, name: 'Локи' },
  { id: 4, name: 'Бублик' },
]
let nextDogId = 5

@Injectable()
export class DogsService {
  addDog(name: string) {
    const id = nextDogId++
    dogs.push({
      id,
      name
    })
    return this.getDog(id)
  }

  getDog(id: number) {
    return dogs.find(dog => dog.id === id)
  }

  getDogs() {
    return dogs
  }

  deleteDog(id: number) {
    dogs = dogs.filter(dog => dog.id !== id)
    return id
  }
}
