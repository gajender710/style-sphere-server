export const validateCredential = (name:string,email:string, password:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!name){
        return { success: false, message: 'Name cannot be empty' };
    }

    if (!emailRegex.test(email)) {
        return { success: false, message: 'Invalid email address' };
    }

    if (!password || password.length < 6) {
        return { success: false, message: `Password must be at least ${6} characters long` };
    }

    return { success: true, message: 'Validation successful' };
};

