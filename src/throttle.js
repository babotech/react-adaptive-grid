const debounce = (func, wait) => {
    let timeout
    return (...args) => {
        const later = () => {
            timeout = null
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

export default debounce