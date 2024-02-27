import { Handler } from 'express';

export interface Middleware {
  handle(): Handler
}