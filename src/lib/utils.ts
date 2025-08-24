import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

export const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export   const findNameById = (gameData, idToFind) => {
    let foundObject = {};
    if (gameData) {
      foundObject = gameData.find((item) => item.id === idToFind);
    }
    return foundObject ? foundObject.name : "Name not found";
  };