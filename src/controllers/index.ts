import { NextFunction, Request, Response } from 'express';
import Joi from '@hapi/joi';
import shortid from 'shortid';
import users from '../db';

export default class Controllers {
  static getAllUsers(req: Request, res: Response) {
    res.status(201).send(users);
  }

  // getUser
  static getUser(req: Request, res: Response) {
    const { id } = req.params;
    const requestedUser = users.find((user) => user.id === id);
    if (!requestedUser) {
      const err: any = new Error(`User with id ${id} does not exist`);
      err.status = 404;
      throw err;
    }

    res.send(requestedUser);
  }

  // createUser

  static validateCreateUser(req: Request, res: Response, next: NextFunction) {
    const userSchema = Joi.object({
      name: Joi.string().required(),
    });
    const result = userSchema.validate(req.body);
    if (result.error) {
      res.status(400).send(result.error);
    }
    next();
  }

  static createUser(req: Request, res: Response) {
    const id = shortid();
    const newUser = {
      ...req.body,
      id,
    };

    users.push(newUser);
    res.status(201).send(newUser);
  }

  // upadteUser
  static validateUpdateUser(req: Request, res: Response, next: NextFunction) {
    const userSchema = Joi.object({
      name: Joi.string(),
    });
    const result = userSchema.validate(req.body);
    if (result.error) {
      res.status(400).send(result.error);
    }
    next();
  }

  static updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const userIndex = users.findIndex((user) => user.id === id);

    users[userIndex] = {
      ...users[userIndex],
      ...req.body,
    };
    res.send(users[userIndex]);
  }

  // deleteUser
  static deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userIndex = users.findIndex((user) => user.id === id);
    users.splice(userIndex, 1);
    res.status(204).send();
  }
}
