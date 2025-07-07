const localStorageService = {
    getItem: (key: string) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    setItem: (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (key: string) => {
        localStorage.removeItem(key);
    }
};

export default localStorageService;
