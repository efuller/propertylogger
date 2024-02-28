import express from "express";

// What do we need to do in order to require
// constructor parameters for a class?
// Static create? Abstract class?
export interface ApiRouter {
  getRouter(): express.Router;
  setupRoutes(): void;
}