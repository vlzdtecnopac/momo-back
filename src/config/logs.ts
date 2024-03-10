import { format, createLogger, Logger, transports } from "winston";
import "winston-daily-rotate-file";

export class LoggsConfig {
    private loggerInfo!: Logger;
    private loggerError!: Logger;
    private loggerWarn!: Logger;
    private loggerDebbug!: Logger;
    private loggerALL!: Logger;

    constructor(){
        this.createLogger();
    }

    public log(message: string){
        this.loggerInfo.info(message);
        this.loggerALL.info(message);
    }

    public error(message: string){
        this.loggerError.error(message);
        this.loggerALL.info(message);
    }

    public warn(message: string){
        this.loggerWarn.warn(message);
        this.loggerALL.info(message);
    }

    public debug(message: string){
        this.loggerDebbug.debug(message);
        this.loggerALL.debug(message);
    }

    public verbose(message: string){
        
    }

    private createLogger() {
        const textFormat = format.printf((log) => {
            return `${log.timestamp} - [${log.level.toUpperCase().charAt(0)}], ${log.message}`;
        });

        const dateFormat = format.timestamp({
            format: "YYY-MM-DD HH:mm:ss"
        });

        this.loggerInfo = createLogger({
            level: "info",
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: "log/info/info-%DATE%.log",
                    datePattern: "YYYY-MM-DD",
                    maxFiles: "7d"
                })
            ]
        });


        this.loggerError = createLogger({
            level: "error",
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: "log/error/error-%DATE%.log",
                    datePattern: "YYYY-MM-DD",
                    maxFiles: "7d"
                })
            ]
        });

        this.loggerWarn = createLogger({
            level: "warn",
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: "log/warn/warn-%DATE%.log",
                    datePattern: "YYYY-MM-DD",
                    maxFiles: "7d"
                })
            ]
        });


        this.loggerDebbug =  createLogger({
            level: "debug",
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: "log/debug/debug-%DATE%.log",
                    datePattern: "YYYY-MM-DD",
                    maxFiles: "7d"
                })
            ]
        });

        this.loggerALL = createLogger({
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: "log/all/all-%DATE%.log",
                    datePattern: "YYYY-MM-DD",
                    maxFiles: "7d"
                }),
                new transports.Console()
            ]
        });

    
    }
}