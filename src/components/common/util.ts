
export const formatDateDay = (timestamp: number) => {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][date.getDay()];
  
  return `${month}월 ${day}일 ${dayOfWeek}`;
};

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}시 ${minutes}분`;
};

const toLocalYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

export const formatDate = (timestamp: number) => {
  return toLocalYMD(new Date(timestamp));
};

export const formatDateToString = (date: Date) => {
  return toLocalYMD(date);
};

export const formatDisplayDate = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const ScrollTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto',
  });
}