export const categories = ["Project", "Home", "Work", "Education"]

export const priorities = [1, 2, 3]

export const filterTasksBy = ["All", "Home", "Work", "Education", "Project"]

export type Task = {
  id: string,
  uid: string,
  task: string,
  category: string,
  priority: string,
}

export type FirestoreTask = {
  id: string,
  task: string,
  category: string,
  priority: string
}