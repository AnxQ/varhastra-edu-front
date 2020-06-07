export function simplifyDate(dateStr: string): string {
    let now = new Date();
    let target = new Date(dateStr);
    if (now.getFullYear() - target.getFullYear() >= 1)
        return target.toLocaleDateString();
    else if (now.getMonth() - target.getMonth() >= 1)
        return target.toLocaleDateString().substr(5)
    else if (now.getDay() - target.getDay() >= 7 )
        return target.toLocaleDateString().substr(5)
    else if (now.getDay() - target.getDay() >= 1 && now.getDay() - target.getDay() < 7)
        return `${now.getDay() - target.getDay()}天前`
    else if (now.getHours() - target.getHours() > 1)
        return target.toTimeString().substr(0,5)
    else
        return `${now.getMinutes() - target.getMinutes()}分钟前`
}