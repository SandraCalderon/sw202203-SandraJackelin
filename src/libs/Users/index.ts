import { getConnection } from "@server/dao/models/sqlite/SqliteConn";
import { UsersDao } from "@server/dao/models/sqlite/UsersDao";

export interface IUser {
    email: String; 
    password: String; 
    firstName: String; 
    lastName: String
};

export class User {
    private dao: UsersDao;
    public constructor() {
        getConnection().then(conn => {
            this.dao= new UsersDao(conn);
        }).catch(ex => 
            {
                console.error(ex);
            })
    }

    public getAllUsers() {
        return this.dao.getUsers();
    }

    public getUserByIndex(index: number) {
        return this.dao.getUserById({_id:index});
    }

    public addUser(user: IUser) {
        return this.dao.createOne(user);
    }

    public updateUser(index: number,user: IUser) {
        return this.dao.update({_id:index}, user);
    }

    public deleteUser(index:number) {
        return this.dao.delete({_id:index});
    }
}