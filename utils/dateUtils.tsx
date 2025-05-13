export const formatDate = (date: Date, format: string): string => {
    try {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      

      if (format === 'MMM dd, yyyy') {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${monthNames[month]} ${day.toString().padStart(2, '0')}, ${year}`;
      }
      
      if (format === 'yyyy-MM-dd') {
        return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
      
      if (format === 'dd/MM/yyyy') {
        return `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
      }
      
      if (format === 'MMM dd, yyyy HH:mm') {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${monthNames[month]} ${day.toString().padStart(2, '0')}, ${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      

      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  