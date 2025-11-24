export const isValidUAOEmail = (email) => {
    const uaoPattern = /@uao\.edu\.co$/i;
    return uaoPattern.test(email);
};

export const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

export const isValidIdNumber = (idNumber) => {
    const idPattern = /^\d{6,10}$/;
    return idPattern.test(idNumber);
};

export const isValidPassword = (password) => {
    return password.length >= 6;
};

export const isNotEmpty = (value) => {
    return value && value.trim().length > 0;
};

export const isValidImageFile = (file) => {
    if (!file) return false;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 20 * 1024 * 1024;
    return validTypes.includes(file.type) && file.size <= maxSize;
};

export const isValidPastDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate <= today;
};