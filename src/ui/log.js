export const createRunLog = (listElement) => {
  const addEntry = (message) => {
    const li = document.createElement("li");
    li.textContent = `${new Date().toLocaleTimeString()} — ${message}`;
    listElement.prepend(li);
  };

  return { addEntry };
};
