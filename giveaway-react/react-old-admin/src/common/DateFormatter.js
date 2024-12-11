export function DateFormatter(dateString){

    const date = new Date(dateString);
  
    // Array of month names
    const monthNames = [
      "Jan", "Feb", "Mar",
      "April", "May", "June", "July",
      "Aug", "Sept", "Oct",
      "Nov", "Dec"
    ];
    
    // Extract day, month, and year from the date object
    const day = date.getUTCDate();
    const monthIndex = date.getUTCMonth();
    const year = date.getUTCFullYear();
    
    // Format the date
    const formattedDate = day + "-" + monthNames[monthIndex] + "-" + year;
    return formattedDate
  }