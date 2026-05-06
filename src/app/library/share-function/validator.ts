
export class Validator {
    public static isValidPassword(input: string): boolean {
        // Regex: only alpha and numberic
        const onlyAlphaNum = /^[A-Za-z0-9]+$/;

        // at least one uppercase letter
        const hasUppercase = /[A-Z]/;

        // at least one digit
        const hasDigit = /[0-9]/;

        return (
            onlyAlphaNum.test(input) &&
            hasUppercase.test(input) &&
            hasDigit.test(input)
        );
    }

    public static isValidEmail(email: string): boolean {
        // Regex format email 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public static isValidVietnamPhone(phone: string): boolean {
        // Regex: bắt đầu bằng 0 hoặc +84, theo sau là 9 số (tổng 10 số hợp lệ)
        const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
        return phoneRegex.test(phone);
    }
}