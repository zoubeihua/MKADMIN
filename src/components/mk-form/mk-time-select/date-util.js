import fecha from './date';
export const getRangeHours = function(ranges) {
    const hours = [];
    let disabledHours = [];
  
    (ranges || []).forEach(range => {
      const value = range.map(date => date.getHours());
  
      disabledHours = disabledHours.concat(newArray(value[0], value[1]));
    });
  
    if (disabledHours.length) {
      for (let i = 0; i < 24; i++) {
        hours[i] = disabledHours.indexOf(i) === -1;
      }
    } else {
      for (let i = 0; i < 24; i++) {
        hours[i] = false;
      }
    }
  
    return hours;
  };
  function setRangeData(arr, start, end, value) {
    for (let i = start; i < end; i++) {
      arr[i] = value;
    }
  }
  
  export const getRangeMinutes = function(ranges, hour) {
    const minutes = new Array(60);
  
    if (ranges.length > 0) {
      ranges.forEach(range => {
        const start = range[0];
        const end = range[1];
        const startHour = start.getHours();
        const startMinute = start.getMinutes();
        const endHour = end.getHours();
        const endMinute = end.getMinutes();
        if (startHour === hour && endHour !== hour) {
          setRangeData(minutes, startMinute, 60, true);
        } else if (startHour === hour && endHour === hour) {
          setRangeData(minutes, startMinute, endMinute + 1, true);
        } else if (startHour !== hour && endHour === hour) {
          setRangeData(minutes, 0, endMinute + 1, true);
        } else if (startHour < hour && endHour > hour) {
          setRangeData(minutes, 0, 60, true);
        }
      });
    } else {
      setRangeData(minutes, 0, 60, true);
    }
    return minutes;
  };

  export const modifyTime = function(date, h, m, s) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s, date.getMilliseconds());
  };
  export const limitTimeRange = function(date, ranges, format = 'HH:mm:ss') {
    // TODO: refactory a more elegant solution
    if (ranges.length === 0) return date;
    const normalizeDate = date => fecha.parse(fecha.format(date, format), format);
   
    const ndate = normalizeDate(date);
    const nranges = ranges.map(range => range.map(normalizeDate));
    if (nranges.some(nrange => ndate >= nrange[0] && ndate <= nrange[1])) return date;
  
    let minDate = nranges[0][0];
    let maxDate = nranges[0][0];
  
    nranges.forEach(nrange => {
      minDate = new Date(Math.min(nrange[0], minDate));
      maxDate = new Date(Math.max(nrange[1], minDate));
    });
  
    const ret = ndate < minDate ? minDate : maxDate;
    // preserve Year/Month/Date
    return modifyDate(
      ret,
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  };
  export const isDate = function(date) {
    if (date === null || date === undefined) return false;
    if (isNaN(new Date(date).getTime())) return false;
    if (Array.isArray(date)) return false; // deal with `new Date([ new Date() ]) -> new Date()`
    return true;
  };
  export const clearMilliseconds = function(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);
  };
  export const timeWithinRange = function(date, selectableRange, format) {
    const limitedDate = limitTimeRange(date, selectableRange, format);
    return limitedDate.getTime() === date.getTime();
  };