import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizeTime',
  pure: false,
})
export class LocalizeTimePipe implements PipeTransform {

  transform(value: string): string {
    return this.formatTimeTo12Hour(value);
  }

  formatTimeTo12Hour(time: string): string {
    // Split the input time into hours and minutes
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Determine AM or PM suffix
    const period = hour < 12 ? 'AM' : 'PM';

    // Convert hour from 24-hour format to 12-hour format
    if (hour === 0) {
        hour = 12; // Midnight case
    } else if (hour > 12) {
        hour -= 12;
    }

    // Format the hour and minute with leading zeros if necessary
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');

    // Combine everything into the final formatted string
    return `${formattedHour}:${formattedMinute} ${period}`;
}

}
