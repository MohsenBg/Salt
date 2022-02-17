export const setLocalStorageConvection = (conversationId: string) => {
  if (!conversationId || conversationId === "new" || conversationId === "none")
    return;
  localStorage.setItem(`${conversationId}`, `${Date.now()}`);
};
