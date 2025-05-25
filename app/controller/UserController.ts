import { Request, Response } from 'express';
import { runWorker } from '@utils/runWorker';
const WORKER_FILE = './../workers/userWorker.ts';

export class UserController {
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const result: any = await runWorker(WORKER_FILE,'getAll');
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const result: any = await runWorker(WORKER_FILE,'create', { payload: req.body });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getUser(req: Request, res: Response): Promise<void> {
    try {
      const result: any = await runWorker(WORKER_FILE,'getById', { id: req.params.id });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const result: any = await runWorker(WORKER_FILE,'update', {
        id: req.params.id,
        payload: req.body,
      });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const result: any = await runWorker(WORKER_FILE,'delete', { id: req.params.id });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
