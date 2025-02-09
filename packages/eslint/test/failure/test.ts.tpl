// example.ts

import { EventEmitter } from 'events'

interface User {
    id: number
    name: string
    email: string
}

class UserService extends EventEmitter {
    users: User[] = [];

    constructor() {
        super()
    }

    addUser(user: User) {
        this.users.push(user)
        this.emit('userAdded', user)
    }

    getUser(id: number) {
        return this.users.find(user => user.id === id)
    }
}

const service = new UserService()
service.addUser({ id:1, name:"John Doe", email:"john@example.com" })
console.log(service.getUser(1))
