/**
 * 로컬스토리지에 데이터를 배열로 관리해주는데 도와주는 모듈
 */
class ArrayStorageHelper {
    constructor() {
    }
    save(key,value) {
        let data = new Array();
        if(localStorage.getItem(key)) {
            data = this.get(key);
            if(data.includes(value)) return;
            data.push(value);
            localStorage.setItem(key,JSON.stringify(data));
        }else {
            data.push(value);
            localStorage.setItem(key,JSON.stringify(data));
        }
    }
    remove(key,value) {
        const data = this.get(key);
        const filterData = data.filter((element,index) => {
           return element !== value
        });
        localStorage.setItem(key,JSON.stringify(filterData));
    }

    isValid(key,value) {
        const data = this.get(key) === null ? '' : this.get(key)
        return data.includes(value);
    }

    get(key) {
        return JSON.parse(localStorage.getItem(key)) === null ? '' : JSON.parse(localStorage.getItem(key));
    }
}


export const localStorageHelper = new ArrayStorageHelper();