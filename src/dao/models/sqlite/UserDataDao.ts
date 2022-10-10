import { IUserData } from "../entities/UserData";
import { AbstractDao } from "./AbstractDao";
import sqlite from 'sqlite';

const bcrypt = require("bcrypt");

export class UserDataDao extends AbstractDao<IUserData> {

    public constructor(db:sqlite.Database){
        super('USERDATA', db as sqlite.Database);

        super.exec('CREATE TABLE IF NOT EXISTS USERDATA ('
        + ' _id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,'
        + ' firstName TEXT,'
        + ' lastName TEXT,'
        + ' email TEXT,'
        + ' username TEXT,'
        + ' password TEXT,'
        + ' currentStatus TEXT,'
        + ' createdAt TEXT);').then().catch(e=>console.error(e));
    }

    public async getUsersData(){
        return super.findAll();
    }

    public async getUserDataById(identifier : Partial<IUserData>){
        try {
            const result = await super.findByID(identifier);
            return result;

        } catch (ex: unknown) {
            console.log("UserDataDao sqlite: ", (ex as Error).message);
            throw ex;
        }
    }

    public async getUserDataByUserName(username : string){
        try {
            const result = await super.findByUserName({username:username});
            return result;

        } catch (ex: unknown) {
            console.log("UserDataDao sqlite: ", (ex as Error).message);
            throw ex;
        }
    }

    public async loginUser(userData: Partial<IUserData>){
        try {
            const {username, password} = userData;
            
            const findUserData = await super.findByUserName({username});

            if (!findUserData) {
                return false;
              }else{

                if ( bcrypt.compareSync(password, findUserData.password) && findUserData.currentStatus === 'ACT' )  {
                  return true;
                }else{
                    return false;
                }
              }
        } catch (ex: unknown) {
            console.log("UserDataDao sqlite: ", (ex as Error).message);
            throw ex;
        }
    }

    public async insertNewUserData(newUserData : IUserData){
        try {
            const {password, ...otherData} = newUserData;
            const defaultSettings = {password: await bcrypt.hash(password, 10)};

            const findExistentUsername = await super.findByUserName({username:newUserData.username});
            if (!findExistentUsername) {
                const result = await super.createOne({...otherData, ...defaultSettings});
                return result;
            }else{
                console.error("Error: USERNAME ALREADY REGISTERED");
                return false;
            }

        } catch (ex: unknown) {
            console.log("UserDataDao sqlite: ", (ex as Error).message);
            throw ex;
        }
    }

    public async disableUserData(disableUserData: Partial<IUserData>){
        try {
            const {_id} = disableUserData;

            const findUserById = await super.findByID({_id});

            if (!findUserById) {
                return false;
            }

            return await super.update({_id}, {currentStatus:'INA'});   

        } catch (ex: unknown) {
            console.log("UserDataDao sqlite: ", (ex as Error).message);
            throw ex;
        }
    }

    public async updateUserData(updateUserData : IUserData){
        try {
            //id now comes from object
            const {_id, password, ...updateObject} = updateUserData;
            
            const findUserById = await super.findByID({_id});

            if (!findUserById) {
                return false;
            }

            /* Check if password was sent */
            if (!password) {
                return await super.update({_id}, updateObject);   
            }else{
                const passwordSalty =  {password: await bcrypt.hash(password, 10)};
                return await super.update({_id}, {...updateObject, ...passwordSalty});   
            }

        } catch (ex: unknown) {
            console.log("UserDataDao sqlite: ", (ex as Error).message);
            throw ex;
        }
    }

 
}