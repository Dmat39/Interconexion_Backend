import { ImportService } from './import.service';
export declare class ImportController {
    private svc;
    constructor(svc: ImportService);
    importExcel(file: Express.Multer.File): Promise<import("./import.service").ImportResult>;
    preview(file: Express.Multer.File): Promise<import("./import.service").ImportResult>;
}
