export const isValidInput = (input) => {
    // 정규 표현식: 한글, 영어, 숫자만 허용 (공백 제외)
    const regex = /^[가-힣A-Za-z0-9]+$/;
    return regex.test(input);
}