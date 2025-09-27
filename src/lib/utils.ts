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

export const findNameById = (gameData, idToFind) => {
    if (gameData) {
      const foundObject = gameData.find((item) => item.id === idToFind);
      return foundObject ? foundObject.name : "Name not found";
    }
    return "Name not found";
  };



  export const shuffleArrayUtils = (arr) => {
  // Create a shallow copy to avoid modifying the original array
  const shuffledArr = [...arr]; 

  for (let i = shuffledArr.length - 1; i > 0; i--) {
    // Generate a random index 'j' between 0 and 'i' (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at index 'i' and 'j'
    [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
  }
  return shuffledArr;
}

export function addTailwindClassesToUl(htmlString) {
  // The regular expression /<ul/g matches all occurrences of "<ul"
  // The 'g' flag ensures a global search and replacement.
  const modifiedString = htmlString.replace(/<ul/g, '<ul style="list-style-type: disc; list-style-position: inside;"');
  return modifiedString;
}