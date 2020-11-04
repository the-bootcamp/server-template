exports.fixTheDate = (date) => {
  // return new Date(new Date(date).toLocaleDateString("de-DE"));
  // return new Date(date.toLocaleDateString("de-DE"));

  return new Date(Date.parse(date)).toString();
};
