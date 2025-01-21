export const formatDate = (date: string | Date): string => {
  if (date && date !== "undefined") {
    const data = new Date(date);
    const dia =
      data.getDate() < 10 ? "0" + data.getDate().toString() : data.getDate();
    const mes =
      data.getMonth() + 1 < 10
        ? "0" + (data.getMonth() + 1).toString()
        : data.getMonth() + 1;
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  } else {
    return "";
  }
};

export const invertDate = (date: string | Date): string => {
  if (date) {
    const data = new Date(date);
    const dia =
      data.getDate() < 10 ? "0" + data.getDate().toString() : data.getDate();
    const mes =
      data.getMonth() + 1 < 10
        ? "0" + (data.getMonth() + 1).toString()
        : data.getMonth() + 1;
    const ano = data.getFullYear();
    return `${ano}/${mes}/${dia}`;
  } else {
    return "";
  }
};
