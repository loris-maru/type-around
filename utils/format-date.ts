const formatDate = (timestamp: { _seconds: number }) => {
  const date = new Date(timestamp._seconds * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default formatDate;
