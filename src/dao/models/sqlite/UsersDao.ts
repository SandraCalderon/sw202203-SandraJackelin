import { User } from "../entities/User";
import { AbstractDao } from "./AbstractDao";
import sqlite from 'sqlite';

export class UsersDao extends AbstractDao<User>{
        public constructor(db: sqlite.Database) {
            super('USERS',db as sqlite.Database);
            super.exec('CREATE TABLE IF NOT EXISTS USERS ('
            + ' _id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,'
            + ' email TEXT,'
            + ' password TEXT,'
            + ' firstName TEXT,'
            + ' lastName TEXT);').then().catch(e => console.error(e));
        }


        public async getUsers() {
            return super.findAll();
        }

        public async getUserById(identifier: Partial<User>) {
            try {
                const result= await super.findByID(identifier);
                return result;
            } catch (ex: unknown) {
                console.log("UserDao sqlite: ", (ex as Error).message);
                throw ex;
            }
        }

        public async insertNewUser(newUser: User) {
            try {
                const result= await super.createOne(newUser);
                return result;
            } catch (ex) {
                console.log("UserDao sqlite: ", (ex as Error).message);
                throw ex;
            }
        }


        public async updateNewUser (updateUser: User) {
            try {
                const {_id, ...updateObject}= updateUser;
                const result= await super.update({_id}, updateObject);
                return result
            } catch (ex: unknown) {
                console.log('UserDao sqlite: ', (ex as Error).message);
                throw ex;
            }
        }

        public async deleteUser(deleteUser: Partial<User>) {
            try {
                const {_id} = deleteUser; 
                const result= await super.delete({_id});
                return result;
            } catch (ex: unknown) {
                console.log('UserDao sqlite: ', (ex as Error).message);
                throw ex;
            }
        }
        
}