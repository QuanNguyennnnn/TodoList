export const groupTasksByDate = (tasks) => {
  const today = new Date();

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isThisWeek = (date) => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return date >= startOfWeek && date <= endOfWeek;
  };

  const groups = { Today: [], 'This Week': [], Later: [] };

  tasks.forEach(task => {
    const created = new Date(task.createdAt);
    if (isSameDay(created, today)) {
      groups.Today.push(task);
    } else if (isThisWeek(created)) {
      groups['This Week'].push(task);
    } else {
      groups.Later.push(task);
    }
  });

  // Chỉ trả về nhóm nào có dữ liệu
  return Object.entries(groups)
    .filter(([_, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
};
