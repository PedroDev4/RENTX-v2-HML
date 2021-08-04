
interface IDateProvider {

    compareInHours(start_date: Date, end_date: Date): number
    convertToUTC(date: Date);
    dateNow(): Date;
    compareInDays(start_date: Date, end_date: Date): number;
    addDays(days: number): Date;
    addHours(hours: number): Date;

}

export { IDateProvider };