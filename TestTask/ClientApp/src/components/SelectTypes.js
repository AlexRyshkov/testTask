import React from "react";

export function SelectTypes() {
    return <React.Fragment>
        <option value="Text">Строка</option>
        <option value="Number">Число</option>
        <option value="Date">Дата</option>
        <option value="Time">Время</option>
        <option value="File">Файл</option>
    </React.Fragment>
}