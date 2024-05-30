/**
 * Convert a 12-hour time string (e.g., "3:30 PM") to a cron expression
 * @param {string} timeStr - The time string in "h:mm AM/PM" format
 * @returns {string} - The cron expression
 */
function timeToCron(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
  
    // Convert to 24-hour format if necessary
    if (modifier.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }
  
    return `${minutes} ${hours} * * *`;
  }
  
  module.exports = timeToCron;
  