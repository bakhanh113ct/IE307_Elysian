import {useTranslation} from 'react-i18next';
import {TabBarItem} from 'react-native-tab-view';
import {useSelector} from 'react-redux';

function formatDateMonthYearToEN(time) {
  const date = new Date(time).getDate();
  let month = new Date(time).getMonth();
  month += +1;
  const year = new Date(time).getFullYear();
  let result = '';
  switch (month) {
    case 1: {
      result = 'Jan';
      break;
    }
    case 2: {
      result = 'Feb';
      break;
    }
    case 3: {
      result = 'Mar';
      break;
    }
    case 4: {
      result = 'Apr';
      break;
    }
    case 5: {
      result = 'May';
      break;
    }
    case 6: {
      result = 'Jun';
      break;
    }
    case 7: {
      result = 'Jul';
      break;
    }
    case 8: {
      result = 'Aug';
      break;
    }
    case 9: {
      result = 'Sep';
      break;
    }
    case 10: {
      result = 'Oct';
      break;
    }
    case 11: {
      result = 'Nov';
      break;
    }
    case 12: {
      result = 'Dec';
      break;
    }
  }
  result += ', ' + date + ', ' + year + '\n';
  return result;
}
export default function converTimeToFB(time, lang) {
  const {t} = useTranslation();
  if (time == null) return 0;

  const timeStampDate = time;
  const dateInMillis = timeStampDate.seconds * 1000;
  let date = '';
  let month = new Date(dateInMillis).getMonth();
  month += +1;
  if (lang == 'vn') {
    date =
      'Ngày ' +
      new Date(dateInMillis).getDate() +
      ' Tháng ' +
      month +
      ' Năm ' +
      new Date(dateInMillis).getFullYear() +
      ' \n';
  } else {
    date = formatDateMonthYearToEN(dateInMillis);
  }
  let timee = t('Time') + ': ' + new Date(dateInMillis).toLocaleTimeString();
  return date + timee;
}
