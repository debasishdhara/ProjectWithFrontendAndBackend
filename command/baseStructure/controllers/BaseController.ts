
// @ts-ignore
import { Request, Response } from 'express';
import { runWorker } from '@utils/runWorker';
const WORKER_FILE = './../workers/SBaseWorker.ts';

export class MBaseController {
  static async getMBases(req: Request, res: Response): Promise<void> {
    try {
      const result: any = await runWorker(WORKER_FILE,'getAll');
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createMBase(req: Request, res: Response): Promise<void> {
    try {
      const result: any = await runWorker(WORKER_FILE,'create', { payload: req.body });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getMBase(req: Request, res: Response): Promise<void> {
    try {
      const result: any = await runWorker(WORKER_FILE,'getById', { id: req.params.id });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateMBase(req: Request, res: Response): Promise<void> {
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

  static async deleteMBase(req: Request, res: Response): Promise<void> {
    try {
      const result: any = await runWorker(WORKER_FILE,'delete', { id: req.params.id });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
