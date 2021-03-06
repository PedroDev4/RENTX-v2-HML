import { IDateProvider } from "../IDateProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export { IDateProvider };
class DayjsDateProvider implements IDateProvider {
    dateNow(): Date {
        return dayjs().toDate();
    }

    compareInHours(start_date: Date, end_date: Date): number {
        const endDateUTC = this.convertToUTC(end_date);
        const startDateUTC = this.convertToUTC(start_date);
        return dayjs(endDateUTC).diff(startDateUTC, "hours");
    }

    convertToUTC(date: Date) {
        return dayjs(date).utc().local().format();
    }

    compareInDays(start_date: Date, end_date: Date): number {
        const endDateUTC = this.convertToUTC(end_date);
        const startDateUTC = this.convertToUTC(start_date);
        return dayjs(endDateUTC).diff(startDateUTC, "days");
    }

    addDays(days: number): Date {
        return dayjs().add(days, "days").toDate();
    }

    addHours(hours: number): Date {
        return dayjs().add(hours, "hours").toDate();
    }

    compareIfBefore(start_date: Date, end_date: Date): boolean {
        return dayjs(start_date).isBefore(end_date);
    }


}


export { DayjsDateProvider };