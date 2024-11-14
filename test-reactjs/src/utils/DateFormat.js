import moment from "moment"

export const dateFormat = (date, format = null) => {
    if(format == null)
    {
        format = "DD/MM/yy HH:mm:ss";
    }
    return moment(date).format(format);
}