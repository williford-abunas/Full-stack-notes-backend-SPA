export const generateId = () => {
  const maxId =
    notesData.length > 0 ? Math.max(...notesData.map((n) => n.id)) : 0
  return maxId + 1
}
