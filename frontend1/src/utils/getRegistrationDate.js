function getRegistrationDate(objectId) {
  const timestamp = parseInt(objectId.substring(0, 8), 16);
  const regDate = new Date(timestamp * 1000);
  return regDate.toDateString();
}

export default getRegistrationDate;
