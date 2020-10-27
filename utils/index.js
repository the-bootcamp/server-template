exports.fixTheDate = (date) => {
  return new Date(new Date(date).toLocaleDateString("de-DE"));
};
