import { format, createLogger, Logger, transports } from 'winston';

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
            format: 'YYY-MM-DD HH:mm:ss'
        });

        this.loggerInfo = createLogger({
            level: 'info',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.File({
                    filename: 'log/info/info.log'
                })
            ]
        });


        this.loggerError = createLogger({
            level: 'error',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.File({
                    filename: 'log/error/error.log'
                })
            ]
        });

        this.loggerWarn = createLogger({
            level: 'warn',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.File({
                    filename: 'log/warn/warn.log'
                })
            ]
        });


        this.loggerDebbug =  createLogger({
            level: 'debug',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.File({
                    filename: 'log/debug/debug.log'
                })
            ]
        })

        this.loggerALL = createLogger({
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.File({
                    filename: 'log/all/all.log'
                }),
                new transports.Console()
            ]
        });

        

    }
}